// Build script: parses CC-CEDICT raw data into a compact JSON file
// Run once when CC-CEDICT data is updated.
// Input:  cedict-raw.js (downloaded from edvardsr/cc-cedict)
// Output: public/cedict.json
//
// Output format (compact array of arrays for size):
//   [simplified, pinyinDiacritics, englishDefinition, pinyinNorm]
//
// pinyinNorm = lowercase, no spaces, no diacritics — used for fuzzy search

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TONE_MAP = {
  a: ['a', 'ā', 'á', 'ǎ', 'à', 'a'],
  e: ['e', 'ē', 'é', 'ě', 'è', 'e'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì', 'i'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò', 'o'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù', 'u'],
  // ü is written as 'u:' in cc-cedict, but the data here uses 'u' with context.
  // For 'lu:3' or 'nu:3' style we handle below.
};

// Convert one pinyin syllable like "zhong1" or "nu:3" to diacritic form
function syllableToDiacritic(syl) {
  const m = syl.match(/^([a-zA-Zü:]+?)([1-5])$/);
  if (!m) return syl; // no tone, return as-is
  let [, base, toneStr] = m;
  const tone = parseInt(toneStr, 10);
  if (tone === 5) return base.replace(/u:/g, 'ü');
  // Replace u: with ü first
  base = base.replace(/u:/g, 'ü');
  // Decide which vowel gets the diacritic: a > e > o > i > u (standard rule)
  // For 'iu' the tone goes on u; for 'ui' it goes on i (last vowel rule for these pairs)
  let target = -1;
  const lower = base.toLowerCase();
  if (lower.includes('a')) target = lower.indexOf('a');
  else if (lower.includes('e')) target = lower.indexOf('e');
  else if (lower.includes('ou')) target = lower.indexOf('o');
  else {
    // last vowel
    for (let i = base.length - 1; i >= 0; i--) {
      if ('aeiouü'.includes(base[i].toLowerCase())) { target = i; break; }
    }
  }
  if (target < 0) return base;
  const vowel = base[target].toLowerCase();
  const isUpper = base[target] === base[target].toUpperCase() && base[target] !== base[target].toLowerCase();
  let replaced;
  if (vowel === 'ü') {
    const map = ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'];
    replaced = map[tone];
  } else {
    const map = TONE_MAP[vowel];
    if (!map) return base;
    replaced = map[tone];
  }
  if (isUpper) replaced = replaced.toUpperCase();
  return base.slice(0, target) + replaced + base.slice(target + 1);
}

function pinyinToDiacritic(pinyinNumeric) {
  return pinyinNumeric.split(/\s+/).map(syllableToDiacritic).join(' ');
}

function pinyinNorm(pinyinNumeric) {
  return pinyinNumeric.toLowerCase().replace(/[1-5]/g, '').replace(/u:/g, 'u').replace(/\s+/g, '');
}

function isVariantOnly(englishField) {
  const arr = Array.isArray(englishField) ? englishField : [englishField];
  // Skip if every definition is a "variant of" / "see X" pointer
  return arr.every((d) =>
    /^(variant of|old variant of|see |\(\w+\) variant of)/i.test(d.trim())
  );
}

function flattenEnglish(englishField) {
  const arr = Array.isArray(englishField) ? englishField : [englishField];
  return arr.join('; ').replace(/\s+/g, ' ').trim();
}

async function main() {
  const rawPath = path.join(ROOT, 'cedict-raw.js');
  console.log('Reading', rawPath);
  let raw = await fs.readFile(rawPath, 'utf8');
  // Strip "export default " prefix to get pure JSON object
  raw = raw.replace(/^export default\s*/, '').trim();
  // Trim trailing semicolon if present
  raw = raw.replace(/;$/, '');

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to JSON.parse cedict-raw.js. First 200 chars:', raw.slice(0, 200));
    throw err;
  }

  const all = data.all;
  if (!Array.isArray(all)) throw new Error('Expected data.all to be an array');
  console.log(`Source entries: ${all.length}`);

  const seen = new Set();
  const out = [];
  let skippedVariants = 0;
  let skippedDupes = 0;

  for (const entry of all) {
    const [, simplified, pinyinNum, englishField] = entry;
    if (!simplified || !pinyinNum) continue;
    if (isVariantOnly(englishField)) { skippedVariants++; continue; }
    const key = simplified + '|' + pinyinNum;
    if (seen.has(key)) { skippedDupes++; continue; }
    seen.add(key);
    const pinyin = pinyinToDiacritic(pinyinNum);
    const english = flattenEnglish(englishField);
    const norm = pinyinNorm(pinyinNum);
    out.push([simplified, pinyin, english, norm]);
  }

  console.log(`Kept: ${out.length}, skipped variants: ${skippedVariants}, skipped dupes: ${skippedDupes}`);

  const outPath = path.join(ROOT, 'public', 'cedict.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(out));
  const stat = await fs.stat(outPath);
  console.log(`Wrote ${outPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
