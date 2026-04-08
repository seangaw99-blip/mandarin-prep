'use client';

import SpeakerButton from '@/components/ui/speaker-button';

interface CheatCardProps {
  chinese: string;
  pinyin: string;
  english: string;
}

export default function CheatCard({ chinese, pinyin, english }: CheatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 text-center shadow-lg space-y-3">
      <p className="text-4xl font-chinese font-bold text-gray-900 leading-relaxed">
        {chinese}
      </p>
      <p className="text-xl text-gray-600">{pinyin}</p>
      <p className="text-sm text-gray-400">{english}</p>
      <div className="flex justify-center pt-1">
        <SpeakerButton text={chinese} size="lg" />
      </div>
    </div>
  );
}
