// Lazy loader and search helpers for the CC-CEDICT dataset (~118k entries).
// Data is fetched once from /cedict.json and cached in memory.
// File format (per entry): [simplified, pinyin, english, pinyinNorm]

export interface CedictEntry {
  simplified: string;
  pinyin: string;
  english: string;
  pinyinNorm: string;
}

type CedictRaw = [string, string, string, string][];

let _entries: CedictEntry[] | null = null;
let _loadPromise: Promise<CedictEntry[]> | null = null;

export function isLoaded(): boolean {
  return _entries !== null;
}

export async function loadCedict(): Promise<CedictEntry[]> {
  if (_entries) return _entries;
  if (_loadPromise) return _loadPromise;
  _loadPromise = (async () => {
    const res = await fetch('/cedict.json');
    if (!res.ok) throw new Error(`Failed to fetch cedict.json: ${res.status}`);
    const raw = (await res.json()) as CedictRaw;
    _entries = raw.map(([simplified, pinyin, english, pinyinNorm]) => ({
      simplified, pinyin, english, pinyinNorm,
    }));
    return _entries;
  })();
  return _loadPromise;
}

function isChineseChar(s: string): boolean {
  return /[一-鿿㐀-䶿]/.test(s);
}

function hasPinyinDiacritic(s: string): boolean {
  return /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(s);
}

function normPinyin(py: string): string {
  return py
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/v/g, 'u')
    .replace(/\s+/g, '');
}

export function searchCedict(query: string, limit = 50): CedictEntry[] {
  if (!_entries) return [];
  const q = query.trim();
  if (!q) return [];

  const results: CedictEntry[] = [];
  const seen = new Set<string>();

  const push = (e: CedictEntry) => {
    const k = e.simplified + '|' + e.pinyin;
    if (!seen.has(k)) { seen.add(k); results.push(e); }
  };

  if (isChineseChar(q)) {
    for (const e of _entries) {
      if (e.simplified === q) push(e);
      if (results.length >= limit) break;
    }
    if (results.length < limit) {
      for (const e of _entries) {
        if (e.simplified !== q && e.simplified.includes(q)) push(e);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  const ql = q.toLowerCase();
  const norm = normPinyin(q);

  if (hasPinyinDiacritic(q)) {
    // Tone marks present — pinyin only
    for (const e of _entries) {
      if (e.pinyinNorm === norm) push(e);
      if (results.length >= limit) break;
    }
    if (results.length < limit) {
      for (const e of _entries) {
        if (e.pinyinNorm !== norm && e.pinyinNorm.startsWith(norm)) push(e);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  // Plain ASCII — try English first, then pinyin
  // ("hello" → 你好 via English; "nihao" → 你好 via pinyin)
  for (const e of _entries) {
    if (e.english.toLowerCase().startsWith(ql)) push(e);
    if (results.length >= limit) break;
  }
  if (results.length < limit) {
    for (const e of _entries) {
      if (!e.english.toLowerCase().startsWith(ql) && e.english.toLowerCase().includes(ql)) push(e);
      if (results.length >= limit) break;
    }
  }
  if (results.length < limit && norm) {
    for (const e of _entries) {
      if (e.pinyinNorm === norm) push(e);
      if (results.length >= limit) break;
    }
    for (const e of _entries) {
      if (e.pinyinNorm !== norm && e.pinyinNorm.startsWith(norm)) push(e);
      if (results.length >= limit) break;
    }
  }

  return results;
}
