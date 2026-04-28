import type { DictEntry } from './db';
import { hsk1Words } from '@/data/hsk/hsk1';
import { hsk2Words } from '@/data/hsk/hsk2';
import { hsk3Words } from '@/data/hsk/hsk3';
import { businessTerms } from '@/data/business-vocab';
import { vocabWords } from '@/data/vocabulary';

// Strip tone diacritics and spaces for fuzzy pinyin search
function normPinyin(py: string): string {
  return py
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip tone diacritics
    .replace(/v/g, 'u')              // handle ü alias
    .replace(/\s+/g, '');
}

function hskToDictEntry(w: (typeof hsk1Words)[number]): DictEntry {
  return {
    id: w.id,
    simplified: w.simplified,
    pinyin: w.pinyin,
    pinyinNorm: normPinyin(w.pinyin),
    english: w.english,
    allDefinitions: [w.english],
    level: w.level,
    partOfSpeech: w.partOfSpeech,
    exampleSentence: w.exampleSentence,
    examplePinyin: w.examplePinyin,
    exampleEnglish: w.exampleEnglish,
    source: 'hsk',
  };
}

function buildAllEntries(): DictEntry[] {
  const seen = new Set<string>();
  const entries: DictEntry[] = [];

  const add = (e: DictEntry) => {
    if (!seen.has(e.simplified)) {
      seen.add(e.simplified);
      entries.push(e);
    }
  };

  // HSK words first (highest quality data)
  [...hsk1Words, ...hsk2Words, ...hsk3Words].forEach((w) => add(hskToDictEntry(w)));

  // Business / packaging vocab
  businessTerms.forEach((t) => {
    add({
      id: t.id,
      simplified: t.chinese,
      pinyin: t.pinyin,
      pinyinNorm: normPinyin(t.pinyin),
      english: t.english,
      allDefinitions: [t.english],
      level: null,
      partOfSpeech: 'noun',
      source: 'business',
    });
  });

  // General vocabulary supplement
  vocabWords.forEach((v) => {
    add({
      id: `vocab-${v.id}`,
      simplified: v.chinese,
      pinyin: v.pinyin,
      pinyinNorm: normPinyin(v.pinyin),
      english: v.english,
      allDefinitions: [v.english],
      level: null,
      partOfSpeech: 'noun',
      source: 'cedict',
    });
  });

  return entries;
}

// Lazy-initialized in-memory indexes
let _entries: DictEntry[] | null = null;
let _charIndex: Map<string, DictEntry[]> | null = null;
let _pinyinIndex: Map<string, DictEntry[]> | null = null;

function getEntries(): DictEntry[] {
  if (!_entries) _entries = buildAllEntries();
  return _entries;
}

function getCharIndex(): Map<string, DictEntry[]> {
  if (!_charIndex) {
    _charIndex = new Map();
    for (const entry of getEntries()) {
      for (const char of entry.simplified) {
        const list = _charIndex.get(char) ?? [];
        list.push(entry);
        _charIndex.set(char, list);
      }
    }
  }
  return _charIndex;
}

function getPinyinIndex(): Map<string, DictEntry[]> {
  if (!_pinyinIndex) {
    _pinyinIndex = new Map();
    for (const entry of getEntries()) {
      const key = entry.pinyinNorm;
      const list = _pinyinIndex.get(key) ?? [];
      list.push(entry);
      _pinyinIndex.set(key, list);
    }
  }
  return _pinyinIndex;
}

function isChineseChar(s: string): boolean {
  return /[一-鿿㐀-䶿]/.test(s);
}

function isPinyinInput(s: string): boolean {
  return /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s]+$/i.test(s.trim());
}

export function search(query: string, limit = 30): DictEntry[] {
  const q = query.trim();
  if (!q) return [];

  const entries = getEntries();
  const results = new Map<string, DictEntry>();

  if (isChineseChar(q)) {
    // Chinese input: exact match first, then contains
    for (const e of entries) {
      if (e.simplified === q) results.set(e.id, e);
    }
    for (const e of entries) {
      if (!results.has(e.id) && e.simplified.includes(q)) results.set(e.id, e);
    }
    const idx = getCharIndex();
    for (const char of q) {
      for (const e of idx.get(char) ?? []) {
        if (!results.has(e.id)) results.set(e.id, e);
      }
    }
  } else if (isPinyinInput(q)) {
    // Pinyin input: normalize and search
    const norm = normPinyin(q);
    const idx = getPinyinIndex();
    for (const e of idx.get(norm) ?? []) results.set(e.id, e);
    for (const [key, list] of idx) {
      if (key !== norm && key.startsWith(norm)) {
        for (const e of list) if (!results.has(e.id)) results.set(e.id, e);
      }
    }
    for (const [key, list] of idx) {
      if (!key.startsWith(norm) && key.includes(norm)) {
        for (const e of list) if (!results.has(e.id)) results.set(e.id, e);
      }
    }
  } else {
    // English input
    const ql = q.toLowerCase();
    for (const e of entries) {
      if (e.english.toLowerCase().startsWith(ql)) results.set(e.id, e);
    }
    for (const e of entries) {
      if (!results.has(e.id) && e.english.toLowerCase().includes(ql)) results.set(e.id, e);
    }
    for (const e of entries) {
      if (!results.has(e.id) && e.allDefinitions.some((d) => d.toLowerCase().includes(ql))) {
        results.set(e.id, e);
      }
    }
  }

  return Array.from(results.values()).slice(0, limit);
}

export function lookupById(id: string): DictEntry | undefined {
  return getEntries().find((e) => e.id === id);
}

export function getAllEntries(): DictEntry[] {
  return getEntries();
}

export function getLevelEntries(level: number): DictEntry[] {
  return getEntries().filter((e) => e.level === level);
}

export { normPinyin };
