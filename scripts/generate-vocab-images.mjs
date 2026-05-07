#!/usr/bin/env node
/**
 * Generate vocab flashcard images via Nano Banana 2.
 *
 * Usage:
 *   node scripts/generate-vocab-images.mjs --sample 5
 *   node scripts/generate-vocab-images.mjs --theme food
 *   node scripts/generate-vocab-images.mjs --level 1
 *   node scripts/generate-vocab-images.mjs            # all imageable words
 *   node scripts/generate-vocab-images.mjs --force    # re-generate existing
 *
 * Idempotent — skips words whose image already exists unless --force.
 * Runs N=4 parallel python jobs.
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, access, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { register } from 'node:module';

// Use tsx via subshell? Simpler: parse the HSK ts files by regex.
// Actually we re-implement classification here in JS to avoid TS runtime.

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const outDir = join(projectRoot, 'public', 'images', 'vocab');
const skillDir = 'C:\\Users\\seang\\.claude\\skills\\image';
const pyScript = join(skillDir, 'scripts', 'generate_kie.py');

const args = process.argv.slice(2);
const flags = {
  sample: argInt('--sample'),
  theme: argStr('--theme'),
  level: argInt('--level'),
  force: args.includes('--force'),
  concurrency: argInt('--concurrency') ?? 4,
};

function argStr(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}
function argInt(name) {
  const v = argStr(name);
  return v == null ? null : parseInt(v, 10);
}

// --- Mirror of src/lib/vocab-images.ts classifier ---
const IMAGEABLE_POS = new Set(['noun', 'verb', 'adj', 'adjective', 'num', 'numeral']);
const DENYLIST = new Set([
  '是','有','在','会','能','可以','要','想','觉得','认识','知道','懂','让','叫','姓',
  '请','没','别','可能','应该','需要','希望','介意','记得','记','忘','忘记','决定',
  '认为','相信','喜欢','关','开','为','被','把','比','和','跟','对','从','向','到',
  '点','岁','块','号','元','次','事','事情','问题','原因','办法','方法','意思',
  '名字','工作','生活','历史','文化','世界','社会','机会','关系','想法','感觉',
  '自己','别人','大家','位','种','些','什么','哪',
]);
const THEME_KEYWORDS = [
  ['family', /\b(father|mother|dad|mom|mum|brother|sister|son|daughter|grandfather|grandmother|husband|wife|child|baby|aunt|uncle|cousin|nephew|niece|family|parent|grandpa|grandma)\b/i],
  ['people', /\b(person|people|man|woman|boy|girl|child(ren)?|friend|teacher|student|doctor|nurse|driver|worker|colleague|classmate|guest|customer|police|stranger|him|her|self)\b/i],
  ['body', /\b(hand|foot|leg|arm|head|hair|eye|nose|mouth|ear|tooth|teeth|face|body|finger|stomach|heart|skin|throat|shoulder|knee|back|chest|neck)\b/i],
  ['animals', /\b(dog|cat|bird|fish|horse|cow|pig|sheep|chicken|duck|rabbit|tiger|lion|monkey|elephant|bear|panda|mouse|rat|snake|insect|animal|pet)\b/i],
  ['food', /\b(rice|noodle|bread|meat|beef|pork|fish|chicken|fruit|apple|banana|orange|watermelon|grape|vegetable|egg|milk|tea|coffee|water|wine|beer|juice|soup|cake|sugar|salt|food|meal|breakfast|lunch|dinner|drink|eat|cook|chopsticks|spoon|fork|knife|bowl|cup|plate|dish|hot pot|dumpling|tofu|cheese|sandwich|pizza|hamburger|snack|candy|chocolate|honey|pepper|sauce)\b/i],
  ['places', /\b(house|home|room|kitchen|bathroom|bedroom|school|classroom|library|hospital|store|shop|market|supermarket|restaurant|hotel|bank|park|garden|station|airport|street|road|city|town|country|countryside|mountain|river|sea|ocean|lake|beach|forest|building|office|company|factory|farm|temple|church|theater|cinema|museum|zoo|gym|stadium|toilet|elevator|stairs|door|window|wall|floor|ceiling|roof|bridge)\b/i],
  ['nature', /\b(tree|flower|grass|leaf|sun|moon|star|sky|cloud|rain|snow|wind|fire|water|earth|stone|rock|sand|mountain|river|sea|forest|weather|sunny|cloudy|rainy|snowy|windy|hot|cold|warm|cool|spring|summer|autumn|fall|winter)\b/i],
  ['time', /\b(year|month|week|day|hour|minute|second|today|tomorrow|yesterday|morning|afternoon|evening|night|noon|midnight|now|moment|time|date|clock|calendar|weekend|holiday|birthday|past|future|present)\b/i],
  ['numbers', /^(zero|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|first|second|third|number)\b/i],
  ['objects', /\b(book|pen|pencil|paper|bag|chair|table|desk|bed|computer|phone|car|bike|bicycle|bus|train|plane|boat|ship|key|watch|clock|umbrella|map|ticket|money|wallet|clothes|shirt|pants|shoes|hat|glasses|camera|tv|television|radio|newspaper|magazine|letter|email|gift|present|toy|ball|tool|machine|light|lamp|fan|mirror|towel|soap|brush|comb|knife|cup|glass|bottle|box|basket|bag|luggage|suitcase)\b/i],
];

function classify(en, pos, simplified) {
  if (DENYLIST.has(simplified)) return null;
  if (!IMAGEABLE_POS.has(pos)) return null;
  if (pos === 'num' || pos === 'numeral') return 'numbers';
  for (const [theme, rx] of THEME_KEYWORDS) if (rx.test(en)) return theme;
  if (pos === 'verb') return 'actions';
  if (pos === 'adj' || pos === 'adjective') return 'descriptors';
  if (pos === 'noun') return 'objects';
  return null;
}

// --- Parse HSK ts files (regex over the source — simple + no TS runtime) ---
async function loadHskWords() {
  const fs = await import('node:fs/promises');
  const files = [
    { path: join(projectRoot, 'src/data/hsk/hsk1.ts'), level: 1 },
    { path: join(projectRoot, 'src/data/hsk/hsk2.ts'), level: 2 },
    { path: join(projectRoot, 'src/data/hsk/hsk3.ts'), level: 3 },
  ];
  const out = [];
  for (const { path, level } of files) {
    const src = await fs.readFile(path, 'utf8');
    // Match each entry { id: '...', simplified: '...', pinyin: '...', english: '...', ... partOfSpeech: '...' ... }
    const rx = /\{\s*id:\s*'([^']+)',\s*simplified:\s*'([^']+)',\s*pinyin:\s*'([^']+)',\s*english:\s*'([^']+)',[\s\S]*?partOfSpeech:\s*'([^']+)'/g;
    let m;
    while ((m = rx.exec(src)) !== null) {
      const [, id, simplified, pinyin, english, pos] = m;
      out.push({ id, simplified, pinyin, english, partOfSpeech: pos, level });
    }
  }
  return out;
}

function buildPrompt(word) {
  const subject = `"${word.english}" (Mandarin: ${word.simplified})`;
  return {
    prompt: `A clean, modern flat-illustration of ${subject}, designed as a single educational vocabulary card. Centered subject, generous whitespace, soft pastel-and-warm color palette with a few bold accent colors, smooth vector shapes, gentle organic lines, subtle grain texture for warmth. The illustration must be visually unambiguous — a beginner-language student should immediately recognize the meaning without any caption. Single subject only, no decorative clutter, no text, no letters, no numbers, no captions, no logos, no watermarks, no signatures. Background is a flat off-white #FAFAF7 with a soft circular shadow under the subject for grounding. Style consistent with a friendly children's-textbook illustrator. Square 1:1 composition, balanced negative space.`,
    negative_prompt: 'text, letters, alphabet, words, captions, labels, numbers, watermark, signature, logo, photorealistic, 3D render, photograph, blurry, low resolution, multiple subjects, cluttered composition, dark mood, harsh shadows',
    api_parameters: {
      resolution: '1K',
      output_format: 'jpg',
      aspect_ratio: '1:1',
    },
    settings: {
      style: 'flat vector illustration, modern editorial, friendly textbook',
      lighting: 'soft even ambient, gentle drop shadow',
      composition: 'centered single subject, generous negative space',
      palette: 'warm pastel base with bold accent color, off-white background',
    },
  };
}

function runOne(word) {
  return new Promise(async (resolveP) => {
    const promptObj = buildPrompt(word);
    const promptPath = join(tmpdir(), `vocab-${word.id}-${Date.now()}.json`);
    await writeFile(promptPath, JSON.stringify(promptObj));
    const outPath = join(outDir, `${word.id}.jpg`);

    const proc = spawn('python', [pyScript, promptPath, outPath, '1:1'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stderr = '';
    proc.stdout.on('data', () => {}); // suppress
    proc.stderr.on('data', (d) => (stderr += d.toString()));
    proc.on('close', async (code) => {
      try { await rm(promptPath); } catch {}
      if (code === 0 && existsSync(outPath)) {
        console.log(`  ok  ${word.id}  ${word.simplified}  ${word.english}`);
        resolveP({ ok: true, word });
      } else {
        console.error(`  FAIL ${word.id}  ${word.simplified}  ${word.english}\n${stderr.slice(0, 400)}`);
        resolveP({ ok: false, word, stderr });
      }
    });
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const all = await loadHskWords();
  console.log(`Loaded ${all.length} HSK 1-3 words.`);

  let pool = all
    .map((w) => ({ ...w, theme: classify(w.english, w.partOfSpeech, w.simplified) }))
    .filter((w) => w.theme);

  console.log(`Imageable after filter: ${pool.length}`);

  if (flags.theme) pool = pool.filter((w) => w.theme === flags.theme);
  if (flags.level) pool = pool.filter((w) => w.level === flags.level);

  if (!flags.force) {
    pool = pool.filter((w) => !existsSync(join(outDir, `${w.id}.jpg`)));
  }

  if (flags.sample) pool = pool.slice(0, flags.sample);

  console.log(`Will generate ${pool.length} images (concurrency=${flags.concurrency}).`);
  if (pool.length === 0) return;

  const queue = [...pool];
  let done = 0;
  let failed = 0;

  async function worker() {
    while (queue.length) {
      const w = queue.shift();
      if (!w) break;
      const r = await runOne(w);
      done++;
      if (!r.ok) failed++;
      if (done % 10 === 0 || done === pool.length) {
        console.log(`Progress: ${done}/${pool.length}  (failed=${failed})`);
      }
    }
  }
  await Promise.all(Array.from({ length: flags.concurrency }, worker));
  console.log(`Done. ${pool.length - failed}/${pool.length} succeeded.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
