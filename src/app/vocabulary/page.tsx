'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Header from '@/components/layout/header';
import SpeakerButton from '@/components/ui/speaker-button';
import { vocabCategories, vocabWords } from '@/data/vocabulary';

export default function VocabularyPage() {
  const [activeCategory, setActiveCategory] = useState('greetings');
  const [search, setSearch] = useState('');

  const filteredWords = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return vocabWords.filter(
        (w) =>
          w.chinese.includes(q) ||
          w.pinyin.toLowerCase().includes(q) ||
          w.english.toLowerCase().includes(q)
      );
    }
    return vocabWords.filter((w) => w.category === activeCategory);
  }, [search, activeCategory]);

  const activeCat = vocabCategories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen">
      <Header title="Vocabulary Reference" />
      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search words (Chinese, pinyin, or English)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Total count */}
        <p className="text-xs text-muted mb-3">
          {search.trim()
            ? `${filteredWords.length} result${filteredWords.length !== 1 ? 's' : ''} found`
            : `${vocabWords.length} total words across ${vocabCategories.length} categories`}
        </p>

        {/* Category pills */}
        {!search.trim() && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {vocabCategories.map((cat) => {
              const count = vocabWords.filter((w) => w.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted hover:text-foreground'
                  }`}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Category header */}
        {!search.trim() && activeCat && (
          <h2 className="text-lg font-bold mb-3">
            {activeCat.icon} {activeCat.name}
          </h2>
        )}

        {/* Word list */}
        <div className="space-y-2">
          {filteredWords.map((word, i) => (
            <div
              key={word.id}
              className="flex items-center gap-3 rounded-xl bg-card p-4 animate-fadeIn"
              style={{ animationDelay: `${Math.min(i * 0.02, 0.5)}s` }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-chinese font-bold text-card-foreground leading-tight">
                  {word.chinese}
                </p>
                <p className="text-sm text-primary font-medium mt-0.5">{word.pinyin}</p>
                <p className="text-sm text-muted mt-0.5">{word.english}</p>
                {search.trim() && (
                  <p className="text-xs text-muted mt-1">
                    {vocabCategories.find((c) => c.id === word.category)?.icon}{' '}
                    {vocabCategories.find((c) => c.id === word.category)?.name}
                  </p>
                )}
              </div>
              <SpeakerButton text={word.chinese} size="sm" />
            </div>
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No words found for &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
