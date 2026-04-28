'use client';

export interface CardProgress {
  cardId: string;
  correct: number;
  incorrect: number;
  lastSeen: number;
  nextReview: number;
  level: number; // 0-5 SM-2 level
}

const STORAGE_KEY = 'mandarin-prep-progress';

export function getProgress(): Record<string, CardProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveCardProgress(cardId: string, correct: boolean): CardProgress {
  const progress = getProgress();
  const existing = progress[cardId] || {
    cardId,
    correct: 0,
    incorrect: 0,
    lastSeen: Date.now(),
    nextReview: Date.now(),
    level: 0,
  };

  if (correct) {
    existing.correct++;
    existing.level = Math.min(5, existing.level + 1);
  } else {
    existing.incorrect++;
    existing.level = Math.max(0, existing.level - 1);
  }

  existing.lastSeen = Date.now();
  // Spaced repetition intervals in days (not minutes — critical fix)
  const intervals = [0, 1, 3, 7, 16, 35]; // days for levels 0-5
  existing.nextReview = Date.now() + intervals[existing.level] * 86_400_000;

  progress[cardId] = existing;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return existing;
}

export function getStats() {
  const progress = getProgress();
  const cards = Object.values(progress);
  return {
    totalReviewed: cards.length,
    mastered: cards.filter((c) => c.level >= 4).length,
    learning: cards.filter((c) => c.level > 0 && c.level < 4).length,
    totalCorrect: cards.reduce((sum, c) => sum + c.correct, 0),
    totalIncorrect: cards.reduce((sum, c) => sum + c.incorrect, 0),
  };
}
