'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/layout/header';
import {
  getImageableByTheme,
  THEME_LABEL,
  type Theme,
} from '@/lib/vocab-images';

const LEVELS: Array<{ id: 'all' | 1 | 2 | 3; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 1, label: 'HSK 1' },
  { id: 2, label: 'HSK 2' },
  { id: 3, label: 'HSK 3' },
];

export default function PictureCardsHome() {
  const allByTheme = useMemo(() => getImageableByTheme(), []);
  const total = useMemo(
    () => Object.values(allByTheme).reduce((s, arr) => s + arr.length, 0),
    [allByTheme],
  );

  return (
    <div className="min-h-screen">
      <Header title="Picture Cards" />
      <div className="mx-auto max-w-lg px-4 py-5 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="h-5 w-5" />
            <h2 className="font-semibold">Learn by Picture</h2>
          </div>
          <p className="text-sm opacity-90">
            See it, hear it, then reveal the hanzi. {total} imageable words from HSK 1–3.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">By Level</h3>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((lv) => (
              <Link key={lv.id} href={`/picture-cards/play?level=${lv.id}`}>
                <div className="rounded-xl bg-card p-4 active:scale-[0.98] transition-transform">
                  <p className="font-semibold text-sm">{lv.label}</p>
                  <p className="text-xs text-muted mt-0.5">Mixed themes</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">By Theme</h3>
          <div className="space-y-2">
            {(Object.keys(THEME_LABEL) as Theme[]).map((t) => {
              const count = allByTheme[t].length;
              if (count === 0) return null;
              return (
                <Link key={t} href={`/picture-cards/play?theme=${t}`}>
                  <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 active:scale-[0.98] transition-transform">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{THEME_LABEL[t]}</p>
                      <p className="text-xs text-muted">{count} cards</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
