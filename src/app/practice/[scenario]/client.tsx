'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import DialogueBubble from '@/components/practice/dialogue-bubble';
import { dialogues } from '@/data/dialogues';
import { speakChinese } from '@/lib/audio';

export default function PracticeClient({ scenarioId }: { scenarioId: string }) {
  const dialogue = dialogues.find((d) => d.id === scenarioId);
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const [practiceRole, setPracticeRole] = useState<'A' | 'B'>('A');

  if (!dialogue) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Dialogue not found</p>
      </div>
    );
  }

  const toggleReveal = (index: number) => {
    setRevealedLines((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        speakChinese(dialogue.lines[index].chinese);
      }
      return next;
    });
  };

  const resetAll = () => setRevealedLines(new Set());
  const revealAll = () =>
    setRevealedLines(new Set(dialogue.lines.map((_, i) => i)));

  return (
    <div className="min-h-screen">
      <Header title={dialogue.title} />
      <div className="mx-auto max-w-lg px-4 py-4">
        <Link
          href="/practice"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All Dialogues
        </Link>

        <p className="mb-4 text-sm text-muted">{dialogue.description}</p>

        {/* Role selector */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted">You are:</span>
          <button
            onClick={() => setPracticeRole('A')}
            className={`rounded-full px-3 py-1 text-sm ${
              practiceRole === 'A'
                ? 'bg-accent text-white'
                : 'bg-card text-foreground'
            }`}
          >
            Speaker A
          </button>
          <button
            onClick={() => setPracticeRole('B')}
            className={`rounded-full px-3 py-1 text-sm ${
              practiceRole === 'B'
                ? 'bg-primary text-white'
                : 'bg-card text-foreground'
            }`}
          >
            Speaker B
          </button>
        </div>

        {/* Controls */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={resetAll}
            className="flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Hide All
          </button>
          <button
            onClick={revealAll}
            className="flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-sm"
          >
            Show All
          </button>
        </div>

        {/* Dialogue lines */}
        <div className="space-y-3">
          {dialogue.lines.map((line, i) => {
            const isYou = line.speaker === practiceRole;
            return (
              <div
                key={i}
                className="animate-fadeIn"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <DialogueBubble
                  speaker={line.speaker}
                  chinese={line.chinese}
                  pinyin={line.pinyin}
                  english={line.english}
                  isRevealed={!isYou || revealedLines.has(i)}
                  onReveal={() => toggleReveal(i)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
