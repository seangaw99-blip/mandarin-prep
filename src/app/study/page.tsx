'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Volume2 } from 'lucide-react';
import Header from '@/components/layout/header';
import { db } from '@/lib/db';
import { reviewCard, type Rating } from '@/lib/srs';
import { lookupById } from '@/lib/dictionary';
import { speakChinese } from '@/lib/audio';
import { recordStudySession } from '@/lib/streak';
import { hsk1Words } from '@/data/hsk/hsk1';
import { hsk2Words } from '@/data/hsk/hsk2';
import { hsk3Words } from '@/data/hsk/hsk3';
import type { SrsCard, DictEntry } from '@/lib/db';

// Seed HSK cards into Dexie on first visit
async function seedDeck(deckId: string, wordIds: string[]) {
  const existing = await db.srsCards.where('deckId').equals(deckId).count();
  if (existing > 0) return;
  const cards = wordIds.map((wordId) => ({
    id: `${deckId}:${wordId}:zh2en`,
    deckId,
    wordId,
    cardType: 'zh2en' as const,
    due: Date.now(),
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lapses: 0,
    queue: 'new' as const,
    learningStep: 0,
  }));
  await db.srsCards.bulkPut(cards);
}

interface SessionCard {
  srs: SrsCard;
  entry: DictEntry;
}

export default function StudyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<SessionCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, again: 0 });
  const [done, setDone] = useState(false);
  const [deckStats, setDeckStats] = useState({ hsk1Due: 0, hsk2Due: 0, totalNew: 0 });

  const loadSession = useCallback(async () => {
    setLoading(true);
    // Seed on first load
    await seedDeck('hsk1', hsk1Words.map((w) => w.id));
    await seedDeck('hsk2', hsk2Words.map((w) => w.id));
    await seedDeck('hsk3', hsk3Words.map((w) => w.id));

    const now = Date.now();
    const due = await db.srsCards
      .where('due').belowOrEqual(now)
      .limit(30)
      .toArray();

    // Also grab some new cards if due count is low
    if (due.length < 10) {
      const newCards = await db.srsCards
        .filter((c) => c.queue === 'new' && c.repetitions === 0 && c.due > now)
        .limit(10 - due.length)
        .toArray();
      due.push(...newCards);
    }

    const cards: SessionCard[] = [];
    for (const srs of due) {
      const entry = lookupById(srs.wordId);
      if (entry) cards.push({ srs, entry });
    }

    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // Stats for overview
    const hsk1Due = await db.srsCards.where('deckId').equals('hsk1').and((c) => c.due <= now).count();
    const hsk2Due = await db.srsCards.where('deckId').equals('hsk2').and((c) => c.due <= now).count();
    const totalNew = await db.srsCards.filter((c) => c.queue === 'new' && c.repetitions === 0).count();

    setDeckStats({ hsk1Due, hsk2Due, totalNew });
    setQueue(cards);
    setCurrentIdx(0);
    setRevealed(false);
    setDone(cards.length === 0);
    setLoading(false);
  }, []);

  useEffect(() => { loadSession(); }, [loadSession]);

  const current = queue[currentIdx];

  const handleRate = async (rating: Rating) => {
    if (!current) return;
    await reviewCard(current.srs, rating);
    if (rating >= 3) {
      setSessionStats((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setSessionStats((s) => ({ ...s, again: s.again + 1 }));
    }
    const next = currentIdx + 1;
    if (next >= queue.length) {
      recordStudySession(
        sessionStats.correct + sessionStats.again + 1,
        rating >= 3 ? sessionStats.correct + 1 : sessionStats.correct
      );
      setDone(true);
    } else {
      setCurrentIdx(next);
      setRevealed(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Study" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (done) {
    const total = sessionStats.correct + sessionStats.again;
    return (
      <div className="min-h-screen">
        <Header title="Study" />
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold">Session Complete!</h2>
          {total > 0 ? (
            <p className="mt-2 text-muted">
              {sessionStats.correct} / {total} correct ({Math.round((sessionStats.correct / total) * 100)}%)
            </p>
          ) : (
            <p className="mt-2 text-muted">Nothing due right now — check back later!</p>
          )}

          {/* Deck overview */}
          <div className="mt-6 w-full rounded-2xl bg-card p-4 text-left">
            <h3 className="text-sm font-semibold text-muted mb-3">Your Decks</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">HSK 1</span>
                <span className="text-xs text-muted">{deckStats.hsk1Due} due</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">HSK 2</span>
                <span className="text-xs text-muted">{deckStats.hsk2Due} due</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New cards available</span>
                <span className="text-xs text-primary font-medium">{deckStats.totalNew}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={loadSession}
              className="flex items-center gap-2 rounded-xl bg-card px-5 py-3 text-sm font-semibold"
            >
              <RotateCcw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Home <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Study" />

      {/* Progress bar */}
      <div className="h-1 bg-card">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(currentIdx / queue.length) * 100}%` }}
        />
      </div>

      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="text-center text-xs text-muted mb-6">
          {currentIdx + 1} / {queue.length}
        </p>

        {current && (
          <>
            {/* Card */}
            <div
              onClick={() => { if (!revealed) { setRevealed(true); speakChinese(current.entry.simplified); } }}
              className="rounded-2xl bg-card p-8 text-center min-h-48 flex flex-col items-center justify-center cursor-pointer active:scale-[0.98] transition-transform"
            >
              <span className="font-chinese text-6xl font-bold">{current.entry.simplified}</span>
              {current.entry.level && (
                <span className="mt-3 rounded px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                  HSK {current.entry.level}
                </span>
              )}
              {!revealed && (
                <p className="mt-6 text-sm text-muted">Tap to reveal</p>
              )}
              {revealed && (
                <div className="mt-4 animate-fadeIn space-y-1">
                  <p className="text-muted">{current.entry.pinyin}</p>
                  <p className="text-xl font-semibold">{current.entry.english}</p>
                  {current.entry.partOfSpeech && (
                    <p className="text-xs text-muted">{current.entry.partOfSpeech}</p>
                  )}
                </div>
              )}
            </div>

            {/* Audio button when revealed */}
            {revealed && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => speakChinese(current.entry.simplified)}
                  className="flex items-center gap-1.5 text-sm text-muted"
                >
                  <Volume2 className="h-4 w-4" /> Listen
                </button>
              </div>
            )}

            {/* Rating buttons */}
            {revealed ? (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleRate(1)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-4 text-sm font-semibold text-red-500"
                >
                  <XCircle className="h-5 w-5" /> Again
                </button>
                <button
                  onClick={() => handleRate(3)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-success/10 py-4 text-sm font-semibold text-success"
                >
                  <CheckCircle className="h-5 w-5" /> Got it
                </button>
                <button
                  onClick={() => handleRate(2)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm text-muted"
                >
                  Hard
                </button>
                <button
                  onClick={() => handleRate(4)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm text-muted"
                >
                  Easy
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setRevealed(true); speakChinese(current.entry.simplified); }}
                className="mt-6 w-full rounded-xl bg-primary py-4 text-sm font-semibold text-white"
              >
                Show Answer
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
