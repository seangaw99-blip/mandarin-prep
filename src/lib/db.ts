import Dexie, { type EntityTable } from 'dexie';

export interface DictEntry {
  id: string;
  simplified: string;
  pinyin: string;
  pinyinNorm: string;    // no tones, no spaces, lowercase — for search
  english: string;
  allDefinitions: string[];
  level: number | null;  // HSK level 1-6, null if not HSK
  partOfSpeech: string;
  exampleSentence?: string;
  examplePinyin?: string;
  exampleEnglish?: string;
  source: 'hsk' | 'cedict' | 'business' | 'user';
}

export interface SrsCard {
  id: string;             // "{deckId}:{wordId}:{cardType}"
  deckId: string;
  wordId: string;
  cardType: 'zh2en' | 'en2zh';
  due: number;            // ms timestamp
  interval: number;       // days (0 = new/learning)
  easeFactor: number;     // 2.5 default
  repetitions: number;
  lapses: number;
  queue: 'new' | 'learning' | 'review';
  learningStep: number;   // index into LEARNING_STEPS
}

export interface SavedWord {
  wordId: string;
  savedAt: number;
  note?: string;
}

export interface SearchHistoryEntry {
  query: string;
  searchedAt: number;
}

export interface StudySession {
  id?: number;
  date: string;           // YYYY-MM-DD
  cardsReviewed: number;
  correct: number;
  durationSecs: number;
  decks: string[];
}

type MandarinDB = Dexie & {
  dictEntries: EntityTable<DictEntry, 'id'>;
  srsCards: EntityTable<SrsCard, 'id'>;
  savedWords: EntityTable<SavedWord, 'wordId'>;
  searchHistory: EntityTable<SearchHistoryEntry, 'query'>;
  studySessions: EntityTable<StudySession, 'id'>;
};

const db = new Dexie('mandarinHeroDB') as MandarinDB;

db.version(1).stores({
  dictEntries:    'id, simplified, pinyinNorm, level, source',
  srsCards:       'id, deckId, due, queue, wordId',
  savedWords:     'wordId, savedAt',
  searchHistory:  'query, searchedAt',
  studySessions:  '++id, date',
});

export { db };
