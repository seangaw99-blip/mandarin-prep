'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import Header from '@/components/layout/header';
import { dialogues } from '@/data/dialogues';
import { getHighScores } from '@/lib/high-scores';

const scenarioIcons: Record<string, string> = {
  hotel: '🏨',
  restaurant: '🍜',
  taxi: '🚕',
  factory: '🏭',
  negotiation: '💰',
  emergency: '🏥',
};

export default function PracticePage() {
  const [scores, setScores] = useState<Record<string, { score: number }>>({});

  useEffect(() => {
    setScores(getHighScores());
  }, []);

  return (
    <div className="min-h-screen">
      <Header title="Conversation Practice" />
      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="mb-4 text-sm text-muted">
          Practice real conversations. Use the mic to speak and get scored on pronunciation.
        </p>
        <div className="space-y-3">
          {dialogues.map((dialogue, i) => {
            const hs = scores[dialogue.id];
            return (
              <Link key={dialogue.id} href={`/practice/${dialogue.id}`}>
                <div
                  className="flex items-center gap-4 rounded-xl bg-card p-4 mb-3 animate-fadeIn active:scale-[0.98] transition-transform"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="text-2xl">
                    {scenarioIcons[dialogue.scenario] || '💬'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{dialogue.title}</h3>
                    <p className="text-sm text-muted">{dialogue.description}</p>
                    <p className="text-xs text-muted mt-1">{dialogue.lines.length} lines</p>
                  </div>
                  {hs && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-lg font-bold text-yellow-400">{hs.score}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
