'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ScorePopupProps {
  score: number;
  grade: 'perfect' | 'great' | 'good' | 'fair' | 'try-again';
  feedback: string;
  spoken: string;
  expected: string;
  onClose: () => void;
}

const gradeConfig = {
  perfect: { emoji: '🌟', color: 'text-yellow-400', bg: 'bg-yellow-400/10', ring: 'ring-yellow-400/30' },
  great: { emoji: '🎉', color: 'text-green-400', bg: 'bg-green-400/10', ring: 'ring-green-400/30' },
  good: { emoji: '👍', color: 'text-blue-400', bg: 'bg-blue-400/10', ring: 'ring-blue-400/30' },
  fair: { emoji: '💪', color: 'text-orange-400', bg: 'bg-orange-400/10', ring: 'ring-orange-400/30' },
  'try-again': { emoji: '🔄', color: 'text-red-400', bg: 'bg-red-400/10', ring: 'ring-red-400/30' },
};

export default function ScorePopup({
  score,
  grade,
  feedback,
  spoken,
  expected,
  onClose,
}: ScorePopupProps) {
  const config = gradeConfig[grade];

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div
        className={`relative w-full max-w-sm rounded-2xl ring-2 ${config.ring} bg-background p-6 text-center animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted hover:text-foreground"
        >
          <X size={20} />
        </button>

        <div className="text-4xl mb-2">{config.emoji}</div>

        <div className={`text-6xl font-bold ${config.color} mb-1`}>{score}</div>
        <div className="text-sm text-muted mb-3">out of 100</div>

        <p className="text-sm font-medium mb-3">{feedback}</p>

        {spoken && spoken !== expected && (
          <div className="space-y-2 text-left rounded-xl bg-background/50 p-3">
            <div>
              <p className="text-xs text-muted">You said:</p>
              <p className="font-chinese text-base">{spoken}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Expected:</p>
              <p className="font-chinese text-base">{expected}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
