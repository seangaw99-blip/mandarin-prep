// Curriculum: 4 levels, 18 units. Each unit references existing content
// (HSK words, grammar patterns, dialogues, stories, listening drills, scenarios)
// by id — no content is duplicated here.

export type ActivityType =
  | 'vocab'      // SRS flashcard review for unit's words
  | 'grammar'   // grammar pattern study
  | 'listening'  // listening drill
  | 'dialogue'  // practice dialogue
  | 'reading'   // graded story
  | 'speaking'  // scenario / phrases
  | 'tones';    // tone trainer

export interface UnitActivity {
  id: string;          // unique within a unit, e.g. "grammar:gp-001"
  type: ActivityType;
  refId: string;       // id of the referenced content
  label: string;       // short, user-facing
  estMinutes: number;
  href: string;        // route to navigate to
}

export interface Unit {
  id: string;          // e.g. "hsk1-1"
  level: 1 | 2 | 3 | 4;
  index: number;       // unit index within the level (1-based)
  title: string;
  blurb: string;
  vocabIds: string[];  // HSK word IDs that "belong" to this unit
  activities: UnitActivity[];
}

export interface Level {
  level: 1 | 2 | 3 | 4;
  name: string;
  shortName: string;
  description: string;
  emoji: string;
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Foundations',         shortName: 'Foundations', emoji: '🌱', description: 'Pinyin, tones, and your first 30 words.' },
  { level: 2, name: 'HSK 1 Core',          shortName: 'HSK 1',        emoji: '📗', description: 'The essential 150 words and basic sentence patterns.' },
  { level: 3, name: 'HSK 2 Builder',       shortName: 'HSK 2',        emoji: '📘', description: 'Expand to 300 words and conversational patterns.' },
  { level: 4, name: 'HSK 3 Conversational', shortName: 'HSK 3',        emoji: '📕', description: '600 words, longer reading, and free conversation.' },
];

// Helper to make HSK id ranges
function hskIds(prefix: 'hsk1' | 'hsk2' | 'hsk3', start: number, end: number): string[] {
  const out: string[] = [];
  for (let i = start; i <= end; i++) out.push(`${prefix}-${String(i).padStart(3, '0')}`);
  return out;
}

