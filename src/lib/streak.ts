'use client';

const KEY = 'mandarin-hero-streak';

interface StreakData {
  lastStudyDate: string;  // YYYY-MM-DD
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  totalCardsReviewed: number;
  todayCardsReviewed: number;
  todayDate: string;      // YYYY-MM-DD — resets dailyCards
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function load(): StreakData {
  if (typeof window === 'undefined') {
    return { lastStudyDate: '', currentStreak: 0, longestStreak: 0, totalXP: 0, totalCardsReviewed: 0, todayCardsReviewed: 0, todayDate: today() };
  }
  try {
    const raw = localStorage.getItem(KEY);
    const data: StreakData = raw ? JSON.parse(raw) : { lastStudyDate: '', currentStreak: 0, longestStreak: 0, totalXP: 0, totalCardsReviewed: 0, todayCardsReviewed: 0, todayDate: today() };
    // Reset daily counter if new day
    if (data.todayDate !== today()) {
      data.todayCardsReviewed = 0;
      data.todayDate = today();
    }
    return data;
  } catch {
    return { lastStudyDate: '', currentStreak: 0, longestStreak: 0, totalXP: 0, totalCardsReviewed: 0, todayCardsReviewed: 0, todayDate: today() };
  }
}

function save(data: StreakData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getStreakData(): StreakData {
  return load();
}

export function recordStudySession(cardsReviewed: number, correctCount: number) {
  const data = load();
  const t = today();

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (data.lastStudyDate === t) {
    // Already studied today, just update counts
  } else if (data.lastStudyDate === yesterdayStr) {
    data.currentStreak++;
  } else {
    data.currentStreak = 1;
  }

  data.lastStudyDate = t;
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);

  // XP: 1 per card, +1 bonus per correct
  const xpEarned = cardsReviewed + correctCount;
  data.totalXP += xpEarned;
  data.totalCardsReviewed += cardsReviewed;
  data.todayCardsReviewed += cardsReviewed;
  data.todayDate = t;

  save(data);
  return data;
}

export function getLevel(totalXP: number): number {
  return Math.floor(totalXP / 200) + 1;
}

export function getXPToNextLevel(totalXP: number): { current: number; needed: number; progress: number } {
  const level = getLevel(totalXP);
  const xpForCurrentLevel = (level - 1) * 200;
  const xpForNextLevel = level * 200;
  const current = totalXP - xpForCurrentLevel;
  const needed = xpForNextLevel - xpForCurrentLevel;
  return { current, needed, progress: current / needed };
}

export function isStudiedToday(): boolean {
  return load().lastStudyDate === today();
}
