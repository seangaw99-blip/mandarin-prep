'use client';

import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakChinese } from '@/lib/audio';

interface SpeakerButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function SpeakerButton({ text, size = 'md' }: SpeakerButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    setIsSpeaking(true);
    speakChinese(text);
    setTimeout(() => setIsSpeaking(false), 1500);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full text-muted hover:text-primary transition-colors ${
        isSpeaking ? 'animate-pulse text-primary' : ''
      }`}
      aria-label={`Speak: ${text}`}
    >
      <Volume2 size={iconSizes[size]} />
    </button>
  );
}
