'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import PhraseCard from '@/components/phrases/phrase-card';
import { scenarios } from '@/data/phrases';
import { speakChinese } from '@/lib/audio';

export default function ScenarioClient({ scenarioId }: { scenarioId: string }) {
  const scenario = scenarios.find((s) => s.id === scenarioId);

  if (!scenario) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Scenario not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={`${scenario.icon} ${scenario.name}`} />
      <div className="mx-auto max-w-lg px-4 py-4">
        <Link
          href="/phrases"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All Scenarios
        </Link>

        <p className="mb-4 text-sm text-muted">{scenario.description}</p>

        <div className="space-y-3">
          {scenario.phrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              chinese={phrase.chinese}
              pinyin={phrase.pinyin}
              english={phrase.english}
              onSpeak={() => speakChinese(phrase.chinese)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
