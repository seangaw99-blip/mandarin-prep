'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, BookOpen, Headphones, MessageCircle, BookMarked, Mic, Music,
  CheckCircle2, Circle, ChevronRight,
} from 'lucide-react';
import { getUnit, type UnitActivity } from '@/data/curriculum';
import { getUnitProgress, markActivityDone } from '@/lib/curriculum';
import type { UnitProgress } from '@/lib/db';

const ACTIVITY_ICON: Record<UnitActivity['type'], React.ComponentType<{ className?: string }>> = {
  vocab: BookOpen,
  grammar: BookMarked,
  listening: Headphones,
  dialogue: MessageCircle,
  reading: BookOpen,
  speaking: Mic,
  tones: Music,
};

const TYPE_COLOR: Record<UnitActivity['type'], string> = {
  vocab: 'bg-blue-500',
  grammar: 'bg-orange-500',
  listening: 'bg-teal-500',
  dialogue: 'bg-emerald-500',
  reading: 'bg-amber-500',
  speaking: 'bg-rose-500',
  tones: 'bg-purple-500',
};

export default function UnitDetailClient({ unitId }: { unitId: string }) {
  const router = useRouter();
  const unit = getUnit(unitId);
  const [progress, setProgress] = useState<UnitProgress | null>(null);

  useEffect(() => {
    if (!unit) return;
    getUnitProgress(unit.id).then((p) => setProgress(p ?? null));
  }, [unit]);

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Unit not found.</p>
      </div>
    );
  }

  const doneIds = new Set(progress?.completedActivities ?? []);

  const handleActivityClick = async (a: UnitActivity) => {
    await markActivityDone(unit.id, a.id);
    router.push(a.href);
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{unit.title}</h1>
          <p className="text-xs text-muted truncate">Unit {unit.index} · Level {unit.level}</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-5 space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-red-700 p-5 text-white">
          <p className="text-sm font-medium opacity-90">{unit.blurb}</p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span>{unit.vocabIds.length} words</span>
            <span>·</span>
            <span>{unit.activities.length} activities</span>
          </div>
        </div>

        {unit.vocabIds.length > 0 && (
          <Link href="/study">
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 active:scale-[0.98] transition-transform">
              <div className="rounded-full bg-blue-500 p-2.5 shrink-0">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Vocabulary review</p>
                <p className="text-xs text-muted">Flashcard practice for this unit's words</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted shrink-0" />
            </div>
          </Link>
        )}

        <div>
          <h2 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Activities</h2>
          <div className="space-y-2">
            {unit.activities.map((a) => {
              const Icon = ACTIVITY_ICON[a.type];
              const done = doneIds.has(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => handleActivityClick(a)}
                  className="w-full flex items-center gap-3 rounded-2xl bg-card p-4 active:scale-[0.98] transition-transform text-left"
                >
                  <div className={`rounded-full ${TYPE_COLOR[a.type]} p-2.5 shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{a.label}</p>
                    <p className="text-xs text-muted">~{a.estMinutes} min · {a.type}</p>
                  </div>
                  {done
                    ? <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    : <Circle className="h-5 w-5 text-muted shrink-0" />
                  }
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
