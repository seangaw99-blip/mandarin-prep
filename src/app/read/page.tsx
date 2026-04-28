'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, Volume2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { stories, type Story } from '@/data/stories';
import { speakChinese } from '@/lib/audio';

const LEVEL_META = {
  hsk1: { label: 'HSK 1', color: 'bg-green-100 text-green-700', badge: 'bg-green-500' },
  hsk2: { label: 'HSK 2', color: 'bg-blue-100 text-blue-700', badge: 'bg-blue-500' },
  hsk3: { label: 'HSK 3', color: 'bg-purple-100 text-purple-700', badge: 'bg-purple-500' },
};

function StoryReader({ story, onBack }: { story: Story; onBack: () => void }) {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());

  const meta = LEVEL_META[story.level];

  const toggleLineReveal = (i: number) => {
    setRevealedLines((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border sticky top-0 bg-background z-10">
        <button onClick={onBack} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-chinese text-base font-bold">{story.title}</h1>
          <p className="text-xs text-muted">{story.titlePinyin}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className={`rounded-lg p-2 text-xs font-medium transition-colors ${showPinyin ? 'bg-primary text-white' : 'bg-card text-muted'}`}
            title="Toggle pinyin"
          >
            pīn
          </button>
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`rounded-lg p-2 transition-colors ${showEnglish ? 'bg-secondary text-white' : 'bg-card text-muted'}`}
            title="Toggle English"
          >
            {showEnglish ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Story meta */}
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
            {meta.label}
          </span>
          <span className="text-xs text-muted">{story.topic}</span>
          <span className="text-xs text-muted ml-auto">{story.wordCount} words</span>
        </div>

        {/* Lines */}
        {story.lines.map((line, i) => (
          <div key={i} className="rounded-2xl bg-card p-4 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-chinese text-xl leading-relaxed">{line.chinese}</p>
              <button
                onClick={() => speakChinese(line.chinese)}
                className="rounded-full p-1.5 text-muted hover:text-primary shrink-0 mt-0.5"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            {showPinyin && (
              <p className="text-sm text-muted">{line.pinyin}</p>
            )}
            {showEnglish ? (
              <p className="text-sm text-foreground/80">{line.english}</p>
            ) : (
              <button
                onClick={() => toggleLineReveal(i)}
                className="text-xs text-primary/70 hover:text-primary"
              >
                {revealedLines.has(i) ? `↑ ${line.english}` : '▸ Show translation'}
              </button>
            )}
          </div>
        ))}

        {/* Read again CTA */}
        <button
          onClick={() => speakChinese(story.lines.map((l) => l.chinese).join(' '))}
          className="w-full rounded-xl bg-card py-3 text-sm font-medium flex items-center justify-center gap-2 text-muted"
        >
          <Volume2 className="h-4 w-4" />
          Play full story
        </button>
      </div>
    </div>
  );
}

export default function ReadPage() {
  const router = useRouter();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [levelFilter, setLevelFilter] = useState<Story['level'] | 'all'>('all');

  if (selectedStory) {
    return <StoryReader story={selectedStory} onBack={() => setSelectedStory(null)} />;
  }

  const filtered = levelFilter === 'all'
    ? stories
    : stories.filter((s) => s.level === levelFilter);

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Graded Reading</h1>
          <p className="text-xs text-muted">Comprehensible input at your level</p>
        </div>
      </div>

      {/* Level filter */}
      <div className="px-4 pt-4 pb-2">
        <div className="mx-auto max-w-lg flex gap-2">
          {(['all', 'hsk1', 'hsk2', 'hsk3'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                levelFilter === l ? 'bg-primary text-white' : 'bg-card text-muted'
              }`}
            >
              {l === 'all' ? 'All' : LEVEL_META[l].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-2 space-y-3 pb-8">
        {filtered.map((story) => {
          const meta = LEVEL_META[story.level];
          return (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="w-full flex items-center gap-4 rounded-2xl bg-card p-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className={`rounded-full ${meta.badge} p-3 shrink-0`}>
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-chinese font-semibold">{story.title}</p>
                  <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-muted">{story.topic} · {story.wordCount} words</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted shrink-0" />
            </button>
          );
        })}

        <p className="text-xs text-center text-muted pt-2">More stories coming with HSK 3–6</p>
      </div>
    </div>
  );
}
