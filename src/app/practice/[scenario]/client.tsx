'use client';

import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Mic, Trophy } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import DialogueBubble from '@/components/practice/dialogue-bubble';
import ScorePopup from '@/components/practice/score-popup';
import FinalScore from '@/components/practice/final-score';
import { dialogues } from '@/data/dialogues';
import { speakChinese } from '@/lib/audio';
import {
  listenForChinese,
  scorePronunciation,
} from '@/lib/speech-recognition';
import { getHighScore, saveHighScore } from '@/lib/high-scores';

interface ScoreState {
  score: number;
  grade: 'perfect' | 'great' | 'good' | 'fair' | 'try-again';
  feedback: string;
  spoken: string;
  expected: string;
}

interface LineScore {
  lineIndex: number;
  score: number;
  spoken: string;
  expected: string;
}

export default function PracticeClient({ scenarioId }: { scenarioId: string }) {
  const dialogue = dialogues.find((d) => d.id === scenarioId);
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const [practiceRole, setPracticeRole] = useState<'A' | 'B'>('A');
  const [listeningLine, setListeningLine] = useState<number | null>(null);
  const [scoreState, setScoreState] = useState<ScoreState | null>(null);
  const [lineScores, setLineScores] = useState<Map<number, LineScore>>(new Map());
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scenarioId) {
      setHighScore(getHighScore(scenarioId));
    }
  }, [scenarioId]);

  if (!dialogue) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Dialogue not found</p>
      </div>
    );
  }

  // Figure out which lines are "yours"
  const yourLineIndices = dialogue.lines
    .map((line, i) => (line.speaker === practiceRole ? i : -1))
    .filter((i) => i !== -1);

  const allYourLinesDone = yourLineIndices.every((i) => lineScores.has(i));
  const yourLineCount = yourLineIndices.length;
  const completedCount = yourLineIndices.filter((i) => lineScores.has(i)).length;

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
    setLineScores(new Map());
    setShowFinalScore(false);
    setError(null);
    setHighScore(getHighScore(scenarioId));
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

      // Save line score
      const newLineScore: LineScore = {
        lineIndex,
        score: score.score,
        spoken: result.transcript,
        expected: line.chinese,
      };
      setLineScores((prev) => {
        const next = new Map(prev);
        next.set(lineIndex, newLineScore);
        return next;
      });

      // Show per-line popup
      setScoreState({
        ...score,
        spoken: result.transcript,
        expected: line.chinese,
      });

      // Reveal the line after speaking
      setRevealedLines((prev) => new Set(prev).add(lineIndex));

      // Check if all your lines are done (after this one)
      const updatedCompleted = yourLineIndices.filter(
        (i) => i === lineIndex || lineScores.has(i)
      ).length;
      if (updatedCompleted === yourLineCount) {
        // Show final score after popup closes
        setTimeout(() => {
          const allScores = [...lineScores.values(), newLineScore];
          const avg = Math.round(
            allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length
          );
          const isNew = saveHighScore(scenarioId, avg);
          setHighScore(isNew ? avg : getHighScore(scenarioId));
          setShowFinalScore(true);
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speech recognition failed');
    } finally {
      setListeningLine(null);
    }
  };

  // Calculate average for final score
  const finalAverage = useMemo(() => {
    const scores = [...lineScores.values()];
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);
  }, [lineScores]);

  const isNewHighScore = finalAverage > highScore && finalAverage > 0;

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
        <p className="mb-3 text-xs text-muted">
          Tap the <Mic className="inline h-3 w-3" /> mic on your lines to practice speaking.
        </p>

        {/* Progress + High Score bar */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-card px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Progress:</span>
            <span className="text-sm font-semibold">
              {completedCount} / {yourLineCount}
            </span>
          </div>
          {highScore > 0 && (
            <div className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">{highScore}</span>
            </div>
          )}
        </div>

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
            onClick={() => {
              setPracticeRole('A');
              resetAll();
            }}
            className={`rounded-full px-3 py-1 text-sm ${
              practiceRole === 'A'
                ? 'bg-accent text-white'
                : 'bg-card text-foreground'
            }`}
          >
            Speaker A
          </button>
          <button
            onClick={() => {
              setPracticeRole('B');
              resetAll();
            }}
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
            Start Over
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
            const hasScore = lineScores.has(i);
            const lineScore = lineScores.get(i);
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
                    <div className="flex flex-col items-center gap-1 mb-1">
                      {hasScore && lineScore && (
                        <span
                          className={`text-xs font-bold ${
                            lineScore.score >= 75
                              ? 'text-green-400'
                              : lineScore.score >= 50
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {lineScore.score}
                        </span>
                      )}
                      <button
                        onClick={() => handleSpeak(i)}
                        disabled={isListening}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : hasScore
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-card text-muted hover:text-primary hover:bg-card/80'
                        }`}
                        aria-label="Speak this line"
                      >
                        <Mic size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-line Score Popup */}
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

      {/* Final Score Screen */}
      {showFinalScore && (
        <FinalScore
          averageScore={finalAverage}
          lineScores={[...lineScores.values()]}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          dialogueTitle={dialogue.title}
          onRetry={resetAll}
        />
      )}
    </div>
  );
}
