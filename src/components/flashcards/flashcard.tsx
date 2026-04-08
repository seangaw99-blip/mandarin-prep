'use client';

interface FlashcardProps {
  chinese: string;
  pinyin: string;
  english: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({
  chinese,
  pinyin,
  english,
  isFlipped,
  onFlip,
}: FlashcardProps) {
  return (
    <div
      className="perspective w-full cursor-pointer"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onFlip();
      }}
      aria-label={isFlipped ? 'Show front of card' : 'Flip card to reveal answer'}
    >
      <div
        className={`relative w-full min-h-[300px] preserve-3d card-flip ${isFlipped ? 'flipped' : ''}`}
      >
        {/* Front - English */}
        <div className="absolute inset-0 backface-hidden bg-card rounded-2xl flex items-center justify-center p-6">
          <p className="text-3xl font-bold text-card-foreground text-center leading-relaxed">
            {english}
          </p>
        </div>

        {/* Back - Chinese + Pinyin */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-card rounded-2xl flex flex-col items-center justify-center p-6 gap-3">
          <p className="text-5xl font-chinese font-bold text-card-foreground text-center leading-relaxed">
            {chinese}
          </p>
          <p className="text-xl text-muted">{pinyin}</p>
        </div>
      </div>
    </div>
  );
}
