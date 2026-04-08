'use client';

import SpeakerButton from '@/components/ui/speaker-button';

interface DialogueBubbleProps {
  speaker: 'A' | 'B';
  chinese: string;
  pinyin: string;
  english: string;
  isRevealed: boolean;
  onReveal: () => void;
}

export default function DialogueBubble({
  speaker,
  chinese,
  pinyin,
  english,
  isRevealed,
  onReveal,
}: DialogueBubbleProps) {
  const isLeft = speaker === 'A';
  const label = isLeft ? 'Partner' : 'You';

  return (
    <div
      className={`flex flex-col gap-1 max-w-[85%] ${
        isLeft ? 'self-start items-start' : 'self-end items-end'
      }`}
    >
      <span className="text-xs text-muted font-medium px-1">{label}</span>
      <div
        className={`rounded-2xl px-4 py-3 cursor-pointer ${
          isLeft
            ? 'bg-accent/10 rounded-tl-sm'
            : 'bg-primary/10 rounded-tr-sm'
        }`}
        onClick={!isRevealed ? onReveal : undefined}
        role={!isRevealed ? 'button' : undefined}
        tabIndex={!isRevealed ? 0 : undefined}
        onKeyDown={
          !isRevealed
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') onReveal();
              }
            : undefined
        }
      >
        {isRevealed ? (
          <div className="space-y-1 transition-opacity duration-200">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-chinese font-semibold text-card-foreground">
                  {chinese}
                </p>
                <p className="text-sm text-muted">{pinyin}</p>
                <p className="text-sm text-foreground">{english}</p>
              </div>
              <SpeakerButton text={chinese} size="sm" />
            </div>
          </div>
        ) : (
          <div className="space-y-1 transition-opacity duration-150">
            <p className="text-sm text-muted italic">Tap to reveal</p>
            <p className="text-sm text-foreground">{english}</p>
          </div>
        )}
      </div>
    </div>
  );
}
