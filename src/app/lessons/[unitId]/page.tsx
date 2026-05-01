import { UNITS } from '@/data/curriculum';
import UnitDetailClient from './client';

export function generateStaticParams() {
  return UNITS.map((u) => ({ unitId: u.id }));
}

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  return <UnitDetailClient unitId={decodeURIComponent(unitId)} />;
}
