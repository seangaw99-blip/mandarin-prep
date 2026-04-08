import { scenarios } from '@/data/phrases';
import ScenarioClient from './client';

export function generateStaticParams() {
  return scenarios.map((s) => ({ scenario: s.id }));
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ scenario: string }>;
}) {
  const { scenario } = await params;
  return <ScenarioClient scenarioId={scenario} />;
}
