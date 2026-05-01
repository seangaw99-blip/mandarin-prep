'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame, Zap, GraduationCap, BookOpen, MessageCircle,
  ChevronRight, Dumbbell, BookMarked, ArrowRight, Map, CheckCircle2, Circle,
  Headphones, Mic, Music,
} from 'lucide-react';
import Header from '@/components/layout/header';
import { getUserProfile, getGreeting, type UserProfile } from '@/lib/user-profile';
import { getStreakData, getLevel, getXPToNextLevel, isStudiedToday } from '@/lib/streak';
import { getDeckStats } from '@/lib/srs';
import { db } from '@/lib/db';
import { hsk1Words } from '@/data/hsk/hsk1';
import { hsk2Words } from '@/data/hsk/hsk2';
import { hsk3Words } from '@/data/hsk/hsk3';
import { getDailyTasks, getDayFocusLabel, markTaskDoneToday, type DailyTask } from '@/lib/curriculum';
import type { Unit } from '@/data/curriculum';

// Seed HSK decks if needed (idempotent)
async function ensureDecksSeeded() {
  const count = await db.srsCards.count();
  if (count > 0) return;
  const DAY = 86_400_000;
  const cards = [
    ...hsk1Words.map((w) => ({
      id: `hsk1:${w.id}:zh2en`,
      deckId: 'hsk1',
      wordId: w.id,
      cardType: 'zh2en' as const,
      due: Date.now(),
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
      queue: 'new' as const,
      learningStep: 0,
    })),
    ...hsk2Words.map((w) => ({
      id: `hsk2:${w.id}:zh2en`,
      deckId: 'hsk2',
      wordId: w.id,
      cardType: 'zh2en' as const,
      due: Date.now() + DAY * 3,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
      queue: 'new' as const,
      learningStep: 0,
    })),
    ...hsk3Words.map((w) => ({
      id: `hsk3:${w.id}:zh2en`,
      deckId: 'hsk3',
      wordId: w.id,
      cardType: 'zh2en' as const,
      due: Date.now() + DAY * 14,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
      queue: 'new' as const,
      learningStep: 0,
    })),
  ];
  await db.srsCards.bulkPut(cards);
}

interface DashboardStats {
  hsk1: Awaited<ReturnType<typeof getDeckStats>>;
  hsk2: Awaited<ReturnType<typeof getDeckStats>>;
  hsk3: Awaited<ReturnType<typeof getDeckStats>>;
  totalDue: number;
  savedWords: number;
}

const QUICK_ACTIONS = [
  { href: '/lessons', icon: Map, label: 'Lessons', color: 'bg-primary' },
  { href: '/dictionary', icon: BookOpen, label: 'Dictionary', color: 'bg-blue-500' },
  { href: '/train', icon: Dumbbell, label: 'Training', color: 'bg-purple-500' },
  { href: '/chat', icon: MessageCircle, label: 'Practice', color: 'bg-emerald-500' },
  { href: '/grammar', icon: BookMarked, label: 'Grammar', color: 'bg-orange-500' },
  { href: '/more', icon: ArrowRight, label: 'More', color: 'bg-muted' },
];

