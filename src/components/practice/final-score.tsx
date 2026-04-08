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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-scaleIn">{grade.emoji}</div>
          <h2 className="text-xl font-bold mb-1">{dialogueTitle}</h2>
          <p className="text-sm text-muted">Conversation Complete</p>
        </div>

        {/* Main Score */}
        <div className="rounded-2xl bg-card p-6 text-center mb-4">
          <p className="text-sm text-muted mb-1">Your Score</p>
          <p className={`text-7xl font-bold ${grade.color}`}>{averageScore}</p>
          <p className={`text-lg font-semibold ${grade.color} mt-1`}>{grade.label}</p>
        </div>

        {/* High Score */}
        <div className="rounded-xl bg-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className={`h-6 w-6 ${isNewHighScore ? 'text-yellow-400' : 'text-muted'}`} />
            <div>
              <p className="text-sm font-medium">
                {isNewHighScore ? 'New High Score!' : 'High Score'}
              </p>
              <p className="text-xs text-muted">
                {isNewHighScore
                  ? `Previous: ${highScore > 0 ? highScore : '—'}`
                  : 'Try to beat it!'}
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {isNewHighScore ? averageScore : highScore}
          </p>
        </div>

        {/* Line-by-line breakdown */}
        <div className="rounded-xl bg-card p-4 mb-6">
          <p className="text-sm font-semibold mb-3">Line-by-Line</p>
          <div className="space-y-2">
            {lineScores.map((ls, i) => {
              const lineGrade = getGrade(ls.score);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0 w-16">
                    <Star className={`h-3 w-3 ${lineGrade.color}`} />
                    <span className={`text-sm font-bold ${lineGrade.color}`}>
                      {ls.score}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-chinese truncate">{ls.expected}</p>
                    {ls.spoken !== ls.expected && (
                      <p className="text-xs text-muted truncate">You: {ls.spoken}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/practice"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-card py-3 font-semibold text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All Dialogues
          </Link>
        </div>
      </div>
    </div>
  );
}
