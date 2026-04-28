'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, Bookmark, BookmarkCheck, Plus } from 'lucide-react';
import { lookupById } from '@/lib/dictionary';
import { db } from '@/lib/db';
import { speakChinese } from '@/lib/audio';
import type { DictEntry } from '@/lib/db';

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
  6: 'bg-purple-100 text-purple-700',
};

const POS_LABELS: Record<string, string> = {
  noun: 'noun', verb: 'verb', adj: 'adj.', adv: 'adv.',
  pron: 'pron.', mw: 'measure word', num: 'number',
  particle: 'particle', conj: 'conj.', prep: 'prep.', phrase: 'phrase',
};

export default function DictDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [entry, setEntry] = useState<DictEntry | null>(null);
  const [saved, setSaved] = useState(false);
  const [addedToDeck, setAddedToDeck] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const e = lookupById(id);
    if (!e) { setNotFound(true); return; }
    setEntry(e);
    db.savedWords.get(id).then((sw) => setSaved(!!sw));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted">Word not found.</p>
        <button onClick={() => router.back()} className="text-primary text-sm">Go back</button>
      </div>
    );
  }

  if (!entry) return null;

  const toggleSave = async () => {
    if (saved) {
      await db.savedWords.delete(entry.id);
      setSaved(false);
    } else {
      await db.savedWords.put({ wordId: entry.id, savedAt: Date.now() });
      setSaved(true);
    }
  };

  const addToDeck = async () => {
    // Add as HSK deck card (or 'saved' deck)
    const deckId = entry.level ? `hsk${entry.level}` : 'saved';
    const cardId = `${deckId}:${entry.id}:zh2en`;
    const existing = await db.srsCards.get(cardId);
    if (!existing) {
      await db.srsCards.put({
        id: cardId,
        deckId,
        wordId: entry.id,
        cardType: 'zh2en',
        due: Date.now(),
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 0,
        queue: 'new',
        learningStep: 0,
      });
    }
    setAddedToDeck(true);
    setTimeout(() => setAddedToDeck(false), 2000);
  };

  const chars = [...entry.simplified];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 bg-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-muted">Dictionary</span>
      </div>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Main entry */}
        <div className="rounded-2xl bg-card p-6 text-center">
          <div className="flex items-start justify-center gap-3">
            <span className="font-chinese text-7xl font-bold leading-none">
              {entry.simplified}
            </span>
            <button
              onClick={() => speakChinese(entry.simplified)}
              className="mt-2 rounded-full bg-primary/10 p-2 text-primary"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-lg text-muted">{entry.pinyin}</p>
          <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
            {entry.level && (
              <span className={`rounded px-2 py-0.5 text-sm font-semibold ${LEVEL_COLORS[entry.level]}`}>
                HSK {entry.level}
              </span>
            )}
            {entry.partOfSpeech && (
              <span className="rounded bg-secondary/20 px-2 py-0.5 text-sm text-secondary font-medium">
                {POS_LABELS[entry.partOfSpeech] ?? entry.partOfSpeech}
              </span>
            )}
            {entry.source === 'business' && (
              <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-sm font-medium">
                Business
              </span>
            )}
          </div>
          <p className="mt-4 text-xl font-semibold">{entry.english}</p>
          {entry.allDefinitions.length > 1 && (
            <ul className="mt-2 space-y-1">
              {entry.allDefinitions.map((d, i) => (
                <li key={i} className="text-sm text-muted">{i + 1}. {d}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Character breakdown */}
        {chars.length > 1 && (
          <div className="rounded-2xl bg-card p-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Characters
            </h3>
            <div className="flex gap-3">
              {chars.map((ch, i) => (
                <a
                  key={i}
                  href={`/dictionary/${encodeURIComponent(`vocab-${ch}`)}`}
                  className="flex flex-col items-center gap-1 rounded-xl bg-background px-4 py-3 flex-1"
                >
                  <span className="font-chinese text-3xl font-bold">{ch}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Example sentence */}
        {entry.exampleSentence && (
          <div className="rounded-2xl bg-card p-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Example
            </h3>
            <div className="flex items-start justify-between gap-2">
              <p className="font-chinese text-xl font-semibold">{entry.exampleSentence}</p>
              <button
                onClick={() => entry.exampleSentence && speakChinese(entry.exampleSentence)}
                className="shrink-0 rounded-full p-1.5 text-muted hover:text-primary"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            {entry.examplePinyin && (
              <p className="mt-1 text-sm text-muted">{entry.examplePinyin}</p>
            )}
            {entry.exampleEnglish && (
              <p className="mt-1 text-sm">{entry.exampleEnglish}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={toggleSave}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
              saved
                ? 'bg-secondary/20 text-secondary'
                : 'bg-card text-foreground'
            }`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={addToDeck}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
              addedToDeck
                ? 'bg-success/20 text-success'
                : 'bg-primary text-white'
            }`}
          >
            <Plus className="h-4 w-4" />
            {addedToDeck ? 'Added!' : 'Add to Deck'}
          </button>
        </div>
      </div>
    </div>
  );
}
