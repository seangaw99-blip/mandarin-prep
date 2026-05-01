// Curriculum logic: progress tracking, unit unlocking, daily task generation.

import { db, type UnitProgress } from './db';
import { UNITS, type Unit, type UnitActivity, getUnit } from '@/data/curriculum';
import { getUserProfile } from './user-profile';

export type DailyTask = {
  id: string;            // stable id (activity id, or "vocab:<unitId>")
  type: 'vocab' | UnitActivity['type'];
  label: string;
  href: string;
  estMinutes: number;
  done: boolean;
};

const VOCAB_TASK_TYPE = 'vocab' as const;

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Progress tracking ──────────────────────────────────────────────────

export async function getAllProgress(): Promise<UnitProgress[]> {
  return db.unitProgress.toArray();
}

export async function getUnitProgress(unitId: string): Promise<UnitProgress | undefined> {
  return db.unitProgress.get(unitId);
}

export async function setUnitProgress(p: UnitProgress): Promise<void> {
  await db.unitProgress.put(p);
}

export async function markActivityDone(unitId: string, activityId: string): Promise<void> {
  let p = await db.unitProgress.get(unitId);
  if (!p) {
    p = { unitId, status: 'in_progress', completedActivities: [activityId], startedAt: Date.now() };
  } else {
    if (!p.completedActivities.includes(activityId)) {
      p.completedActivities = [...p.completedActivities, activityId];
    }
    if (p.status === 'available' || p.status === 'locked') {
      p.status = 'in_progress';
      p.startedAt = p.startedAt ?? Date.now();
    }
  }
  await db.unitProgress.put(p);
  await maybeCompleteUnit(unitId);
}

// Returns the proportion of unit's vocab that has at least one successful review.
async function vocabMastery(unit: Unit): Promise<number> {
  if (unit.vocabIds.length === 0) return 1;
  let learned = 0;
  for (const wordId of unit.vocabIds) {
    const card = await db.srsCards
      .where('wordId').equals(wordId)
      .first();
    if (card && card.repetitions > 0) learned++;
  }
  return learned / unit.vocabIds.length;
}

export async function maybeCompleteUnit(unitId: string): Promise<boolean> {
  const unit = getUnit(unitId);
  if (!unit) return false;
  const p = await db.unitProgress.get(unitId);
  if (!p || p.status === 'completed') return false;
  const allActivitiesDone = unit.activities.every((a) => p.completedActivities.includes(a.id));
  const mastery = await vocabMastery(unit);
  if (allActivitiesDone && mastery >= 0.8) {
    await db.unitProgress.put({ ...p, status: 'completed', completedAt: Date.now() });
    return true;
  }
  return false;
}

// ─── Current unit selection ─────────────────────────────────────────────

// Map onboarding starting level → first unit id
function startingUnitForProfile(): string {
  const profile = getUserProfile();
  if (!profile) return UNITS[0].id;
  switch (profile.startingLevel) {
    case 'beginner':  return 'foundations-1';
    case 'basics':    return 'foundations-2';
    case 'hsk1':      return 'hsk1-3';
    case 'hsk2plus':  return 'hsk2-1';
    default:          return UNITS[0].id;
  }
}

export async function getCurrentUnit(): Promise<Unit> {
  const all = await db.unitProgress.toArray();
  // First in-progress unit (in curriculum order)
  for (const u of UNITS) {
    const p = all.find((x) => x.unitId === u.id);
    if (p && p.status === 'in_progress') return u;
  }
  // Otherwise, first non-completed unit at or after the user's starting unit
  const startId = startingUnitForProfile();
  const startIdx = Math.max(0, UNITS.findIndex((u) => u.id === startId));
  for (let i = startIdx; i < UNITS.length; i++) {
    const p = all.find((x) => x.unitId === UNITS[i].id);
    if (!p || p.status !== 'completed') return UNITS[i];
  }
  // Everything completed
  return UNITS[UNITS.length - 1];
}

// ─── Daily task generator ───────────────────────────────────────────────

// Fixed weekday rotation:
// Sun (0) review, Mon (1) grammar, Tue (2) listening, Wed (3) dialogue,
// Thu (4) reading, Fri (5) speaking, Sat (6) review.
const DAY_FOCUS: Record<number, UnitActivity['type'] | 'review'> = {
  0: 'review',
  1: 'grammar',
  2: 'listening',
  3: 'dialogue',
  4: 'reading',
  5: 'speaking',
  6: 'review',
};

function pickActivities(unit: Unit, focus: UnitActivity['type'] | 'review'): UnitActivity[] {
  if (focus === 'review') {
    // Review day: pick up to 2 activities of any non-vocab type, prefer ones not yet done
    return unit.activities.slice(0, 2);
  }
  const matching = unit.activities.filter((a) => a.type === focus);
  if (matching.length > 0) return matching.slice(0, 2);
  // Fallback: any activity from the unit
  return unit.activities.slice(0, 1);
}

export async function getDailyTasks(): Promise<{ unit: Unit; tasks: DailyTask[] }> {
  const unit = await getCurrentUnit();
  const date = todayKey();
  const state = (await db.dailyTaskState.get(date)) ?? { date, completedTaskIds: [] };
  const dow = new Date().getDay();
  const focus = DAY_FOCUS[dow];

  const tasks: DailyTask[] = [];

  // Always include vocab review for the unit
  if (unit.vocabIds.length > 0) {
    tasks.push({
      id: `vocab:${unit.id}`,
      type: VOCAB_TASK_TYPE,
      label: `Review ${unit.title} vocabulary`,
      href: '/study?mode=en2zh',
      estMinutes: 8,
      done: state.completedTaskIds.includes(`vocab:${unit.id}`),
    });
  }

  const progress = await db.unitProgress.get(unit.id);
  const doneActivities = new Set(progress?.completedActivities ?? []);

  for (const a of pickActivities(unit, focus)) {
    tasks.push({
      id: a.id,
      type: a.type,
      label: a.label,
      href: a.href,
      estMinutes: a.estMinutes,
      done: doneActivities.has(a.id) || state.completedTaskIds.includes(a.id),
    });
  }

  return { unit, tasks };
}

export async function markTaskDoneToday(taskId: string, unitId?: string): Promise<void> {
  const date = todayKey();
  const existing = (await db.dailyTaskState.get(date)) ?? { date, completedTaskIds: [] };
  if (!existing.completedTaskIds.includes(taskId)) {
    existing.completedTaskIds = [...existing.completedTaskIds, taskId];
    await db.dailyTaskState.put(existing);
  }
  // Also mark on unit progress if it's an activity (not vocab)
  if (unitId && !taskId.startsWith('vocab:')) {
    await markActivityDone(unitId, taskId);
  }
}

export function getDayFocusLabel(): string {
  const dow = new Date().getDay();
  const focus = DAY_FOCUS[dow];
  switch (focus) {
    case 'grammar':   return 'Grammar Day';
    case 'listening': return 'Listening Day';
    case 'dialogue':  return 'Dialogue Day';
    case 'reading':   return 'Reading Day';
    case 'speaking':  return 'Speaking Day';
    case 'review':    return 'Review Day';
    default:          return 'Today';
  }
}
