import { db, type SrsCard } from './db';

// Learning steps in minutes before a card graduates to review queue
const LEARNING_STEPS_MINS = [1, 10, 1440]; // 1min, 10min, 1day
const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;
const GRADUATING_INTERVAL = 1; // days after completing all learning steps

export type Rating = 1 | 2 | 3 | 4; // Again | Hard | Good | Easy

export function makeCardId(deckId: string, wordId: string, cardType: SrsCard['cardType']) {
  return `${deckId}:${wordId}:${cardType}`;
}

export async function getOrCreateCard(
  deckId: string,
  wordId: string,
  cardType: SrsCard['cardType']
): Promise<SrsCard> {
  const id = makeCardId(deckId, wordId, cardType);
  const existing = await db.srsCards.get(id);
  if (existing) return existing;

  const card: SrsCard = {
    id,
    deckId,
    wordId,
    cardType,
    due: Date.now(),
    interval: 0,
    easeFactor: DEFAULT_EASE,
    repetitions: 0,
    lapses: 0,
    queue: 'new',
    learningStep: 0,
  };
  await db.srsCards.put(card);
  return card;
}

export async function reviewCard(card: SrsCard, rating: Rating): Promise<SrsCard> {
  const now = Date.now();
  const updated = { ...card };

  if (rating === 1) {
    // Again — reset to first learning step
    updated.queue = 'learning';
    updated.learningStep = 0;
    updated.due = now + LEARNING_STEPS_MINS[0] * 60_000;
    if (card.queue === 'review') {
      updated.lapses++;
      updated.easeFactor = Math.max(MIN_EASE, card.easeFactor - 0.2);
      updated.interval = Math.max(1, Math.ceil(card.interval * 0.5));
    }
  } else if (card.queue === 'new' || card.queue === 'learning') {
    const nextStep = card.learningStep + 1;
    if (nextStep >= LEARNING_STEPS_MINS.length) {
      // Graduate to review
      updated.queue = 'review';
      updated.learningStep = 0;
      updated.interval = GRADUATING_INTERVAL;
      updated.due = now + GRADUATING_INTERVAL * 86_400_000;
    } else {
      updated.queue = 'learning';
      updated.learningStep = nextStep;
      updated.due = now + LEARNING_STEPS_MINS[nextStep] * 60_000;
    }
  } else {
    // Review queue — SM-2
    updated.repetitions++;
    let newInterval: number;

    if (rating === 2) {
      // Hard
      newInterval = Math.max(1, Math.round(card.interval * 1.2));
      updated.easeFactor = Math.max(MIN_EASE, card.easeFactor - 0.15);
    } else if (rating === 3) {
      // Good
      newInterval = Math.max(1, Math.round(card.interval * card.easeFactor));
    } else {
      // Easy
      newInterval = Math.max(1, Math.round(card.interval * card.easeFactor * 1.3));
      updated.easeFactor = Math.min(3.0, card.easeFactor + 0.15);
    }

    updated.interval = newInterval;
    updated.due = now + newInterval * 86_400_000;
  }

  await db.srsCards.put(updated);
  return updated;
}

export async function getDueCards(deckId: string, limit = 20): Promise<SrsCard[]> {
  const now = Date.now();
  return db.srsCards
    .where('deckId').equals(deckId)
    .and((c) => c.due <= now)
    .limit(limit)
    .toArray();
}

export async function getNewCards(deckId: string, limit = 10): Promise<SrsCard[]> {
  return db.srsCards
    .where('deckId').equals(deckId)
    .and((c) => c.queue === 'new' && c.repetitions === 0)
    .limit(limit)
    .toArray();
}

export async function getDeckStats(deckId: string) {
  const all = await db.srsCards.where('deckId').equals(deckId).toArray();
  const now = Date.now();
  return {
    total: all.length,
    due: all.filter((c) => c.due <= now).length,
    new: all.filter((c) => c.queue === 'new' && c.repetitions === 0).length,
    learning: all.filter((c) => c.queue === 'learning').length,
    review: all.filter((c) => c.queue === 'review').length,
    mature: all.filter((c) => c.queue === 'review' && c.interval >= 21).length,
  };
}
