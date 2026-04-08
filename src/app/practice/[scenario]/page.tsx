import { dialogues } from '@/data/dialogues';
import PracticeClient from './client';

export function generateStaticParams() {
  return dialogues.map((d) => ({ scenario: d.id }));
}

export default async function PracticeScenarioPage({
  params,
}: {
  params: Promise<{ scenario: string }>;
}) {
  const { scenario } = await params;
  return <PracticeClient scenarioId={scenario} />;
}