const TASK_ICON: Record<DailyTask['type'], React.ComponentType<{ className?: string }>> = {
  vocab: BookOpen,
  grammar: BookMarked,
  listening: Headphones,
  dialogue: MessageCircle,
  reading: BookOpen,
  speaking: Mic,
  tones: Music,
};

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [greeting, setGreeting] = useState({ chinese: '', pinyin: '', english: '' });
  const [streak, setStreak] = useState({ currentStreak: 0, totalXP: 0, todayCardsReviewed: 0 });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [studiedToday, setStudiedToday] = useState(false);
  const [dailyUnit, setDailyUnit] = useState<Unit | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);

  const refreshDailyTasks = async () => {
    const { unit, tasks } = await getDailyTasks();
    setDailyUnit(unit);
    setDailyTasks(tasks);
  };

  const handleTaskClick = async (task: DailyTask) => {
    if (dailyUnit) {
      await markTaskDoneToday(task.id, dailyUnit.id);
    }
    router.push(task.href);
  };

  useEffect(() => {
    const p = getUserProfile();
    if (!p) { router.push('/onboarding'); return; }
    setProfile(p);
    setGreeting(getGreeting(p));
    setStreak(getStreakData());
    setStudiedToday(isStudiedToday());

    ensureDecksSeeded().then(async () => {
      const [hsk1, hsk2, hsk3] = await Promise.all([
        getDeckStats('hsk1'),
        getDeckStats('hsk2'),
        getDeckStats('hsk3'),
      ]);
      const saved = await db.savedWords.count();
      setStats({
        hsk1,
        hsk2,
        hsk3,
        totalDue: hsk1.due + hsk2.due + hsk3.due,
        savedWords: saved,
      });
      await refreshDailyTasks();
    });
  }, [router]);

  const level = getLevel(streak.totalXP);
  const xpProgress = getXPToNextLevel(streak.totalXP);
  const dailyGoal = 20;
  const dailyProgress = Math.min(streak.todayCardsReviewed / dailyGoal, 1);

  const hsk1Pct = stats
    ? Math.round(((stats.hsk1.total - stats.hsk1.new) / Math.max(stats.hsk1.total, 1)) * 100)
    : 0;
  const hsk2Pct = stats
    ? Math.round(((stats.hsk2.total - stats.hsk2.new) / Math.max(stats.hsk2.total, 1)) * 100)
    : 0;
  const hsk3Pct = stats
    ? Math.round(((stats.hsk3.total - stats.hsk3.new) / Math.max(stats.hsk3.total, 1)) * 100)
    : 0;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header title="Mandarin Hero" />

      <div className="mx-auto max-w-lg px-4 py-5 space-y-4">

        {/* Greeting */}
        {greeting.chinese && (
          <div className="rounded-2xl bg-gradient-to-br from-primary to-red-700 p-5 text-white">
            <p className="font-chinese text-2xl font-bold">{greeting.chinese}</p>
            <p className="text-sm opacity-70 mt-1">{greeting.pinyin}</p>
            <p className="text-sm opacity-90 mt-0.5">{greeting.english}</p>
          </div>
        )}

        {/* Streak + XP */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`rounded-2xl p-4 text-center ${studiedToday ? 'bg-orange-500/10' : 'bg-card'}`}>
            <Flame className={`h-6 w-6 mx-auto mb-1 ${studiedToday ? 'text-orange-500' : 'text-muted'}`} />
            <p className={`text-2xl font-bold ${studiedToday ? 'text-orange-500' : 'text-foreground'}`}>
              {streak.currentStreak}
            </p>
            <p className="text-xs text-muted">Day streak</p>
          </div>
          <div className="rounded-2xl bg-card p-4 text-center">
            <Zap className="h-6 w-6 mx-auto mb-1 text-secondary" />
            <p className="text-2xl font-bold text-secondary">{streak.totalXP}</p>
            <p className="text-xs text-muted">Total XP</p>
          </div>
          <div className="rounded-2xl bg-card p-4 text-center">
            <GraduationCap className="h-6 w-6 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold text-primary">{level}</p>
            <p className="text-xs text-muted">Level</p>
          </div>
        </div>

        {/* XP progress bar */}
        <div>
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>Lv {level}</span>
            <span>{xpProgress.current} / {xpProgress.needed} XP to Lv {level + 1}</span>
          </div>
          <div className="h-2 bg-card rounded-full">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${xpProgress.progress * 100}%` }}
            />
          </div>
        </div>

        {/* Today's Lesson */}
        {dailyUnit && (
          <div className="rounded-2xl bg-card p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold">Today&apos;s Lesson</h2>
              <span className="text-xs font-medium text-primary">{getDayFocusLabel()}</span>
            </div>
            <Link href={`/lessons/${dailyUnit.id}`}>
              <p className="text-sm text-muted mb-3 hover:text-foreground transition-colors">
                {dailyUnit.title} · {dailyTasks.filter((t) => t.done).length}/{dailyTasks.length} done
              </p>
            </Link>
            <div className="space-y-2 mb-3">
              {dailyTasks.map((t) => {
                const Icon = TASK_ICON[t.type];
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTaskClick(t)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      t.done ? 'bg-success/5' : 'bg-background hover:bg-background/70'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${t.done ? 'text-success' : 'text-muted'}`} />
                    <span className={`flex-1 text-sm truncate ${t.done ? 'line-through text-muted' : ''}`}>
                      {t.label}
                    </span>
                    <span className="text-xs text-muted shrink-0">{t.estMinutes}m</span>
                    {t.done
                      ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      : <Circle className="h-4 w-4 text-muted shrink-0" />
                    }
                  </button>
                );
              })}
            </div>
            <div className="h-2 bg-background rounded-full mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${dailyProgress >= 1 ? 'bg-success' : 'bg-primary'}`}
                style={{ width: `${dailyTasks.length > 0
                  ? (dailyTasks.filter((t) => t.done).length / dailyTasks.length) * 100
                  : 0}%` }}
              />
            </div>
            <Link href="/study">
              <button className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white flex items-center justify-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Start Flashcards
                {stats && stats.totalDue > 0 && (
                  <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {stats.totalDue} due
                  </span>
                )}
                <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        )}

        {/* Daily streak goal — small */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-1.5 bg-card rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-500 ${dailyProgress >= 1 ? 'bg-success' : 'bg-primary'}`}
              style={{ width: `${dailyProgress * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted shrink-0">{streak.todayCardsReviewed}/{dailyGoal} cards</span>
        </div>

        {/* HSK Progress */}
        {stats && (
          <div className="rounded-2xl bg-card p-5">
            <h2 className="font-semibold mb-3">Curriculum Progress</h2>
            <div className="space-y-3">
              {[
                { label: 'HSK 1', pct: hsk1Pct, total: stats.hsk1.total, mature: stats.hsk1.mature },
                { label: 'HSK 2', pct: hsk2Pct, total: stats.hsk2.total, mature: stats.hsk2.mature },
                { label: 'HSK 3', pct: hsk3Pct, total: stats.hsk3.total, mature: stats.hsk3.mature },
              ].map((deck) => (
                <div key={deck.label}>
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span className="font-medium text-foreground">{deck.label}</span>
                    <span>{deck.pct}% started · {deck.mature} mature</span>
                  </div>
                  <div className="h-2 bg-background rounded-full">
                    <div
                      className="h-full bg-primary/70 rounded-full transition-all"
                      style={{ width: `${deck.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted pt-1">HSK 4–6 coming soon</p>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h2 className="font-semibold mb-3">Quick Access</h2>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href}>
                <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-3 active:scale-95 transition-transform">
                  <div className={`rounded-full ${a.color} p-3`}>
                    <a.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium">{a.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Saved words shortcut */}
        {stats && stats.savedWords > 0 && (
          <Link href="/dictionary">
            <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 active:scale-[0.98] transition-transform">
              <BookMarked className="h-5 w-5 text-secondary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Saved Words</p>
                <p className="text-xs text-muted">{stats.savedWords} words bookmarked</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted" />
            </div>
          </Link>
        )}

      </div>
    </div>
  );
}
