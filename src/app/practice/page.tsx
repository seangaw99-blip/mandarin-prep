'use client';

import Link from 'next/link';
import Header from '@/components/layout/header';
import { dialogues } from '@/data/dialogues';

const scenarioIcons: Record<string, string> = {
  hotel: '🏨',
  restaurant: '🍜',
  taxi: '🚕',
  factory: '🏭',
  negotiation: '💰',
  emergency: '🏥',
};

export default function PracticePage() {
  return (
    <div className="min-h-screen">
      <Header title="Conversation Practice" />
      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="mb-4 text-sm text-muted">
          Practice real conversations. Tap each line to reveal the Chinese.
        </p>
        <div className="space-y-3">
          {dialogues.map((dialogue, i) => (
            <Link key={dialogue.id} href={`/practice/${dialogue.id}`}>
              <div
                className="flex items-center gap-4 rounded-xl bg-card p-4 mb-3 animate-fadeIn active:scale-[0.98] transition-transform"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-2xl">
                  {scenarioIcons[dialogue.scenario] || '💬'}
                </span>
                <div>
                  <h3 className="font-semibold">{dialogue.title}</h3>
                  <p className="text-sm text-muted">{dialogue.description}</p>
                  <p className="text-xs text-muted mt-1">{dialogue.lines.length} lines</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
