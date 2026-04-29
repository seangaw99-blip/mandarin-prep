'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, BookMarked, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import { search } from '@/lib/dictionary';
import { loadCedict, searchCedict, isLoaded as cedictLoaded, type CedictEntry } from '@/lib/cedict';
import type { DictEntry } from '@/lib/db';

const HISTORY_KEY = 'dict-search-history';
const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
  6: 'bg-purple-100 text-purple-700',
};

function getHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]'); }
  catch { return []; }
}

function addToHistory(q: string) {
  const h = getHistory().filter((x) => x !== q).slice(0, 9);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...h]));
}

function LevelBadge({ level }: { level: number | null }) {
  if (!level) return null;
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[level] ?? 'bg-card text-muted'}`}>
      HSK {level}
    </span>
  );
}

function ResultRow({ entry }: { entry: DictEntry }) {
  return (
    <Link href={`/dictionary/${entry.id}`}>
      <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 active:scale-[0.98] transition-transform">
        <span className="font-chinese text-2xl font-bold w-12 shrink-0 text-center">
          {entry.simplified}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted truncate">{entry.pinyin}</p>
          <p className="text-sm font-medium truncate">{entry.english}</p>
        </div>
        <LevelBadge level={entry.level} />
      </div>
    </Link>
  );
}

function CedictRow({ entry }: { entry: CedictEntry }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-card px-4 py-3">
      <span className="font-chinese text-2xl font-bold w-12 shrink-0 text-center">
        {entry.simplified}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted">{entry.pinyin}</p>
        <p className="text-sm">{entry.english}</p>
      </div>
      <span className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium bg-muted/20 text-muted">
        CEDICT
      </span>
    </div>
  );
}

const FEATURED = [
  { label: 'HSK 1 Essentials', filter: 1, icon: '🌱' },
  { label: 'HSK 2 Vocabulary', filter: 2, icon: '📗' },
  { label: 'Business & Packaging', filter: 0, icon: '📦' },
];

export default function DictionaryPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DictEntry[]>([]);
  const [cedictResults, setCedictResults] = useState<CedictEntry[]>([]);
  const [cedictReady, setCedictReady] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(getHistory());
    inputRef.current?.focus();
    if (!cedictLoaded()) {
      loadCedict().then(() => setCedictReady(true)).catch((err) => {
        console.warn('CC-CEDICT failed to load:', err);
      });
    } else {
      setCedictReady(true);
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCedictResults([]);
      return;
    }
    const r = search(query);
    const filtered = levelFilter !== null
      ? r.filter((e) => e.level === levelFilter || (levelFilter === 0 && e.source === 'business'))
      : r;
    setResults(filtered);

    if (cedictReady && levelFilter === null) {
      const seenSimplified = new Set(filtered.map((e) => e.simplified));
      const cedict = searchCedict(query, 60).filter((e) => !seenSimplified.has(e.simplified));
      setCedictResults(cedict);
    } else {
      setCedictResults([]);
    }
  }, [query, levelFilter, cedictReady]);

  const handleSubmit = () => {
    if (query.trim()) addToHistory(query.trim());
  };

  const clearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen">
      <Header title="Dictionary" />

      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="mx-auto max-w-lg">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Search Chinese, pinyin, or English…"
              className="font-chinese w-full rounded-xl bg-card pl-9 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {hasQuery && (
              <button onClick={clearQuery} className="absolute right-3 text-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Level filter pills */}
          <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[null, 1, 2, 3, 4, 5, 6].map((l) => (
              <button
                key={l ?? 'all'}
                onClick={() => setLevelFilter(l)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  levelFilter === l
                    ? 'bg-primary text-white'
                    : 'bg-card text-muted'
                }`}
              >
                {l === null ? 'All' : `HSK ${l}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Results */}
        {hasQuery && (
          <>
            {results.length === 0 && cedictResults.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">
                {cedictReady ? `No results for "${query}"` : `Loading dictionary…`}
              </p>
            ) : (
              <div className="space-y-2">
                {results.length > 0 && (
                  <>
                    {results.length > 0 && cedictResults.length > 0 && (
                      <h3 className="text-xs font-semibold text-muted uppercase tracking-wide pt-1">Curriculum</h3>
                    )}
                    {results.map((e) => <ResultRow key={e.id} entry={e} />)}
                  </>
                )}
                {cedictResults.length > 0 && (
                  <>
                    {results.length > 0 && (
                      <h3 className="text-xs font-semibold text-muted uppercase tracking-wide pt-3">Full Dictionary</h3>
                    )}
                    {cedictResults.map((e) => <CedictRow key={e.simplified + '|' + e.pinyin} entry={e} />)}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!hasQuery && (
          <>
            {/* Recent searches */}
            {history.length > 0 && (
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Recent</h2>
                  <button
                    onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]); }}
                    className="text-xs text-muted"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((h) => (
                    <button
                      key={h}
                      onClick={() => setQuery(h)}
                      className="rounded-full bg-card px-3 py-1.5 text-sm"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Featured browsing */}
            <section>
              <h2 className="mb-2 text-sm font-semibold text-muted uppercase tracking-wide">Browse</h2>
              <div className="space-y-2">
                {FEATURED.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setLevelFilter(f.filter === 0 ? null : f.filter)}
                    className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3"
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-sm font-medium">{f.label}</span>
                    <TrendingUp className="ml-auto h-4 w-4 text-muted" />
                  </button>
                ))}
              </div>
            </section>

            {/* Tip */}
            <div className="rounded-xl bg-primary/10 px-4 py-3">
              <p className="text-sm text-primary font-medium">💡 Search tip</p>
              <p className="text-xs text-muted mt-1">
                Type Chinese characters, pinyin (with or without tones), or English. Try: 你好 · ni hao · hello
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
