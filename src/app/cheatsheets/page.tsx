'use client';

import Link from 'next/link';
import Header from '@/components/layout/header';
import { cheatsheets } from '@/data/cheatsheets';

export default function CheatsheetsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Cheat Sheets" />
      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="mb-4 text-sm text-muted">
          Large-font cards you can show to taxi drivers, waiters, and hotel staff.
        </p>
        <div className="space-y-3">
          {cheatsheets.map((sheet, i) => (
            <Link key={sheet.id} href={`/cheatsheets/${sheet.id}`}>
              <div
                className={`flex items-center gap-4 rounded-xl ${sheet.color} p-4 text-white mb-3 animate-fadeIn active:scale-[0.98] transition-transform`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-3xl">{sheet.icon}</span>
                <div>
                  <h3 className="font-semibold">{sheet.title}</h3>
                  <p className="text-sm opacity-80">{sheet.description}</p>
                  <p className="text-xs opacity-60 mt-1">{sheet.phrases.length} phrases</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
