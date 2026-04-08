'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Mic } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import DialogueBubble from '@/components/practice/dialogue-bubble';
import ScorePopup from '@/components/practice/score-popup';
import { dialogues } from '@/data/dialogues';
import { speakChinese } from '@/lib/audio';
import {
  listenForChinese,
  scorePronunciation,
} from '@/lib/speech-recognition';

interface ScoreState {
  score: number;
  grade: 'perfect' | 'great' | 'good' | 'fair' | 'try-again';
  feedback: string;
  spoken: string;
  expected: string;
}

export default function PracticeClient({ scenarioId }: { scenarioId: string }) {
  const dialogue = dialogues.find((d) => d.id === scenarioId);
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const [practiceRole, setPracticeRole] = useState<'A' | 'B'>('A');
  const [listeningLine, setListeningLine] = useState<number | null>(null);
  const [scoreState, setScoreState] = useState<ScoreState | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!dialogue) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Dialogue not found</p>
      </div>
    );
  }

  const toggleReveal = (index: number) => {
    setRevealedLines((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        speakChinese(dialogue.lines[index].chinese);
      }
      return next;
    });
  };

  const resetAll = () => {
    setRevealedLines(new Set());
    setScoreState(null);
    setError(null);
  };

  const revealAll = () =>
    setRevealedLines(new Set(dialogue.lines.map((_, i) => i)));

  const handleSpeak = async (lineIndex: number) => {
    const line = dialogue.lines[lineIndex];
    setListeningLine(lineIndex);
    setError(null);

    try {
      const result = await listenForChinese();
      const score = scorePronunciation(
        result.transcript,
        line.chinese,
        result.confidence
      );
      setScoreState({
        ...score,
        spoken: result.transcript,
        expected: line.chinese,
      });
      // Reveal the line after speaking
      setRevealedLines((prev) => new Set(prev).add(lineIndex));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speech recognition failed');
    } finally {
      setListeningLine(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title={dialogue.title} />
      <div className="mx-auto max-w-lg px-4 py-4">
        <Link
          href="/practice"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All Dialogues
        </Link>

        <p className="mb-2 text-sm text-muted">{dialogue.description}</p>
        <p className="mb-4 text-xs text-muted">
          Tap the <Mic className="inline h-3 w-3" /> mic on your lines to practice speaking. The app will score your pronunciation.
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Role selector */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted">You are:</span>
          <button
            onClick={() => setPracticeRole('A')}
            className={`rounded-full px-3 py-1 text-sm ${
              practiceRole === 'A'
                ? 'bg-accent text-white'
                : 'bg-card text-foreground'
            }`}
          >
            Speaker A
          </button>
          <button
            onClick={() => setPracticeRole('B')}
            className={`rounded-full px-3 py-1 text-sm ${
              practiceRole === 'B'
                ? 'bg-primary text-white'
                : 'bg-card text-foreground'
            }`}
          >
            Speaker B
          </button>
        </div>

        {/* Controls */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={resetAll}
            className="flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Hide All
          </button>
          <button
            onClick={revealAll}
            className="flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-sm"
          >
            Show All
          </button>
        </div>

        {/* Dialogue lines */}
        <div className="space-y-3">
          {dialogue.lines.map((line, i) => {
            const isYou = line.speaker === practiceRole;
            const isListening = listeningLine === i;
            return (
              <div
                key={i}
                className="animate-fadeIn"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <DialogueBubble
                      speaker={line.speaker}
                      chinese={line.chinese}
                      pinyin={line.pinyin}
                      english={line.english}
                      isRevealed={!isYou || revealedLines.has(i)}
                      onReveal={() => toggleReveal(i)}
                    />
                  </div>
                  {isYou && (
                    <button
                      onClick={() => handleSpeak(i)}
                      disabled={isListening}
                      className={`mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-card text-muted hover:text-primary hover:bg-card/80'
                      }`}
                      aria-label="Speak this line"
                    >
                      <Mic size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Popup */}
      {scoreState && (
        <ScorePopup
          score={scoreState.score}
          grade={scoreState.grade}
          feedback={scoreState.feedback}
          spoken={scoreState.spoken}
          expected={scoreState.expected}
          onClose={() => setScoreState(null)}
        />
      )}
    </div>
  );
}
