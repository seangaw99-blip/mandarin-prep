import { cheatsheets } from '@/data/cheatsheets';
import CheatSheetClient from './client';

export function generateStaticParams() {
  return cheatsheets.map((s) => ({ card: s.id }));
}

export default async function CheatSheetPage({
  params,
}: {
  params: Promise<{ card: string }>;
}) {
  const { card } = await params;
  return <CheatSheetClient cardId={card} />;
}
