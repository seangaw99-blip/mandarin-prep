import { hsk1Words } from '@/data/hsk/hsk1';
import { hsk2Words } from '@/data/hsk/hsk2';
import { hsk3Words } from '@/data/hsk/hsk3';
import { businessTerms } from '@/data/business-vocab';
import { vocabWords } from '@/data/vocabulary';
import DictDetailClient from './client';

export function generateStaticParams() {
  const ids: string[] = [
    ...hsk1Words.map((w) => w.id),
    ...hsk2Words.map((w) => w.id),
    ...hsk3Words.map((w) => w.id),
    ...businessTerms.map((t) => t.id),
    ...vocabWords.map((v) => `vocab-${v.id}`),
  ];
  // Deduplicate
  return [...new Set(ids)].map((id) => ({ id }));
}

export default async function DictEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DictDetailClient id={decodeURIComponent(id)} />;
}
