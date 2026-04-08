'use client';

import SpeakerButton from '@/components/ui/speaker-button';

interface PhraseCardProps {
  chinese: string;
  pinyin: string;
  english: string;
  onSpeak?: () => void;
}

export default function PhraseCard({
  chinese,
  pinyin,
  english,
  onSpeak,
}: PhraseCardProps) {
  const handleSpeak = () => {
    if (onSpeak) {
      onSpeak();
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-chinese font-bold text-card-foreground">
          {chinese}
        </p>
        <p className="text-lg text-muted mt-1">{pinyin}</p>
        <p className="text-base text-foreground mt-1">{english}</p>
      </div>
      {onSpeak ? (
        <button
          onClick={handleSpeak}
          className="w-10 h-10 flex items-center justify-center rounded-full text-muted hover:text-primary transition-colors shrink-0"
          aria-label={`Speak: ${chinese}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </button>
      ) : (
        <SpeakerButton text={chinese} size="md" />
      )}
    </div>
  );
}
