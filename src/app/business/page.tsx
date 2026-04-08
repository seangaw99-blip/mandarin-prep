'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import VocabTable from '@/components/business/vocab-table';
import SentenceCard from '@/components/business/sentence-card';
import { businessTerms, businessSentences } from '@/data/business-vocab';

const sentenceCategories = [
  'all',
  ...new Set(businessSentences.map((s) => s.category)),
];

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState<'vocab' | 'sentences'>('vocab');
  const [sentenceFilter, setSentenceFilter] = useState('all');

  const filteredSentences =
    sentenceFilter === 'all'
      ? businessSentences
      : businessSentences.filter((s) => s.category === sentenceFilter);

  return (
    <div className="min-h-screen">
      <Header title="Business Chinese" />
      <div className="mx-auto max-w-lg px-4 py-4">
        <p className="mb-4 text-sm text-muted">
          Packaging industry vocabulary and business phrases from your tutor&apos;s lessons.
        </p>

        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium ${
              activeTab === 'vocab'
                ? 'bg-primary text-white'
                : 'bg-card text-foreground'
            }`}
          >
            Vocabulary ({businessTerms.length})
          </button>
          <button
            onClick={() => setActiveTab('sentences')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium ${
              activeTab === 'sentences'
                ? 'bg-primary text-white'
                : 'bg-card text-foreground'
            }`}
          >
            Sentences ({businessSentences.length})
          </button>
        </div>

        {activeTab === 'vocab' ? (
          <VocabTable terms={businessTerms} />
        ) : (
          <>
            {/* Sentence category filter */}
            <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
              {sentenceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSentenceFilter(cat)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${
                    cat === sentenceFilter
                      ? 'bg-primary text-white'
                      : 'bg-card text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredSentences.map((sentence) => (
                <SentenceCard
                  key={sentence.id}
                  chinese={sentence.chinese}
                  pinyin={sentence.pinyin}
                  english={sentence.english}
                  context={sentence.context}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
