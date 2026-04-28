'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { speakChinese } from '@/lib/audio';
import { grammarPatterns as generatedPatterns, type GrammarPattern } from '@/data/patterns/patterns';

const STUB_PATTERNS: GrammarPattern[] = [
  {
    id: 'gp-001',
    pattern: 'Subject + 是 + Object',
    structure: '是-sentences (to be)',
    level: 1,
    explanation: 'The verb 是 (shì) connects nouns/pronouns like "to be" in English. Used for identity and classification — NOT for adjectives.',
    examples: [
      { chinese: '我是老师。', pinyin: 'Wǒ shì lǎoshī.', english: 'I am a teacher.' },
      { chinese: '他是学生。', pinyin: 'Tā shì xuéshēng.', english: 'He is a student.' },
      { chinese: '这是我的书。', pinyin: 'Zhè shì wǒ de shū.', english: 'This is my book.' },
    ],
    drillPrompt: 'Say "She is a doctor" in Chinese',
  },
  {
    id: 'gp-002',
    pattern: 'Subject + 有 + Object',
    structure: '有-sentences (to have)',
    level: 1,
    explanation: '有 (yǒu) means "to have" or "there is/are". Negated with 没有 (méiyǒu), never 不有.',
    examples: [
      { chinese: '我有一个苹果。', pinyin: 'Wǒ yǒu yī gè píngguǒ.', english: 'I have an apple.' },
      { chinese: '她没有时间。', pinyin: 'Tā méiyǒu shíjiān.', english: 'She doesn\'t have time.' },
      { chinese: '这里有很多人。', pinyin: 'Zhèlǐ yǒu hěn duō rén.', english: 'There are many people here.' },
    ],
    drillPrompt: 'Say "I don\'t have money" in Chinese',
  },
  {
    id: 'gp-003',
    pattern: 'Subject + Adjective (with 很)',
    structure: 'Stative verbs with 很',
    level: 1,
    explanation: 'In Chinese, adjectives act as stative verbs — they don\'t need 是. Instead, add 很 (hěn, "very") before the adjective. Without 很, the sentence sounds comparative.',
    examples: [
      { chinese: '她很漂亮。', pinyin: 'Tā hěn piàoliang.', english: 'She is (very) beautiful.' },
      { chinese: '天气很热。', pinyin: 'Tiānqì hěn rè.', english: 'The weather is (very) hot.' },
      { chinese: '这个苹果很甜。', pinyin: 'Zhège píngguǒ hěn tián.', english: 'This apple is (very) sweet.' },
    ],
    drillPrompt: 'Say "This coffee is very good" in Chinese',
  },
  {
    id: 'gp-004',
    pattern: 'Statement + 吗？',
    structure: 'Yes/No questions with 吗',
    level: 1,
    explanation: 'Add the particle 吗 (ma) to the end of any statement to turn it into a yes/no question. No word order change needed — unlike English.',
    examples: [
      { chinese: '你是老师吗？', pinyin: 'Nǐ shì lǎoshī ma?', english: 'Are you a teacher?' },
      { chinese: '他们去北京吗？', pinyin: 'Tāmen qù Běijīng ma?', english: 'Are they going to Beijing?' },
      { chinese: '你有时间吗？', pinyin: 'Nǐ yǒu shíjiān ma?', english: 'Do you have time?' },
    ],
    drillPrompt: 'Turn "You like coffee" into a question',
  },
  {
    id: 'gp-005',
    pattern: 'A + 比 + B + Adjective',
    structure: 'Comparisons with 比',
    level: 2,
    explanation: '比 (bǐ) means "compared to" or "than". A 比 B + adj says A is more [adj] than B. To say "much more", add 多了 at the end.',
    examples: [
      { chinese: '苹果比香蕉甜。', pinyin: 'Píngguǒ bǐ xiāngjiāo tián.', english: 'Apples are sweeter than bananas.' },
      { chinese: '今天比昨天热。', pinyin: 'Jīntiān bǐ zuótiān rè.', english: 'Today is hotter than yesterday.' },
      { chinese: '他比我高多了。', pinyin: 'Tā bǐ wǒ gāo duō le.', english: 'He is much taller than me.' },
    ],
    drillPrompt: 'Say "Chinese is harder than English" using 比',
  },
];

const LEVEL_LABELS = { 1: 'HSK 1', 2: 'HSK 2', 3: 'HSK 3' };
const LEVEL_COLORS = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-yellow-100 text-yellow-700',
};

function PatternCard({ pattern }: { pattern: GrammarPattern }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[pattern.level]}`}>
              {LEVEL_LABELS[pattern.level]}
            </span>
          </div>
          <p className="font-semibold text-sm">{pattern.structure}</p>
          <code className="text-xs text-muted font-mono mt-0.5 block">{pattern.pattern}</code>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted mt-1 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted mt-1 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 animate-fadeIn space-y-4">
          <p className="text-sm text-foreground pt-3">{pattern.explanation}</p>

          <div className="space-y-2">
            {pattern.examples.map((ex, i) => (
              <div key={i} className="rounded-xl bg-background p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-chinese text-lg font-semibold">{ex.chinese}</p>
                  <button
                    onClick={() => speakChinese(ex.chinese)}
                    className="shrink-0 text-muted hover:text-primary"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted mt-0.5">{ex.pinyin}</p>
                <p className="text-xs mt-0.5">{ex.english}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs font-semibold text-primary mb-1">Try it</p>
            <p className="text-sm">{pattern.drillPrompt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrammarPage() {
  const router = useRouter();
  const [levelFilter, setLevelFilter] = useState<number | null>(null);

  const patterns: GrammarPattern[] = generatedPatterns.length > 0 ? generatedPatterns : STUB_PATTERNS;

  const filtered = levelFilter !== null
    ? patterns.filter((p) => p.level === levelFilter)
    : patterns;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Grammar Patterns</h1>
          <p className="text-xs text-muted">{patterns.length} patterns · HSK 1–3</p>
        </div>
      </div>

      {/* Level filter */}
      <div className="px-4 pt-4 pb-2">
        <div className="mx-auto max-w-lg flex gap-2">
          {[null, 1, 2, 3].map((l) => (
            <button
              key={l ?? 'all'}
              onClick={() => setLevelFilter(l)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                levelFilter === l ? 'bg-primary text-white' : 'bg-card text-muted'
              }`}
            >
              {l === null ? 'All' : `HSK ${l}`}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-2 space-y-3 pb-8">
        {filtered.map((p) => <PatternCard key={p.id} pattern={p} />)}
        {patterns === STUB_PATTERNS && (
          <p className="text-xs text-center text-muted pt-2">
            Full pattern library (50 patterns) generates on next build
          </p>
        )}
      </div>
    </div>
  );
}
