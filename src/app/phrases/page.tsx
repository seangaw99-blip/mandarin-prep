'use client';

import Link from 'next/link';
import Header from '@/components/layout/header';
import { scenarios } from '@/data/phrases';

export default function PhrasesPage() {
  return (
    <div className="min-h-screen">
      <Header title="Phrase Book" />
      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="mb-4 text-sm text-muted">
          Phrases organized by real scenarios you&apos;ll encounter in China.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {scenarios.map((scenario, i) => (
            <Link key={scenario.id} href={`/phrases/${scenario.id}`}>
              <div
                className="flex flex-col items-center gap-2 rounded-xl bg-card p-5 text-center transition-colors hover:bg-card/80 active:scale-[0.97] transition-transform animate-fadeIn"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-3xl">{scenario.icon}</span>
                <h3 className="font-semibold">{scenario.name}</h3>
                <p className="text-xs text-muted">{scenario.phrases.length} phrases</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
