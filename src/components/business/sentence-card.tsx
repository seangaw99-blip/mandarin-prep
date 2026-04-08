'use client';

import SpeakerButton from '@/components/ui/speaker-button';

interface SentenceCardProps {
  chinese: string;
  pinyin: string;
  english: string;
  context: string;
}

export default function SentenceCard({
  chinese,
  pinyin,
  english,
  context,
}: SentenceCardProps) {
  return (
    <div className="bg-card rounded-xl border-l-4 border-accent p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-xl font-chinese font-semibold text-card-foreground leading-relaxed">
            {chinese}
          </p>
          <p className="text-base text-muted">{pinyin}</p>
          <p className="text-base text-foreground">{english}</p>
        </div>
        <SpeakerButton text={chinese} size="md" />
      </div>
      <p className="text-sm text-muted italic">{context}</p>
    </div>
  );
}
