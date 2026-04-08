'use client';

import { Trophy, Star, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FinalScoreProps {
  averageScore: number;
  lineScores: { lineIndex: number; score: number; spoken: string; expected: string }[];
  highScore: number;
  isNewHighScore: boolean;
  dialogueTitle: string;
  onRetry: () => void;
}

function getGrade(score: number) {
  if (score >= 90) return { label: 'Master', emoji: '🌟', color: 'text-yellow-400' };
  if (score >= 75) return { label: 'Great', emoji: '🎉', color: 'text-green-400' };
  if (score >= 55) return { label: 'Good', emoji: '👍', color: 'text-blue-400' };
  if (score >= 35) return { label: 'Keep Going', emoji: '💪', color: 'text-orange-400' };
  return { label: 'Practice More', emoji: '🔄', color: 'text-red-400' };
}

export default function FinalScore({
  averageScore,
  lineScores,
  highScore,
  isNewHighScore,
  dialogueTitle,
  onRetry,
}: FinalScoreProps) {
  const grade = getGrade(averageScore);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-4">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="text-3xl mb-1 animate-scaleIn">{grade.emoji}</div>
            <h2 className="text-base font-bold">{dialogueTitle}</h2>
            <p className="text-xs text-muted">Conversation Complete</p>
          </div>

          {/* Main Score */}
          <div className="rounded-xl bg-card p-4 text-center mb-3">
            <p className="text-xs text-muted">Your Score</p>
            <p className={`text-5xl font-bold ${grade.color}`}>{averageScore}</p>
            <p className={`text-sm font-semibold ${grade.color}`}>{grade.label}</p>
          </div>

          {/* High Score */}
          <div className="rounded-xl bg-card p-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className={`h-5 w-5 ${isNewHighScore ? 'text-yellow-400' : 'text-muted'}`} />
              <div>
                <p className="text-xs font-medium">
                  {isNewHighScore ? 'New High Score!' : 'High Score'}
                </p>
                <p className="text-xs text-muted">
                  {isNewHighScore
                    ? `Previous: ${highScore > 0 ? highScore : '—'}`
                    : 'Try to beat it!'}
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-yellow-400">
              {isNewHighScore ? averageScore : highScore}
            </p>
          </div>

          {/* Line-by-line breakdown */}
          <div className="rounded-xl bg-card p-3 mb-3">
            <p className="text-xs font-semibold mb-2">Line-by-Line</p>
            <div className="space-y-1.5">
              {lineScores.map((ls, i) => {
                const lineGrade = getGrade(ls.score);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 shrink-0 w-12">
                      <Star className={`h-3 w-3 ${lineGrade.color}`} />
                      <span className={`text-xs font-bold ${lineGrade.color}`}>
                        {ls.score}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-chinese truncate">{ls.expected}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions - fixed at bottom */}
      <div className="px-4 py-3 pb-16 border-t border-border bg-background">
        <div className="mx-auto max-w-lg flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/practice"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-card py-3 font-semibold text-foreground text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            All Dialogues
          </Link>
        </div>
      </div>
    </div>
  );
}
