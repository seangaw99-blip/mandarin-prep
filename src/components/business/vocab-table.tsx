'use client';

import SpeakerButton from '@/components/ui/speaker-button';

interface Term {
  chinese: string;
  pinyin: string;
  english: string;
  category: string;
}

interface VocabTableProps {
  terms: Term[];
}

export default function VocabTable({ terms }: VocabTableProps) {
  const grouped = terms.reduce<Record<string, Term[]>>((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = [];
    }
    acc[term.category].push(term);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, categoryTerms]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="bg-card rounded-xl overflow-hidden divide-y divide-border">
            {categoryTerms.map((term, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-chinese font-semibold text-card-foreground">
                    {term.chinese}
                  </p>
                  <p className="text-sm text-muted">{term.pinyin}</p>
                  <p className="text-sm text-foreground">{term.english}</p>
                </div>
                <SpeakerButton text={term.chinese} size="sm" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
