'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Volume2, RotateCcw, Check, X, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/header';
import { speakChinese } from '@/lib/audio';
import {
  getImageableWords,
  THEME_LABEL,
  type Theme,
} from '@/lib/vocab-images';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function PlayInner() {
  const params = useSearchParams();
  const themeParam = params.get('theme') as Theme | null;
  const levelParam = params.get('level');
  const level = levelParam && levelParam !== 'all' ? (parseInt(levelParam, 10) as 1 | 2 | 3) : null;

  const deck = useMemo(() => {
    let words = getImageableWords();
    if (level) words = words.filter((w) => w.hskLevel === level);
    if (themeParam) words = words.filter((w) => w.theme === themeParam);
    return shuffle(words);
  }, [themeParam, level]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [unknownIds, setUnknownIds] = useState<Set<string>>(new Set());
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const playedRef = useRef<string | null>(null);

  const card = deck[index];
  const total = deck.length;
  const imageLoaded = card != null && loadedId === card.id;

  useEffect(() => {
    if (!card) return;
    if (!imageLoaded) return;
    if (playedRef.current === card.id) return;
    playedRef.current = card.id;
    // Wait until the image has actually painted, then play slowed audio
    // so the user sees and hears the card simultaneously.
    const t = setTimeout(() => speakChinese(card.simplified, 0.4), 120);
    return () => clearTimeout(t);
  }, [card, imageLoaded]);

  if (total === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Picture Cards" />
        <div className="mx-auto max-w-lg px-4 py-10 text-center">
          <p className="text-muted">No cards in this set yet.</p>
          <Link href="/picture-cards" className="mt-4 inline-block text-primary text-sm font-medium">
            Back to picture decks
          </Link>
        </div>
      </div>
    );
  }

  if (index >= total) {
    return (
      <div className="min-h-screen">
        <Header title="Session Complete" />
        <div className="mx-auto max-w-lg px-4 py-8 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-6 text-white text-center">
            <p className="text-3xl font-bold">{knownIds.size}/{total}</p>
            <p className="text-sm opacity-90 mt-1">cards you knew</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setIndex(0); setRevealed(false); setKnownIds(new Set()); setUnknownIds(new Set()); playedRef.current = null; }}
              className="rounded-xl bg-card py-3 text-sm font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Restart
            </button>
            <Link href="/picture-cards">
              <button className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white">
                Pick another deck
              </button>
            </Link>
          </div>
          {unknownIds.size > 0 && (
            <div className="rounded-xl bg-card p-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                Words to review
              </p>
              <div className="space-y-2">
                {deck.filter((w) => unknownIds.has(w.id)).map((w) => (
                  <div key={w.id} className="flex items-center gap-3 text-sm">
                    <span className="font-chinese text-base">{w.simplified}</span>
                    <span className="text-muted text-xs">{w.pinyin}</span>
                    <span className="text-xs flex-1 truncate">{w.english}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const next = (known: boolean) => {
    if (known) setKnownIds((s) => new Set(s).add(card.id));
    else setUnknownIds((s) => new Set(s).add(card.id));
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  const titleLabel = themeParam
    ? THEME_LABEL[themeParam]
    : level ? `HSK ${level}` : 'All HSK 1-3';

  return (
    <div className="min-h-screen">
      <Header title={titleLabel} />
      <div className="mx-auto max-w-lg px-4 py-4 space-y-4">

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(index / total) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted shrink-0">{index + 1}/{total}</span>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="block w-full aspect-square relative active:scale-[0.99] transition-transform"
            aria-label={revealed ? 'Hide answer' : 'Reveal answer'}
          >
            <Image
              src={card.imagePath}
              alt={card.english}
              fill
              priority
              sizes="(max-width: 512px) 100vw, 512px"
              className={`object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLoadedId(card.id)}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = '0';
                setLoadedId(card.id);
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-background animate-pulse" />
            )}
            {!revealed && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-white">
                Tap image to reveal
              </div>
            )}
          </button>

          <div className="p-5 space-y-3">
            {revealed ? (
              <>
                <div className="text-center">
                  <p className="font-chinese text-5xl font-bold">{card.simplified}</p>
                  <p className="text-lg text-muted mt-2">{card.pinyin}</p>
                  <p className="text-base mt-1">{card.english}</p>
                </div>
                <button
                  onClick={() => speakChinese(card.simplified, 0.4)}
                  className="w-full rounded-xl bg-background py-2.5 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Volume2 className="h-4 w-4" /> Play audio (slow)
                </button>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => next(false)}
                    className="rounded-xl bg-rose-500/10 text-rose-500 py-3 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" /> Didn&apos;t know
                  </button>
                  <button
                    onClick={() => next(true)}
                    className="rounded-xl bg-emerald-500 text-white py-3 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Got it
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => speakChinese(card.simplified, 0.4)}
                  className="w-full rounded-xl bg-background py-3 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Volume2 className="h-4 w-4" /> Replay audio
                </button>
                <button
                  onClick={() => setRevealed(true)}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white flex items-center justify-center gap-2"
                >
                  Reveal answer <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-muted text-center">
          Audio plays automatically. Listen, guess, then tap the image to reveal.
        </p>
      </div>
    </div>
  );
}

export default function PicturePlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PlayInner />
    </Suspense>
  );
}
