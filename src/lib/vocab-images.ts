import type { HskWord } from '@/data/hsk/types';
import { hsk1Words } from '@/data/hsk/hsk1';
import { hsk2Words } from '@/data/hsk/hsk2';
import { hsk3Words } from '@/data/hsk/hsk3';
import { VOCAB_IMAGE_IDS } from '@/data/vocab-image-manifest';

export type Theme =
  | 'people'
  | 'family'
  | 'body'
  | 'animals'
  | 'food'
  | 'places'
  | 'objects'
  | 'nature'
  | 'time'
  | 'numbers'
  | 'actions'
  | 'descriptors';

export const THEME_LABEL: Record<Theme, string> = {
  people: 'People',
  family: 'Family',
  body: 'Body',
  animals: 'Animals',
  food: 'Food & Drink',
  places: 'Places',
  objects: 'Objects',
  nature: 'Nature',
  time: 'Time',
  numbers: 'Numbers',
  actions: 'Actions',
  descriptors: 'Descriptors',
};

export interface ImageableWord {
  id: string;
  hskLevel: 1 | 2 | 3;
  simplified: string;
  pinyin: string;
  english: string;
  partOfSpeech: string;
  theme: Theme;
  imagePath: string;
}

const IMAGEABLE_POS = new Set([
  'noun',
  'verb',
  'adj',
  'adjective',
  'num',
  'numeral',
]);

// Words whose POS qualifies but that don't picture meaningfully (copulas,
// abstract verbs, function-y nouns). Skip these from the picture deck.
const DENYLIST = new Set<string>([
  '是', '有', '在', '会', '能', '可以', '要', '想', '觉得', '认识', '知道',
  '懂', '让', '叫', '姓', '请', '没', '别', '可能', '应该', '需要', '希望',
  '介意', '记得', '记', '忘', '忘记', '决定', '认为', '相信', '喜欢',
  '关', '开', '为', '被', '把', '比', '和', '跟', '对', '从', '向', '到',
  '点', '岁', '块', '号', '元', '次',
  '事', '事情', '问题', '原因', '办法', '方法', '意思', '名字', '工作',
  '生活', '历史', '文化', '世界', '社会', '机会', '关系', '想法', '感觉',
  '自己', '别人', '大家', '位', '种', '些', '什么', '哪',
]);

const THEME_KEYWORDS: Array<[Theme, RegExp]> = [
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

function classify(word: HskWord): Theme | null {
  if (DENYLIST.has(word.simplified)) return null;
  if (!IMAGEABLE_POS.has(word.partOfSpeech)) return null;

  const pos = word.partOfSpeech;
  const en = word.english;

  if (pos === 'num' || pos === 'numeral') return 'numbers';

  for (const [theme, rx] of THEME_KEYWORDS) {
    if (rx.test(en)) return theme;
  }

  if (pos === 'verb') return 'actions';
  if (pos === 'adj' || pos === 'adjective') return 'descriptors';
  if (pos === 'noun') return 'objects';

  return null;
}

let cache: ImageableWord[] | null = null;

export function getImageableWords(): ImageableWord[] {
  if (cache) return cache;
  const all: Array<{ word: HskWord; level: 1 | 2 | 3 }> = [
    ...hsk1Words.map((w) => ({ word: w, level: 1 as const })),
    ...hsk2Words.map((w) => ({ word: w, level: 2 as const })),
    ...hsk3Words.map((w) => ({ word: w, level: 3 as const })),
  ];

  const out: ImageableWord[] = [];
  for (const { word, level } of all) {
    const theme = classify(word);
    if (!theme) continue;
    if (!VOCAB_IMAGE_IDS.has(word.id)) continue;
    out.push({
      id: word.id,
      hskLevel: level,
      simplified: word.simplified,
      pinyin: word.pinyin,
      english: word.english,
      partOfSpeech: word.partOfSpeech,
      theme,
      imagePath: `/images/vocab/${word.id}.jpg`,
    });
  }
  cache = out;
  return out;
}

export function getImageableByTheme(level?: 1 | 2 | 3): Record<Theme, ImageableWord[]> {
  const words = getImageableWords().filter((w) => !level || w.hskLevel === level);
  const buckets = {} as Record<Theme, ImageableWord[]>;
  for (const t of Object.keys(THEME_LABEL) as Theme[]) buckets[t] = [];
  for (const w of words) buckets[w.theme].push(w);
  return buckets;
}