export const UNITS: Unit[] = [
  // ─── Level 1: Foundations ───────────────────────────────────────────────
  {
    id: 'foundations-1',
    level: 1, index: 1,
    title: 'Pinyin & Tones',
    blurb: 'Learn the four tones — the foundation of Mandarin pronunciation.',
    vocabIds: [],
    activities: [
      { id: 'tones:trainer',     type: 'tones',     refId: 'tones',    label: 'Tone Trainer',         estMinutes: 5, href: '/train/tones' },
      { id: 'listening:drill-001', type: 'listening', refId: 'drill-001', label: 'Listen: 你好',       estMinutes: 2, href: '/train/listening' },
      { id: 'listening:drill-002', type: 'listening', refId: 'drill-002', label: 'Listen: 谢谢',       estMinutes: 2, href: '/train/listening' },
      { id: 'listening:drill-004', type: 'listening', refId: 'drill-004', label: 'Listen: 再见',       estMinutes: 2, href: '/train/listening' },
    ],
  },
  {
    id: 'foundations-2',
    level: 1, index: 2,
    title: 'Survival Greetings',
    blurb: '20 words that get you through your first day in China.',
    vocabIds: hskIds('hsk1', 1, 20),
    activities: [
      { id: 'speaking:airport',   type: 'speaking',  refId: 'airport',   label: 'Phrases: Airport',    estMinutes: 5, href: '/phrases/airport' },
      { id: 'listening:drill-005', type: 'listening', refId: 'drill-005', label: 'Listen: My name is…', estMinutes: 2, href: '/train/listening' },
      { id: 'grammar:gp-001',     type: 'grammar',   refId: 'gp-001',    label: 'Grammar: 是 (to be)',  estMinutes: 4, href: '/grammar' },
    ],
  },

  // ─── Level 2: HSK 1 Core ────────────────────────────────────────────────
  {
    id: 'hsk1-1',
    level: 2, index: 1,
    title: 'People & Self',
    blurb: 'Talk about yourself, family, and the people around you.',
    vocabIds: hskIds('hsk1', 21, 50),
    activities: [
      { id: 'grammar:gp-002', type: 'grammar',   refId: 'gp-002',     label: 'Grammar: 不是 (is not)',  estMinutes: 4, href: '/grammar' },
      { id: 'grammar:gp-003', type: 'grammar',   refId: 'gp-003',     label: 'Grammar: 吗 questions',   estMinutes: 4, href: '/grammar' },
      { id: 'reading:story-001', type: 'reading', refId: 'story-001', label: 'Read: 我的家',           estMinutes: 6, href: '/read' },
      { id: 'dialogue:dlg-8', type: 'dialogue',  refId: 'dlg-8',      label: 'Dialogue: Self-intro',   estMinutes: 5, href: '/practice/self-intro' },
    ],
  },
  {
    id: 'hsk1-2',
    level: 2, index: 2,
    title: 'Numbers & Time',
    blurb: 'Numbers, dates, and asking when things happen.',
    vocabIds: hskIds('hsk1', 51, 80),
    activities: [
      { id: 'grammar:gp-004', type: 'grammar',   refId: 'gp-004',     label: 'Grammar: 有 (to have)',  estMinutes: 4, href: '/grammar' },
      { id: 'grammar:gp-005', type: 'grammar',   refId: 'gp-005',     label: 'Grammar: 几 / 多少',     estMinutes: 4, href: '/grammar' },
      { id: 'listening:drill-009', type: 'listening', refId: 'drill-009', label: 'Listen: 多少钱?',    estMinutes: 2, href: '/train/listening' },
      { id: 'reading:story-002', type: 'reading', refId: 'story-002', label: 'Read: HSK 1 story',     estMinutes: 6, href: '/read' },
    ],
  },
  {
    id: 'hsk1-3',
    level: 2, index: 3,
    title: 'Getting Around',
    blurb: 'Taxis, directions, and asking where things are.',
    vocabIds: hskIds('hsk1', 81, 110),
    activities: [
      { id: 'grammar:gp-006', type: 'grammar',   refId: 'gp-006',     label: 'Grammar: 在 (location)',  estMinutes: 4, href: '/grammar' },
      { id: 'grammar:gp-007', type: 'grammar',   refId: 'gp-007',     label: 'Grammar: 哪 (where)',    estMinutes: 4, href: '/grammar' },
      { id: 'speaking:taxi',  type: 'speaking',  refId: 'taxi',      label: 'Phrases: Taxi',          estMinutes: 5, href: '/phrases/taxi' },
      { id: 'dialogue:dlg-3', type: 'dialogue',  refId: 'dlg-3',      label: 'Dialogue: Taking a taxi', estMinutes: 5, href: '/practice/taxi' },
    ],
  },
  {
    id: 'hsk1-4',
    level: 2, index: 4,
    title: 'Hotel & Lodging',
    blurb: 'Check in, ask for things, handle hotel basics.',
    vocabIds: hskIds('hsk1', 111, 130),
    activities: [
      { id: 'grammar:gp-008', type: 'grammar',   refId: 'gp-008',     label: 'Grammar: 想 (want to)',   estMinutes: 4, href: '/grammar' },
      { id: 'grammar:gp-009', type: 'grammar',   refId: 'gp-009',     label: 'Grammar: 请 (please)',   estMinutes: 4, href: '/grammar' },
      { id: 'speaking:hotel', type: 'speaking',  refId: 'hotel',     label: 'Phrases: Hotel',         estMinutes: 5, href: '/phrases/hotel' },
      { id: 'dialogue:dlg-1', type: 'dialogue',  refId: 'dlg-1',      label: 'Dialogue: Hotel check-in', estMinutes: 5, href: '/practice/hotel' },
      { id: 'reading:story-003', type: 'reading', refId: 'story-003', label: 'Read: HSK 1 story',     estMinutes: 6, href: '/read' },
    ],
  },
  {
    id: 'hsk1-5',
    level: 2, index: 5,
    title: 'Food & Restaurants',
    blurb: 'Order food, ask about ingredients, pay the bill.',
    vocabIds: hskIds('hsk1', 131, 150),
    activities: [
      { id: 'grammar:gp-010', type: 'grammar',   refId: 'gp-010',     label: 'Grammar: 喜欢 (to like)', estMinutes: 4, href: '/grammar' },
      { id: 'grammar:gp-011', type: 'grammar',   refId: 'gp-011',     label: 'Grammar: 也 (also)',     estMinutes: 4, href: '/grammar' },
      { id: 'speaking:restaurant', type: 'speaking', refId: 'restaurant', label: 'Phrases: Restaurant', estMinutes: 5, href: '/phrases/restaurant' },
      { id: 'dialogue:dlg-2', type: 'dialogue',  refId: 'dlg-2',      label: 'Dialogue: Restaurant',   estMinutes: 5, href: '/practice/restaurant' },
    ],
  },

  // ─── Level 3: HSK 2 Builder ─────────────────────────────────────────────
  {
    id: 'hsk2-1',
    level: 3, index: 1,
    title: 'Shopping & Money',
    blurb: 'Bargain, compare prices, and shop with confidence.',
    vocabIds: hskIds('hsk2', 1, 30),
    activities: [
      { id: 'grammar:gp-016', type: 'grammar',   refId: 'gp-016',     label: 'Grammar: 比 (comparison)', estMinutes: 5, href: '/grammar' },
      { id: 'grammar:gp-017', type: 'grammar',   refId: 'gp-017',     label: 'Grammar: 太…了',         estMinutes: 5, href: '/grammar' },
      { id: 'speaking:shopping', type: 'speaking', refId: 'shopping', label: 'Phrases: Shopping',      estMinutes: 5, href: '/phrases/shopping' },
      { id: 'dialogue:dlg-7',  type: 'dialogue', refId: 'dlg-7',      label: 'Dialogue: Shopping',    estMinutes: 5, href: '/practice/shopping' },
      { id: 'reading:story-004', type: 'reading', refId: 'story-004', label: 'Read: HSK 2 story',     estMinutes: 7, href: '/read' },
    ],
  },
  {
    id: 'hsk2-2',
    level: 3, index: 2,
    title: 'Daily Routines',
    blurb: 'Describe your day, your habits, your week.',
    vocabIds: hskIds('hsk2', 31, 60),
    activities: [
      { id: 'grammar:gp-018', type: 'grammar',   refId: 'gp-018',     label: 'Grammar: 每 (every)',    estMinutes: 5, href: '/grammar' },
      { id: 'grammar:gp-019', type: 'grammar',   refId: 'gp-019',     label: 'Grammar: 都 (all/both)', estMinutes: 5, href: '/grammar' },
      { id: 'listening:drill-019', type: 'listening', refId: 'drill-019', label: 'Listen: HSK 2 dictation', estMinutes: 3, href: '/train/listening' },
      { id: 'dialogue:dlg-9',  type: 'dialogue', refId: 'dlg-9',      label: 'Dialogue: Daily routine', estMinutes: 5, href: '/practice/daily-routine' },
    ],
  },
  {
    id: 'hsk2-3',
    level: 3, index: 3,
    title: 'Feelings & Health',
    blurb: 'Talk about how you feel, body, and basic medical situations.',
    vocabIds: hskIds('hsk2', 61, 90),
    activities: [
      { id: 'grammar:gp-020', type: 'grammar',   refId: 'gp-020',     label: 'Grammar: 觉得 (to think/feel)', estMinutes: 5, href: '/grammar' },
      { id: 'grammar:gp-021', type: 'grammar',   refId: 'gp-021',     label: 'Grammar: 因为…所以…',  estMinutes: 5, href: '/grammar' },
      { id: 'speaking:emergency', type: 'speaking', refId: 'emergency', label: 'Phrases: Emergency',  estMinutes: 5, href: '/phrases/emergency' },
      { id: 'dialogue:dlg-6',  type: 'dialogue', refId: 'dlg-6',      label: 'Dialogue: Feeling sick', estMinutes: 5, href: '/practice/emergency' },
      { id: 'reading:story-005', type: 'reading', refId: 'story-005', label: 'Read: HSK 2 story',     estMinutes: 7, href: '/read' },
    ],
  },
  {
    id: 'hsk2-4',
    level: 3, index: 4,
    title: 'Travel & Places',
    blurb: 'Move around cities, plan trips, describe places.',
    vocabIds: hskIds('hsk2', 91, 120),
    activities: [
      { id: 'grammar:gp-022', type: 'grammar',   refId: 'gp-022',     label: 'Grammar: 从…到…',         estMinutes: 5, href: '/grammar' },
      { id: 'grammar:gp-023', type: 'grammar',   refId: 'gp-023',     label: 'Grammar: 离 (distance)', estMinutes: 5, href: '/grammar' },
      { id: 'grammar:gp-024', type: 'grammar',   refId: 'gp-024',     label: 'Grammar: 要 (want/need)', estMinutes: 5, href: '/grammar' },
      { id: 'listening:drill-024', type: 'listening', refId: 'drill-024', label: 'Listen: HSK 2 dictation', estMinutes: 3, href: '/train/listening' },
    ],
  },
  {
    id: 'hsk2-5',
    level: 3, index: 5,
    title: 'Work & Study',
    blurb: 'Talk about your job, school, and what you do every day.',
    vocabIds: hskIds('hsk2', 121, 150),
    activities: [
      { id: 'grammar:gp-025', type: 'grammar',   refId: 'gp-025',     label: 'Grammar: 会 (will/can)',  estMinutes: 5, href: '/grammar' },
      { id: 'grammar:gp-026', type: 'grammar',   refId: 'gp-026',     label: 'Grammar: 能 (be able to)', estMinutes: 5, href: '/grammar' },
      { id: 'grammar:gp-027', type: 'grammar',   refId: 'gp-027',     label: 'Grammar: 可以 (allowed)', estMinutes: 5, href: '/grammar' },
      { id: 'speaking:factory', type: 'speaking', refId: 'factory',   label: 'Phrases: Factory visit', estMinutes: 5, href: '/phrases/factory' },
    ],
  },

  // ─── Level 4: HSK 3 Conversational ──────────────────────────────────────
  {
    id: 'hsk3-1',
    level: 4, index: 1,
    title: 'Business Basics',
    blurb: 'Introduce your company and discuss what you do.',
    vocabIds: hskIds('hsk3', 1, 50),
    activities: [
      { id: 'grammar:gp-041', type: 'grammar',   refId: 'gp-041',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-042', type: 'grammar',   refId: 'gp-042',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'dialogue:dlg-4',  type: 'dialogue', refId: 'dlg-4',      label: 'Dialogue: Factory tour', estMinutes: 6, href: '/practice/factory' },
      { id: 'reading:story-006', type: 'reading', refId: 'story-006', label: 'Read: HSK 3 story',     estMinutes: 8, href: '/read' },
    ],
  },
  {
    id: 'hsk3-2',
    level: 4, index: 2,
    title: 'Negotiation',
    blurb: 'Discuss price, MOQ, delivery, and reach an agreement.',
    vocabIds: hskIds('hsk3', 51, 100),
    activities: [
      { id: 'grammar:gp-043', type: 'grammar',   refId: 'gp-043',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-044', type: 'grammar',   refId: 'gp-044',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'speaking:negotiation', type: 'speaking', refId: 'negotiation', label: 'Phrases: Negotiation', estMinutes: 6, href: '/phrases/negotiation' },
      { id: 'dialogue:dlg-5',  type: 'dialogue', refId: 'dlg-5',      label: 'Dialogue: Price talk',   estMinutes: 6, href: '/practice/negotiation' },
    ],
  },
  {
    id: 'hsk3-3',
    level: 4, index: 3,
    title: 'Opinions & Discussion',
    blurb: 'Express opinions, agree, disagree, give reasons.',
    vocabIds: hskIds('hsk3', 101, 150),
    activities: [
      { id: 'grammar:gp-045', type: 'grammar',   refId: 'gp-045',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-046', type: 'grammar',   refId: 'gp-046',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-047', type: 'grammar',   refId: 'gp-047',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
    ],
  },
  {
    id: 'hsk3-4',
    level: 4, index: 4,
    title: 'Past & Future',
    blurb: 'Talk about what happened and what will happen.',
    vocabIds: hskIds('hsk3', 151, 200),
    activities: [
      { id: 'grammar:gp-048', type: 'grammar',   refId: 'gp-048',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-049', type: 'grammar',   refId: 'gp-049',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-050', type: 'grammar',   refId: 'gp-050',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
    ],
  },
  {
    id: 'hsk3-5',
    level: 4, index: 5,
    title: 'Society & Culture',
    blurb: 'Read about culture, tradition, and society.',
    vocabIds: hskIds('hsk3', 201, 250),
    activities: [
      { id: 'grammar:gp-051', type: 'grammar',   refId: 'gp-051',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-052', type: 'grammar',   refId: 'gp-052',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-053', type: 'grammar',   refId: 'gp-053',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
    ],
  },
  {
    id: 'hsk3-6',
    level: 4, index: 6,
    title: 'Free Conversation',
    blurb: 'Apply everything in open-ended chat.',
    vocabIds: hskIds('hsk3', 251, 300),
    activities: [
      { id: 'grammar:gp-054', type: 'grammar',   refId: 'gp-054',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'grammar:gp-055', type: 'grammar',   refId: 'gp-055',     label: 'Grammar: HSK 3 pattern', estMinutes: 6, href: '/grammar' },
      { id: 'speaking:chat',  type: 'speaking',  refId: 'chat',      label: 'AI Chat practice',       estMinutes: 10, href: '/chat' },
    ],
  },
];

export function getUnit(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function getUnitsByLevel(level: 1 | 2 | 3 | 4): Unit[] {
  return UNITS.filter((u) => u.level === level);
}

export function getNextUnit(id: string): Unit | undefined {
  const i = UNITS.findIndex((u) => u.id === id);
  if (i < 0 || i >= UNITS.length - 1) return undefined;
  return UNITS[i + 1];
}

export function getFirstUnitOfLevel(level: 1 | 2 | 3 | 4): Unit {
  return getUnitsByLevel(level)[0];
}
