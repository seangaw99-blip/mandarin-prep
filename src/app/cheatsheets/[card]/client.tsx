'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import CheatCard from '@/components/cheatsheets/cheat-card';
import { cheatsheets } from '@/data/cheatsheets';

export default function CheatSheetClient({ cardId }: { cardId: string }) {
  const sheet = cheatsheets.find((s) => s.id === cardId);

  if (!sheet) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cheat sheet not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={`${sheet.icon} ${sheet.title}`} />
      <div className="mx-auto max-w-lg px-4 py-4">
        <Link
          href="/cheatsheets"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All Cheat Sheets
        </Link>

        <p className="mb-4 text-sm text-muted">
          Show these to locals — designed for maximum readability.
        </p>

        <div className="space-y-3">
          {sheet.phrases.map((phrase, i) => (
            <CheatCard
              key={i}
              chinese={phrase.chinese}
              pinyin={phrase.pinyin}
              english={phrase.english}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
