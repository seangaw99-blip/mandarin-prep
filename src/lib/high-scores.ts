const STORAGE_KEY = 'mandarin-prep-high-scores';

export interface HighScoreEntry {
  dialogueId: string;
  score: number;
  date: string;
}

export function getHighScores(): Record<string, HighScoreEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getHighScore(dialogueId: string): number {
  const scores = getHighScores();
  return scores[dialogueId]?.score || 0;
}

export function saveHighScore(dialogueId: string, score: number): boolean {
  const scores = getHighScores();
  const existing = scores[dialogueId]?.score || 0;
  const isNewHigh = score > existing;

  if (isNewHigh) {
    scores[dialogueId] = {
      dialogueId,
      score,
      date: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }

  return isNewHigh;
}
