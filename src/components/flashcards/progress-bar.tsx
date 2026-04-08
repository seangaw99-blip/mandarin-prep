'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  correct: number;
}

export default function ProgressBar({
  current,
  total,
  correct,
}: ProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  const accuracy = current > 0 ? Math.round((correct / current) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {current} of {total}
        </span>
        {current > 0 && <span>{accuracy}% correct</span>}
      </div>
    </div>
  );
}
