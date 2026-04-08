'use client';

import { X, Check } from 'lucide-react';

interface SwipeControlsProps {
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function SwipeControls({
  onCorrect,
  onIncorrect,
}: SwipeControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 w-full">
      <button
        onClick={onIncorrect}
        className="flex-1 flex items-center justify-center gap-2 min-h-[60px] rounded-xl bg-red-500/10 text-red-500 font-semibold text-base border border-red-500/20 hover:bg-red-500/20 transition-colors active:scale-90 transition-transform"
        aria-label="Don't Know"
      >
        <X size={22} />
        <span>Don&apos;t Know</span>
      </button>

      <button
        onClick={onCorrect}
        className="flex-1 flex items-center justify-center gap-2 min-h-[60px] rounded-xl bg-success/10 text-success font-semibold text-base border border-success/20 hover:bg-success/20 transition-colors active:scale-90 transition-transform"
        aria-label="Got It"
      >
        <Check size={22} />
        <span>Got It</span>
      </button>
    </div>
  );
}
