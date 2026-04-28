'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, RotateCcw, CheckCircle, XCircle, Info } from 'lucide-react';
import { speakChinese } from '@/lib/audio';
import {
  drillWords, TONE_NAMES, TONE_COLORS, TONE_BORDER_COLORS,
  TONE_CONTOURS, TONE_DESCRIPTIONS, type ToneDrillWord,
} from '@/data/tones';

type DrillMode = 'menu' | 'identify' | 'reference';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Tone contour SVG ──────────────────────────────────────────────────────────
function ToneContour({ tone, size = 'sm' }: { tone: number; size?: 'sm' | 'lg' }) {
  const w = size === 'lg' ? 120 : 80;
  const h = size === 'lg' ? 60 : 40;
  const path = TONE_CONTOURS[tone as keyof typeof TONE_CONTOURS];
  const scaledPath = path
    .replace(/(\d+),(\d+)/g, (_, x, y) =>
      `${Math.round((parseInt(x) / 100) * w)},${Math.round((parseInt(y) / 55) * h)}`
    );
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path
        d={scaledPath}
        fill="none"
        stroke="currentColor"
        strokeWidth={size === 'lg' ? 3 : 2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Reference chart ───────────────────────────────────────────────────────────
function ReferenceTab({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((tone) => (
        <div key={tone} className={`rounded-2xl p-4 ${TONE_COLORS[tone].split(' ')[1]}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className={`font-bold text-sm ${TONE_COLORS[tone].split(' ')[0]}`}>
                Tone {tone} — {TONE_NAMES[tone].split(' — ')[1]}
              </p>
              <p className="text-sm text-foreground mt-1">{TONE_DESCRIPTIONS[tone]}</p>
              <div className="mt-3 flex gap-3 flex-wrap">
                {drillWords.filter((w) => w.tone === tone).slice(0, 4).map((w) => (
                  <button
                    key={w.character}
                    onClick={() => speakChinese(w.character)}
                    className="flex items-center gap-1.5 rounded-lg bg-background/60 px-2 py-1"
                  >
                    <span className="font-chinese text-lg font-bold">{w.character}</span>
                    <span className="text-xs text-muted">{w.pinyin}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={TONE_COLORS[tone].split(' ')[0]}>
              <ToneContour tone={tone} size="lg" />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={onStart}
        className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-white"
      >
        Start Drill →
      </button>
    </div>
  );
}

// ── Identify drill ────────────────────────────────────────────────────────────
interface DrillQuestion {
  word: ToneDrillWord;
  choices: number[];  // tone numbers [1,2,3,4] shuffled
}

function buildQueue(count = 20): DrillQuestion[] {
  const pool = shuffle(drillWords.filter((w) => w.tone !== 5));
  const questions = pool.slice(0, count);
  return questions.map((word) => {
    const otherTones = [1, 2, 3, 4].filter((t) => t !== word.tone);
    const wrong = shuffle(otherTones).slice(0, 3);
    return {
      word,
      choices: shuffle([word.tone, ...wrong]) as number[],
    };
  });
}

function IdentifyDrill({ onDone }: { onDone: (correct: number, total: number) => void }) {
  const [queue] = useState(buildQueue);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const q = queue[idx];

  useEffect(() => {
    if (q) {
      // Auto-play the word when card appears
      const t = setTimeout(() => speakChinese(q.word.character), 400);
      return () => clearTimeout(t);
    }
  }, [idx, q]);

  const handleChoice = useCallback((tone: number) => {
    if (selected !== null) return;
    setSelected(tone);
    const isCorrect = tone === q.word.tone;
    if (isCorrect) setCorrect((c) => c + 1);

    setTimeout(() => {
      const next = idx + 1;
      if (next >= queue.length) {
        onDone(isCorrect ? correct + 1 : correct, queue.length);
      } else {
        setIdx(next);
        setSelected(null);
      }
    }, 900);
  }, [selected, q, idx, queue, correct, onDone]);

  return (
    <div>
      {/* Progress */}
      <div className="h-1 bg-card rounded-full mb-6">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(idx / queue.length) * 100}%` }}
        />
      </div>
      <p className="text-center text-xs text-muted mb-6">{idx + 1} / {queue.length}</p>

      {/* Word card */}
      <div className="rounded-2xl bg-card p-8 text-center mb-4">
        <button
          onClick={() => speakChinese(q.word.character)}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mx-auto mb-4"
        >
          <Volume2 className="h-7 w-7 text-primary" />
        </button>
        <p className="font-chinese text-5xl font-bold">{q.word.character}</p>
        <p className="text-muted text-sm mt-2">{q.word.english}</p>
        {selected !== null && (
          <p className="mt-2 text-base font-medium animate-fadeIn">
            {q.word.pinyin}
          </p>
        )}
      </div>

      {/* Tone choices */}
      <div className="grid grid-cols-2 gap-3">
        {q.choices.map((tone) => {
          const isAnswer = tone === q.word.tone;
          const isSelected = selected === tone;
          let borderClass = 'border-2 border-transparent';
          if (isSelected && isAnswer) borderClass = `border-2 ${TONE_BORDER_COLORS[tone]} bg-success/10`;
          else if (isSelected && !isAnswer) borderClass = 'border-2 border-red-500 bg-red-500/10';
          else if (selected !== null && isAnswer) borderClass = `border-2 ${TONE_BORDER_COLORS[tone]}`;

          return (
            <button
              key={tone}
              onClick={() => handleChoice(tone)}
              disabled={selected !== null}
              className={`rounded-xl bg-card px-3 py-3 text-center transition-all ${borderClass} active:scale-95`}
            >
              <div className={`mx-auto mb-1 w-fit ${TONE_COLORS[tone].split(' ')[0]}`}>
                <ToneContour tone={tone} />
              </div>
              <p className="text-sm font-semibold">Tone {tone}</p>
              <p className="text-xs text-muted">{TONE_NAMES[tone].split(' — ')[1]}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Result screen ──────────────────────────────────────────────────────────────
function ResultScreen({ correct, total, onRetry }: { correct: number; total: number; onRetry: () => void }) {
  const pct = Math.round((correct / total) * 100);
  const msg = pct >= 90 ? '🏆 Excellent!' : pct >= 70 ? '👍 Good work!' : '💪 Keep practicing!';
  return (
    <div className="flex flex-col items-center text-center py-8 gap-4">
      <div className="text-5xl">{msg.split(' ')[0]}</div>
      <h2 className="text-2xl font-bold">{msg.slice(2)}</h2>
      <p className="text-muted">{correct} / {total} correct ({pct}%)</p>
      <div className="w-full max-w-xs bg-card rounded-full h-3 mt-2">
        <div
          className={`h-full rounded-full transition-all ${pct >= 70 ? 'bg-success' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-muted mt-2">
        {pct < 70
          ? 'Review the tone reference chart and try again.'
          : 'Tones take time. A little practice every day compounds fast.'}
      </p>
      <button onClick={onRetry} className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white mt-2">
        Try Again
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ToneTrainerPage() {
  const router = useRouter();
  const [mode, setMode] = useState<DrillMode>('menu');
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'reference' | 'drill'>('reference');
  const [drillKey, setDrillKey] = useState(0);

  const handleDone = (correct: number, total: number) => {
    setResult({ correct, total });
    setMode('menu');
  };

  const handleRetry = () => {
    setDrillKey((k) => k + 1);
    setResult(null);
    setMode('identify');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Tone Trainer</h1>
          <p className="text-xs text-muted">Master all 4 Mandarin tones</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-6">
        {result ? (
          <ResultScreen correct={result.correct} total={result.total} onRetry={handleRetry} />
        ) : mode === 'identify' ? (
          <IdentifyDrill key={drillKey} onDone={handleDone} />
        ) : (
          <>
            {/* Tab bar */}
            <div className="flex rounded-xl bg-card p-1 mb-6">
              {(['reference', 'drill'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-primary text-white' : 'text-muted'
                  }`}
                >
                  {tab === 'reference' ? '📖 Reference' : '🎯 Drill'}
                </button>
              ))}
            </div>

            {activeTab === 'reference' ? (
              <ReferenceTab onStart={() => { setActiveTab('drill'); }} />
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">
                      You&apos;ll hear a word and see its character. Select the correct tone.
                      Audio plays automatically — tap the speaker icon to replay.
                    </p>
                  </div>
                </div>

                {/* Tone preview chips */}
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((tone) => (
                    <div key={tone} className={`rounded-xl p-3 ${TONE_COLORS[tone].split(' ')[1]}`}>
                      <div className={`${TONE_COLORS[tone].split(' ')[0]} mb-1`}>
                        <ToneContour tone={tone} />
                      </div>
                      <p className="text-xs font-semibold">Tone {tone}</p>
                      <p className="text-xs text-muted">{TONE_NAMES[tone].split(' — ')[1]}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setMode('identify')}
                  className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-white"
                >
                  Start 20-Question Drill
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
