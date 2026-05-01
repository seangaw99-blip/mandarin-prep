'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock, PlayCircle, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/header';
import { LEVELS, UNITS, type Unit } from '@/data/curriculum';
import { getCurrentUnit, getAllProgress } from '@/lib/curriculum';
import type { UnitProgress } from '@/lib/db';

export default function LessonsPage() {
  const [progressMap, setProgressMap] = useState<Map<string, UnitProgress>>(new Map());
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await getAllProgress();
      setProgressMap(new Map(all.map((p) => [p.unitId, p])));
      const cur = await getCurrentUnit();
      setCurrentUnitId(cur.id);
      setLoading(false);
    })();
  }, []);

  const unitStatus = (unit: Unit): 'completed' | 'current' | 'available' | 'locked' => {
    const p = progressMap.get(unit.id);
    if (p?.status === 'completed') return 'completed';
    if (unit.id === currentUnitId) return 'current';
    // locked if any earlier unit isn't completed
    const idx = UNITS.findIndex((u) => u.id === unit.id);
    for (let i = 0; i < idx; i++) {
      const earlier = progressMap.get(UNITS[i].id);
      if (earlier?.status !== 'completed') return 'locked';
    }
    return 'available';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Lessons" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Lessons" />
      <div className="mx-auto max-w-lg px-4 py-5 space-y-6">
        {LEVELS.map((lv) => {
          const units = UNITS.filter((u) => u.level === lv.level);
          const completedCount = units.filter((u) => progressMap.get(u.id)?.status === 'completed').length;
          return (
            <section key={lv.level}>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <span>{lv.emoji}</span> {lv.name}
                  </h2>
                  <p className="text-xs text-muted">{lv.description}</p>
                </div>
                <span className="text-xs text-muted shrink-0">
                  {completedCount}/{units.length}
                </span>
              </div>
              <div className="space-y-2">
                {units.map((u) => {
                  const status = unitStatus(u);
                  const p = progressMap.get(u.id);
                  const activitiesDone = p?.completedActivities.length ?? 0;
                  return (
                    <UnitRow
                      key={u.id}
                      unit={u}
                      status={status}
                      activitiesDone={activitiesDone}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function UnitRow({
  unit,
  status,
  activitiesDone,
}: {
  unit: Unit;
  status: 'completed' | 'current' | 'available' | 'locked';
  activitiesDone: number;
}) {
  const isLocked = status === 'locked';
  const Wrapper: React.ElementType = isLocked ? 'div' : Link;
  const wrapperProps = isLocked ? {} : { href: `/lessons/${unit.id}` };

  return (
    <Wrapper {...wrapperProps}>
      <div
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-transform ${
          isLocked
            ? 'bg-card opacity-50'
            : 'bg-card active:scale-[0.98]'
        } ${status === 'current' ? 'ring-2 ring-primary' : ''}`}
      >
        <div className="shrink-0">
          {status === 'completed' && <CheckCircle2 className="h-7 w-7 text-success" />}
          {status === 'current'   && <PlayCircle className="h-7 w-7 text-primary" />}
          {status === 'available' && <PlayCircle className="h-7 w-7 text-muted" />}
          {status === 'locked'    && <Lock className="h-7 w-7 text-muted" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{unit.title}</p>
          <p className="text-xs text-muted truncate">
            {unit.vocabIds.length > 0 ? `${unit.vocabIds.length} words · ` : ''}
            {unit.activities.length} activit{unit.activities.length === 1 ? 'y' : 'ies'}
            {activitiesDone > 0 && ` · ${activitiesDone} done`}
          </p>
        </div>
        {!isLocked && <ChevronRight className="h-4 w-4 text-muted shrink-0" />}
      </div>
    </Wrapper>
  );
}

