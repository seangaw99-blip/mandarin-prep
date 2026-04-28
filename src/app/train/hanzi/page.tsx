'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { hsk1Words } from '@/data/hsk/hsk1';
import { hsk2Words } from '@/data/hsk/hsk2';

// Pick single-character words for stroke practice
const PRACTICE_CHARS = [
  ...hsk1Words.filter((w) => [...w.simplified].length === 1).slice(0, 30),
  ...hsk2Words.filter((w) => [...w.simplified].length === 1).slice(0, 20),
].map((w) => ({ char: w.simplified, pinyin: w.pinyin, english: w.english }));

export default function HanziMenuPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? PRACTICE_CHARS.filter((c) =>
        c.char.includes(search) ||
        c.pinyin.toLowerCase().includes(search.toLowerCase()) ||
        c.english.toLowerCase().includes(search.toLowerCase())
      )
    : PRACTICE_CHARS;

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Stroke Order</h1>
          <p className="text-xs text-muted">Learn how to write Chinese characters</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search characters…"
          className="w-full rounded-xl bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="grid grid-cols-4 gap-3">
          {filtered.map((c) => (
            <Link key={c.char} href={`/train/hanzi/${encodeURIComponent(c.char)}`}>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-card p-3 active:scale-95 transition-transform text-center">
                <span className="font-chinese text-3xl font-bold">{c.char}</span>
                <span className="text-xs text-muted">{c.pinyin}</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted py-8">No matches found</p>
        )}
      </div>
    </div>
  );
}
