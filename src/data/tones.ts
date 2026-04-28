export interface ToneDrillWord {
  character: string;
  pinyin: string;       // with tone mark
  english: string;
  tone: 1 | 2 | 3 | 4 | 5; // 5 = neutral
}

export const TONE_NAMES: Record<number, string> = {
  1: '1st — High Flat',
  2: '2nd — Rising',
  3: '3rd — Low Dip',
  4: '4th — Falling',
  5: 'Neutral',
};

export const TONE_COLORS: Record<number, string> = {
  1: 'text-blue-500 bg-blue-500/10',
  2: 'text-green-500 bg-green-500/10',
  3: 'text-orange-500 bg-orange-500/10',
  4: 'text-red-500 bg-red-500/10',
  5: 'text-muted bg-card',
};

export const TONE_BORDER_COLORS: Record<number, string> = {
  1: 'border-blue-500',
  2: 'border-green-500',
  3: 'border-orange-500',
  4: 'border-red-500',
  5: 'border-muted',
};

// 8 words per tone for drill variety
export const drillWords: ToneDrillWord[] = [
  // Tone 1 — high flat (ˉ)
  { character: '妈', pinyin: 'mā', english: 'mother', tone: 1 },
  { character: '书', pinyin: 'shū', english: 'book', tone: 1 },
  { character: '天', pinyin: 'tiān', english: 'sky/day', tone: 1 },
  { character: '飞', pinyin: 'fēi', english: 'fly', tone: 1 },
  { character: '家', pinyin: 'jiā', english: 'home', tone: 1 },
  { character: '多', pinyin: 'duō', english: 'many', tone: 1 },
  { character: '花', pinyin: 'huā', english: 'flower', tone: 1 },
  { character: '中', pinyin: 'zhōng', english: 'middle', tone: 1 },

  // Tone 2 — rising (ˊ)
  { character: '麻', pinyin: 'má', english: 'hemp/numb', tone: 2 },
  { character: '来', pinyin: 'lái', english: 'come', tone: 2 },
  { character: '年', pinyin: 'nián', english: 'year', tone: 2 },
  { character: '人', pinyin: 'rén', english: 'person', tone: 2 },
  { character: '国', pinyin: 'guó', english: 'country', tone: 2 },
  { character: '学', pinyin: 'xué', english: 'study', tone: 2 },
  { character: '谁', pinyin: 'shéi', english: 'who', tone: 2 },
  { character: '茶', pinyin: 'chá', english: 'tea', tone: 2 },

  // Tone 3 — low dip (ˇ)
  { character: '马', pinyin: 'mǎ', english: 'horse', tone: 3 },
  { character: '你', pinyin: 'nǐ', english: 'you', tone: 3 },
  { character: '我', pinyin: 'wǒ', english: 'I/me', tone: 3 },
  { character: '好', pinyin: 'hǎo', english: 'good', tone: 3 },
  { character: '买', pinyin: 'mǎi', english: 'buy', tone: 3 },
  { character: '水', pinyin: 'shuǐ', english: 'water', tone: 3 },
  { character: '走', pinyin: 'zǒu', english: 'walk', tone: 3 },
  { character: '可', pinyin: 'kě', english: 'can', tone: 3 },

  // Tone 4 — falling (ˋ)
  { character: '骂', pinyin: 'mà', english: 'scold', tone: 4 },
  { character: '是', pinyin: 'shì', english: 'is/am/are', tone: 4 },
  { character: '大', pinyin: 'dà', english: 'big', tone: 4 },
  { character: '去', pinyin: 'qù', english: 'go', tone: 4 },
  { character: '谢', pinyin: 'xiè', english: 'thank', tone: 4 },
  { character: '不', pinyin: 'bù', english: 'not', tone: 4 },
  { character: '对', pinyin: 'duì', english: 'correct', tone: 4 },
  { character: '意', pinyin: 'yì', english: 'meaning', tone: 4 },

  // Neutral tone
  { character: '吗', pinyin: 'ma', english: 'question particle', tone: 5 },
  { character: '呢', pinyin: 'ne', english: 'and you? particle', tone: 5 },
  { character: '吧', pinyin: 'ba', english: 'suggestion particle', tone: 5 },
  { character: '了', pinyin: 'le', english: 'completion particle', tone: 5 },
];

export const TONE_CONTOURS = {
  1: 'M 10,20 L 90,20',
  2: 'M 10,40 L 90,10',
  3: 'M 10,30 Q 50,55 90,20',
  4: 'M 10,10 L 90,45',
  5: 'M 10,35 L 90,35',
} as const;

export const TONE_DESCRIPTIONS: Record<number, string> = {
  1: 'Stay HIGH and FLAT — like holding a steady note. Voice stays up throughout.',
  2: 'RISE from mid to high — like asking "really?" in English. Goes UP.',
  3: 'DIP LOW then rise slightly — like a doubtful "hmm?" but longer. Goes DOWN then up.',
  4: 'FALL sharply from high — like a firm "stop!" in English. Goes DOWN hard.',
  5: 'NEUTRAL and SHORT — unstressed, attached to the previous syllable.',
};
