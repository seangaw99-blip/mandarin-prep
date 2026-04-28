'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Volume2, ChevronRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DRILL_SENTENCES, type DrillSentence } from '@/data/listening-drills';
import { speakChinese } from '@/lib/audio';

type Level = 'beginner' | 'hsk1' | 'hsk2';
type Phase = 'setup' | 'drill' | 'result';

const LEVEL_META: Record<Level, { label: string; color: string; desc: string }> = {
  beginner: { label: 'Beginner', color: 'bg-green-500', desc: 'Basic greetings & short phrases' },
  hsk1: { label: 'HSK 1', color: 'bg-blue-500', desc: 'Simple sentences, common vocabulary' },
  hsk2: { label: 'HSK 2', color: 'bg-purple-500', desc: 'Grammar patterns, longer sentences' },
};

const DRILL_LENGTH = 10;

function normChinese(s: string): string {
  return s.replace(/[，。？！、：；""''「」【】\s]/g, '').toLowerCase();
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface DrillResult {
  sentence: DrillSentence;
  userAnswer: string;
  correct: boolean;
}

function SetupScreen({ onStart }: { onStart: (level: Level) => void }) {
  const [selected, setSelected] = useState<Level>('beginner');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
          <Volume2 className="h-8 w-8 text-teal-500" />
        </div>
        <h2 className="text-xl font-bold">Listening Drills</h2>
        <p className="text-sm text-muted mt-1">Hear a sentence — type it in Chinese</p>
      </div>

      <div className="space-y-2">
        {(Object.entries(LEVEL_META) as [Level, typeof LEVEL_META[Level]][]).map(([val, meta]) => (
          <button
            key={val}
            onClick={() => setSelected(val)}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
              selected === val ? 'bg-primary text-white' : 'bg-card text-foreground'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${meta.color} shrink-0`} />
            <div>
              <p className="font-semibold text-sm">{meta.label}</p>
              <p className={`text-xs ${selected === val ? 'text-white/70' : 'text-muted'}`}>{meta.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-card p-4 text-xs text-muted space-y-1">
        <p className="font-semibold text-foreground">How it works</p>
        <p>1. Tap the speaker to hear the sentence</p>
        <p>2. Type the Chinese characters you heard</p>
        <p>3. Tap Check — or replay as many times as you need</p>
      </div>

      <button
        onClick={() => onStart(selected)}
        className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white flex items-center justify-center gap-2"
      >
        Start {DRILL_LENGTH} Questions
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function DrillScreen({
  question,
  total,
  sentence,
  onSubmit,
  onNext,
}: {
  question: number;
  total: number;
  sentence: DrillSentence;
  onSubmit: (answer: string) => boolean;
  onNext: () => void;
}) {
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [played, setPlayed] = useState(false);

  const play = useCallback(() => {
    speakChinese(sentence.chinese);
    setPlayed(true);
  }, [sentence.chinese]);

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(play, 400);
    return () => clearTimeout(timer);
  }, [play]);

  const handleCheck = () => {
    if (!input.trim()) return;
    const correct = onSubmit(input.trim());
    setIsCorrect(correct);
    setChecked(true);
  };

  const handleNext = () => {
    setInput('');
    setChecked(false);
    setIsCorrect(false);
    setPlayed(false);
    onNext();
  };

  const progress = question / total;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>Question {question} of {total}</span>
          <span className="capitalize">{LEVEL_META[sentence.level as Level]?.label}</span>
        </div>
        <div className="h-1.5 bg-card rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Play button */}
      <div className="flex flex-col items-center gap-4 py-4">
        <button
          onClick={play}
          className="w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Volume2 className="h-10 w-10 text-teal-500" />
        </button>
        {!played && (
          <p className="text-xs text-muted animate-pulse">Tap to play the sentence</p>
        )}
        {played && !checked && (
          <p className="text-xs text-muted">Tap again to replay</p>
        )}
      </div>

      {/* Input */}
      {!checked ? (
        <div className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="Type what you heard in Chinese..."
            className="font-chinese w-full rounded-xl bg-card px-4 py-4 text-lg text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
            autoComplete="off"
          />
          <button
            onClick={handleCheck}
            disabled={!input.trim()}
            className="w-full rounded-xl bg-teal-500 py-3.5 font-semibold text-white disabled:opacity-40"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Result card */}
          <div className={`rounded-xl p-4 ${isCorrect ? 'bg-success/10' : 'bg-red-500/10'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect
                ? <CheckCircle2 className="h-5 w-5 text-success" />
                : <XCircle className="h-5 w-5 text-red-400" />
              }
              <span className={`font-semibold text-sm ${isCorrect ? 'text-success' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Not quite'}
              </span>
            </div>
            {!isCorrect && (
              <div className="mb-2">
                <p className="text-xs text-muted mb-0.5">You wrote:</p>
                <p className="font-chinese text-base line-through opacity-60">{input}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted mb-0.5">Correct answer:</p>
              <p className="font-chinese text-xl font-bold">{sentence.chinese}</p>
              <p className="text-sm text-muted mt-0.5">{sentence.pinyin}</p>
              <p className="text-sm mt-0.5">{sentence.english}</p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white flex items-center justify-center gap-2"
          >
            {question < total ? 'Next Question' : 'See Results'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function ResultScreen({
  results,
  level,
  onRestart,
  onChangeLevel,
}: {
  results: DrillResult[];
  level: Level;
  onRestart: () => void;
  onChangeLevel: () => void;
}) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);

  const grade =
    pct === 100 ? { label: 'Perfect!', color: 'text-success', emoji: '🏆' }
    : pct >= 80  ? { label: 'Excellent', color: 'text-blue-500', emoji: '🌟' }
    : pct >= 60  ? { label: 'Good job', color: 'text-primary', emoji: '👍' }
    : pct >= 40  ? { label: 'Keep going', color: 'text-amber-500', emoji: '💪' }
    :              { label: 'Practice more', color: 'text-muted', emoji: '📖' };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center py-4">
        <span className="text-5xl">{grade.emoji}</span>
        <p className={`text-2xl font-bold mt-3 ${grade.color}`}>{grade.label}</p>
        <p className="text-4xl font-bold mt-1">{correct} / {total}</p>
        <p className="text-muted text-sm mt-1">{pct}% correct · {LEVEL_META[level].label}</p>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-2">
        {results.map((r, i) => (
          <div
            key={r.sentence.id}
            className={`flex items-start gap-3 rounded-xl p-3 ${r.correct ? 'bg-success/10' : 'bg-card'}`}
          >
            <span className={`text-lg ${r.correct ? 'text-success' : 'text-red-400'}`}>
              {r.correct ? '✓' : '✗'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-chinese text-sm font-semibold">{r.sentence.chinese}</p>
              <p className="text-xs text-muted">{r.sentence.pinyin}</p>
              {!r.correct && r.userAnswer && (
                <p className="text-xs text-red-400 mt-0.5">You wrote: {r.userAnswer}</p>
              )}
            </div>
            <span className="text-xs text-muted shrink-0">#{i + 1}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onChangeLevel}
          className="flex-1 rounded-xl bg-card py-3 text-sm font-semibold flex items-center justify-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Change Level
        </button>
        <button
          onClick={onRestart}
          className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white"
        >
          Drill Again
        </button>
      </div>
    </div>
  );
}

export default function ListeningPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('setup');
  const [level, setLevel] = useState<Level>('beginner');
  const [queue, setQueue] = useState<DrillSentence[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [results, setResults] = useState<DrillResult[]>([]);

  const startDrill = (selectedLevel: Level) => {
    const pool = DRILL_SENTENCES.filter((s) => s.level === selectedLevel);
    const q = shuffle(pool).slice(0, DRILL_LENGTH);
    setLevel(selectedLevel);
    setQueue(q);
    setQIndex(0);
    setResults([]);
    setPhase('drill');
  };

  const handleSubmit = (answer: string): boolean => {
    const sentence = queue[qIndex];
    const correct = normChinese(answer) === normChinese(sentence.chinese);
    setResults((prev) => [...prev, { sentence, userAnswer: answer, correct }]);
    return correct;
  };

  const handleNext = () => {
    if (qIndex + 1 >= queue.length) {
      setPhase('result');
    } else {
      setQIndex(qIndex + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Listening Drills</h1>
          <p className="text-xs text-muted">Hear it, type it</p>
        </div>
      </div>

      <div className="mx-auto max-w-sm px-4 py-6">
        {phase === 'setup' && (
          <SetupScreen onStart={startDrill} />
        )}

        {phase === 'drill' && queue[qIndex] && (
          <DrillScreen
            key={`${level}-${qIndex}`}
            question={qIndex + 1}
            total={queue.length}
            sentence={queue[qIndex]}
            onSubmit={handleSubmit}
            onNext={handleNext}
          />
        )}

        {phase === 'result' && (
          <ResultScreen
            results={results}
            level={level}
            onRestart={() => startDrill(level)}
            onChangeLevel={() => setPhase('setup')}
          />
        )}
      </div>
    </div>
  );
}
