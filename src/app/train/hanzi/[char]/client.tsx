'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, PenLine, RotateCcw, CheckCircle } from 'lucide-react';
import { lookupById, search } from '@/lib/dictionary';
import { speakChinese } from '@/lib/audio';

type Mode = 'animate' | 'quiz';

export default function HanziWriterClient({ char }: { char: string }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<unknown>(null);
  const [mode, setMode] = useState<Mode>('animate');
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);
  const [quizMistakes, setQuizMistakes] = useState(0);
  const [loading, setLoading] = useState(true);

  // Look up the entry for this character
  const results = search(char);
  const entry = results.find((e) => e.simplified === char) ?? results[0] ?? null;

  const initWriter = async (currentMode: Mode) => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    setQuizResult(null);
    setQuizMistakes(0);
    setLoading(true);

    try {
      const HanziWriter = (await import('hanzi-writer')).default;
      const writer = HanziWriter.create(containerRef.current, char, {
        width: 240,
        height: 240,
        padding: 10,
        showOutline: true,
        strokeColor: '#dc2626',
        outlineColor: '#e5e5e5',
        drawingColor: '#dc2626',
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 100,
        charDataLoader: (char, onLoad, onError) => {
          fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`)
            .then((r) => r.json())
            .then(onLoad)
            .catch(onError ?? (() => {}));
        },
      });
      writerRef.current = writer;
      setLoading(false);

      if (currentMode === 'animate') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (writer as any).animateCharacter();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (writer as any).quiz({
          onMistake: () => setQuizMistakes((m) => m + 1),
          onCorrectStroke: () => {},
          onComplete: (data: { totalMistakes: number }) => {
            setQuizResult(data.totalMistakes === 0 ? 'correct' : 'incorrect');
          },
        });
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    initWriter(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char, mode]);

  const handleAnimate = () => {
    if (mode === 'animate' && writerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (writerRef.current as any).animateCharacter();
    } else {
      setMode('animate');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold font-chinese">{char}</h1>
          {entry && <p className="text-xs text-muted">{entry.pinyin} · {entry.english}</p>}
        </div>
        <button
          onClick={() => speakChinese(char)}
          className="rounded-full bg-primary/10 p-2 text-primary"
        >
          <Play className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Mode toggle */}
        <div className="flex rounded-xl bg-card p-1">
          <button
            onClick={() => setMode('animate')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === 'animate' ? 'bg-primary text-white' : 'text-muted'
            }`}
          >
            <Play className="h-4 w-4" /> Watch
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === 'quiz' ? 'bg-primary text-white' : 'text-muted'
            }`}
          >
            <PenLine className="h-4 w-4" /> Practice
          </button>
        </div>

        {/* Canvas area */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative rounded-2xl bg-card p-4 shadow-sm">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-card">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
            <div ref={containerRef} style={{ width: 240, height: 240 }} />
          </div>

          {/* Quiz status */}
          {mode === 'quiz' && !loading && (
            <div className="text-center space-y-2">
              {quizResult === 'correct' ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">
                    {quizMistakes === 0 ? 'Perfect!' : `Done — ${quizMistakes} mistake${quizMistakes > 1 ? 's' : ''}`}
                  </span>
                </div>
              ) : quizResult === null ? (
                <p className="text-sm text-muted">
                  Draw the strokes in order — follow the red guide
                </p>
              ) : null}
              {quizMistakes > 0 && <p className="text-xs text-muted">{quizMistakes} correction{quizMistakes > 1 ? 's' : ''} so far</p>}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 w-full max-w-xs">
            {mode === 'animate' && (
              <button
                onClick={handleAnimate}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white"
              >
                <Play className="h-4 w-4" /> Replay
              </button>
            )}
            {mode === 'quiz' && quizResult !== null && (
              <button
                onClick={() => initWriter('quiz')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm font-semibold"
              >
                <RotateCcw className="h-4 w-4" /> Try Again
              </button>
            )}
          </div>
        </div>

        {/* Character info */}
        {entry && (
          <div className="rounded-2xl bg-card p-4 space-y-3">
            <div>
              <p className="font-chinese text-4xl font-bold">{char}</p>
              <p className="text-muted mt-1">{entry.pinyin}</p>
              <p className="font-semibold mt-0.5">{entry.english}</p>
            </div>
            {entry.exampleSentence && (
              <div className="rounded-xl bg-background p-3">
                <p className="font-chinese text-base font-semibold">{entry.exampleSentence}</p>
                <p className="text-xs text-muted mt-0.5">{entry.examplePinyin}</p>
                <p className="text-xs mt-0.5">{entry.exampleEnglish}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
