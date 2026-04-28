export interface GrammarPattern {
  id: string;
  pattern: string;
  structure: string;
  level: 1 | 2 | 3;
  explanation: string;
  examples: Array<{ chinese: string; pinyin: string; english: string }>;
  drillPrompt: string;
}

export const grammarPatterns: GrammarPattern[] = [
  // ─── HSK 1 (patterns gp-001 through gp-015) ──────────────────────────────

  {
    id: "gp-001",
    pattern: "是 (shì) — to be",
    structure: "Subject + 是 + Noun",
    level: 1,
    explanation:
      "是 links a subject to a noun or noun phrase, functioning like the English verb 'to be'. It is negated with 不是.",
    examples: [
      { chinese: "我是学生。", pinyin: "Wǒ shì xuéshēng.", english: "I am a student." },
      { chinese: "她是老师。", pinyin: "Tā shì lǎoshī.", english: "She is a teacher." },
      { chinese: "这是我的书。", pinyin: "Zhè shì wǒ de shū.", english: "This is my book." },
    ],
    drillPrompt: "Say 'He is a doctor' using 是.",
  },
  {
    id: "gp-002",
    pattern: "不是 (bù shì) — is not",
    structure: "Subject + 不是 + Noun",
    level: 1,
    explanation:
      "不是 is the negation of 是. Use it to say that something or someone is NOT something else.",
    examples: [
      { chinese: "我不是美国人。", pinyin: "Wǒ bù shì Měiguórén.", english: "I am not American." },
      { chinese: "他不是我的朋友。", pinyin: "Tā bù shì wǒ de péngyou.", english: "He is not my friend." },
      { chinese: "这不是咖啡。", pinyin: "Zhè bù shì kāfēi.", english: "This is not coffee." },
    ],
    drillPrompt: "Say 'This is not a cat' using 不是.",
  },
  {
    id: "gp-003",
    pattern: "有/没有 (yǒu / méiyǒu) — have / don't have",
    structure: "Subject + 有/没有 + Object",
    level: 1,
    explanation:
      "有 means 'to have' or 'there is/are'. Its negation is 没有 (never 不有). 没有 can also mean 'there is not'.",
    examples: [
      { chinese: "我有一本书。", pinyin: "Wǒ yǒu yī běn shū.", english: "I have a book." },
      { chinese: "他没有时间。", pinyin: "Tā méiyǒu shíjiān.", english: "He doesn't have time." },
      { chinese: "教室里有学生。", pinyin: "Jiàoshì lǐ yǒu xuéshēng.", english: "There are students in the classroom." },
    ],
    drillPrompt: "Say 'I don't have a car' using 没有.",
  },
  {
    id: "gp-004",
    pattern: "吗 (ma) — yes/no question particle",
    structure: "Statement + 吗？",
    level: 1,
    explanation:
      "Adding 吗 to the end of a declarative sentence turns it into a yes/no question without changing word order.",
    examples: [
      { chinese: "你是老师吗？", pinyin: "Nǐ shì lǎoshī ma?", english: "Are you a teacher?" },
      { chinese: "他有哥哥吗？", pinyin: "Tā yǒu gēgē ma?", english: "Does he have an older brother?" },
      { chinese: "你喝咖啡吗？", pinyin: "Nǐ hē kāfēi ma?", english: "Do you drink coffee?" },
    ],
    drillPrompt: "Turn 'She likes apples' into a yes/no question using 吗.",
  },
  {
    id: "gp-005",
    pattern: "呢 (ne) — what about…? / and…?",
    structure: "Noun/Pronoun + 呢？",
    level: 1,
    explanation:
      "呢 at the end of a short phrase asks 'what about X?' or echoes a previous question back to someone else, without repeating the full question.",
    examples: [
      { chinese: "我很好，你呢？", pinyin: "Wǒ hěn hǎo, nǐ ne?", english: "I'm fine, and you?" },
      { chinese: "他去图书馆了，她呢？", pinyin: "Tā qù túshūguǎn le, tā ne?", english: "He went to the library — what about her?" },
      { chinese: "这个多少钱？那个呢？", pinyin: "Zhège duōshao qián? Nàge ne?", english: "How much is this one? And that one?" },
    ],
    drillPrompt: "Ask 'I'm studying Chinese — what about you?' using 呢.",
  },
  {
    id: "gp-006",
    pattern: "不 (bù) — negation of verbs/adjectives",
    structure: "Subject + 不 + Verb/Adjective",
    level: 1,
    explanation:
      "不 negates most verbs and adjectives in present or future contexts. Note: 有 is negated with 没, not 不.",
    examples: [
      { chinese: "我不吃肉。", pinyin: "Wǒ bù chī ròu.", english: "I don't eat meat." },
      { chinese: "她不高兴。", pinyin: "Tā bù gāoxìng.", english: "She is not happy." },
      { chinese: "我明天不去。", pinyin: "Wǒ míngtiān bù qù.", english: "I'm not going tomorrow." },
    ],
    drillPrompt: "Say 'He doesn't want to go to school' using 不.",
  },
  {
    id: "gp-007",
    pattern: "SVO word order — Subject-Verb-Object",
    structure: "Subject + Verb + Object",
    level: 1,
    explanation:
      "Mandarin's default sentence order is Subject-Verb-Object, similar to English. Time words and location phrases typically come before the verb.",
    examples: [
      { chinese: "我爱你。", pinyin: "Wǒ ài nǐ.", english: "I love you." },
      { chinese: "她喝水。", pinyin: "Tā hē shuǐ.", english: "She drinks water." },
      { chinese: "我们学中文。", pinyin: "Wǒmen xué Zhōngwén.", english: "We study Chinese." },
    ],
    drillPrompt: "Say 'They eat rice' following SVO word order.",
  },
  {
    id: "gp-008",
    pattern: "量词 — measure words (个/本/张/杯/块)",
    structure: "Number + Measure Word + Noun",
    level: 1,
    explanation:
      "Chinese nouns require a specific measure word (量词 liàngcí) between a number and the noun. 个 is the most common general measure word.",
    examples: [
      { chinese: "三个苹果", pinyin: "sān gè píngguǒ", english: "three apples" },
      { chinese: "两本书", pinyin: "liǎng běn shū", english: "two books" },
      { chinese: "一杯茶", pinyin: "yī bēi chá", english: "one cup of tea" },
    ],
    drillPrompt: "Say 'five sheets of paper' using the correct measure word 张.",
  },
  {
    id: "gp-009",
    pattern: "也 (yě) — too / also",
    structure: "Subject + 也 + Verb/Adjective",
    level: 1,
    explanation:
      "也 means 'also' or 'too' and always appears directly before the verb or adjective, never at the end of the sentence.",
    examples: [
      { chinese: "我也是学生。", pinyin: "Wǒ yě shì xuéshēng.", english: "I am also a student." },
      { chinese: "她也喜欢音乐。", pinyin: "Tā yě xǐhuān yīnyuè.", english: "She also likes music." },
      { chinese: "他们也去北京。", pinyin: "Tāmen yě qù Běijīng.", english: "They are also going to Beijing." },
    ],
    drillPrompt: "Say 'My friend also drinks coffee' using 也.",
  },
  {
    id: "gp-010",
    pattern: "都 (dōu) — all / both",
    structure: "Subject (plural) + 都 + Verb",
    level: 1,
    explanation:
      "都 means 'all' or 'both' and sums up multiple subjects or items. It always comes before the verb, after the subject.",
    examples: [
      { chinese: "我们都喜欢中国菜。", pinyin: "Wǒmen dōu xǐhuān Zhōngguó cài.", english: "We all like Chinese food." },
      { chinese: "他们都是老师。", pinyin: "Tāmen dōu shì lǎoshī.", english: "They are all teachers." },
      { chinese: "苹果和香蕉都很好吃。", pinyin: "Píngguǒ hé xiāngjiāo dōu hěn hǎochī.", english: "Both apples and bananas taste great." },
    ],
    drillPrompt: "Say 'Both of them are going to Shanghai' using 都.",
  },
  {
    id: "gp-011",
    pattern: "时间词在动词前 — time words before verb",
    structure: "Subject + Time Word + Verb + Object",
    level: 1,
    explanation:
      "In Mandarin, time expressions (today, tomorrow, now, etc.) come before the verb, not after it as in some European languages.",
    examples: [
      { chinese: "我今天去学校。", pinyin: "Wǒ jīntiān qù xuéxiào.", english: "I go to school today." },
      { chinese: "她明天有考试。", pinyin: "Tā míngtiān yǒu kǎoshì.", english: "She has an exam tomorrow." },
      { chinese: "我们现在吃饭。", pinyin: "Wǒmen xiànzài chīfàn.", english: "We are eating now." },
    ],
    drillPrompt: "Say 'He works every day' with the time word in the correct position.",
  },
  {
    id: "gp-012",
    pattern: "在 (zài) — location / at, in, on",
    structure: "Subject + 在 + Place (+ Verb)",
    level: 1,
    explanation:
      "在 indicates location ('at/in/on'). When used before a verb, it can also mean an action is taking place at a location. As a standalone verb it means 'to be (at a place)'.",
    examples: [
      { chinese: "我在家。", pinyin: "Wǒ zài jiā.", english: "I am at home." },
      { chinese: "他在图书馆学习。", pinyin: "Tā zài túshūguǎn xuéxí.", english: "He studies at the library." },
      { chinese: "书在桌子上。", pinyin: "Shū zài zhuōzi shàng.", english: "The book is on the table." },
    ],
    drillPrompt: "Say 'She is working at the office' using 在.",
  },
  {
    id: "gp-013",
    pattern: "很 + adjective",
    structure: "Subject + 很 + Adjective",
    level: 1,
    explanation:
      "In Mandarin, adjectives used as predicates typically need an adverb like 很 (very) before them. Without an adverb, a bare adjective can imply comparison. 很 often acts as a grammatical link rather than carrying strong emphasis.",
    examples: [
      { chinese: "她很漂亮。", pinyin: "Tā hěn piàoliang.", english: "She is very pretty." },
      { chinese: "这个菜很好吃。", pinyin: "Zhège cài hěn hǎochī.", english: "This dish is very tasty." },
      { chinese: "今天很冷。", pinyin: "Jīntiān hěn lěng.", english: "It is very cold today." },
    ],
    drillPrompt: "Say 'This movie is very interesting' using 很.",
  },
  {
    id: "gp-014",
    pattern: "数字 1–100 — numbers",
    structure: "Number + Measure Word + Noun",
    level: 1,
    explanation:
      "Mandarin numbers 1–10 are 一二三四五六七八九十; 11 is 十一, 20 is 二十, 21 is 二十一. 两 (liǎng) replaces 二 before measure words.",
    examples: [
      { chinese: "我有二十本书。", pinyin: "Wǒ yǒu èrshí běn shū.", english: "I have twenty books." },
      { chinese: "他三十五岁。", pinyin: "Tā sānshíwǔ suì.", english: "He is thirty-five years old." },
      { chinese: "两个学生", pinyin: "liǎng gè xuéshēng", english: "two students" },
    ],
    drillPrompt: "Say 'There are forty-seven students in the class' using Chinese numbers.",
  },
  {
    id: "gp-015",
    pattern: "喜欢/想/要 — like / want to / want",
    structure: "Subject + 喜欢/想/要 + Verb/Noun",
    level: 1,
    explanation:
      "喜欢 means 'to like', 想 means 'would like to / want to' (softer desire), and 要 means 'want' or 'need to' (stronger intention). All three are followed directly by a verb or noun.",
    examples: [
      { chinese: "我喜欢看电影。", pinyin: "Wǒ xǐhuān kàn diànyǐng.", english: "I like watching movies." },
      { chinese: "她想去中国。", pinyin: "Tā xiǎng qù Zhōngguó.", english: "She wants to go to China." },
      { chinese: "我要一杯水。", pinyin: "Wǒ yào yī bēi shuǐ.", english: "I want a glass of water." },
    ],
    drillPrompt: "Say 'He likes playing basketball' using 喜欢.",
  },

  // ─── HSK 2 (patterns gp-016 through gp-040) ──────────────────────────────

  {
    id: "gp-016",
    pattern: "了 (le) — completion aspect",
    structure: "Subject + Verb + 了 (+ Object)",
    level: 2,
    explanation:
      "了 after a verb marks a completed action (perfective aspect). It does not strictly mean past tense — it can appear in future contexts too. Negation uses 没(有) and drops 了.",
    examples: [
      { chinese: "我吃了早饭。", pinyin: "Wǒ chī le zǎofàn.", english: "I ate breakfast." },
      { chinese: "她买了一件衣服。", pinyin: "Tā mǎi le yī jiàn yīfu.", english: "She bought a piece of clothing." },
      { chinese: "他们看了那部电影。", pinyin: "Tāmen kàn le nà bù diànyǐng.", english: "They watched that movie." },
    ],
    drillPrompt: "Say 'I finished my homework' using 了.",
  },
  {
    id: "gp-017",
    pattern: "过 (guò) — experiential aspect",
    structure: "Subject + Verb + 过 + Object",
    level: 2,
    explanation:
      "过 after a verb marks that the subject has had the experience of doing something at least once. It is negated with 没(有)过.",
    examples: [
      { chinese: "我去过北京。", pinyin: "Wǒ qù guò Běijīng.", english: "I have been to Beijing before." },
      { chinese: "你吃过北京烤鸭吗？", pinyin: "Nǐ chī guò Běijīng kǎoyā ma?", english: "Have you ever eaten Peking duck?" },
      { chinese: "她没学过日语。", pinyin: "Tā méi xué guò Rìyǔ.", english: "She has never studied Japanese." },
    ],
    drillPrompt: "Say 'Have you ever seen the Great Wall?' using 过.",
  },
  {
    id: "gp-018",
    pattern: "正在/在 (zhèngzài/zài) — progressive aspect",
    structure: "Subject + 正在/在 + Verb (+ 呢)",
    level: 2,
    explanation:
      "正在 or 在 before a verb indicates an action is in progress right now ('is -ing'). 呢 can be added at the end for emphasis. 正在 stresses the immediacy.",
    examples: [
      { chinese: "我正在吃饭。", pinyin: "Wǒ zhèngzài chīfàn.", english: "I am eating right now." },
      { chinese: "她在看书呢。", pinyin: "Tā zài kàn shū ne.", english: "She is reading a book." },
      { chinese: "他们正在开会。", pinyin: "Tāmen zhèngzài kāihuì.", english: "They are having a meeting." },
    ],
    drillPrompt: "Say 'My mom is cooking right now' using 正在.",
  },
  {
    id: "gp-019",
    pattern: "会 (huì) — can (learned ability / likelihood)",
    structure: "Subject + 会 + Verb",
    level: 2,
    explanation:
      "会 expresses an ability acquired through learning, such as speaking a language or playing an instrument. It also expresses likelihood or expectation ('will').",
    examples: [
      { chinese: "我会说中文。", pinyin: "Wǒ huì shuō Zhōngwén.", english: "I can speak Chinese." },
      { chinese: "她会弹钢琴。", pinyin: "Tā huì tán gāngqín.", english: "She can play the piano." },
      { chinese: "他不会开车。", pinyin: "Tā bù huì kāichē.", english: "He can't drive." },
    ],
    drillPrompt: "Say 'Can you cook Chinese food?' using 会.",
  },
  {
    id: "gp-020",
    pattern: "能 (néng) — can (physical ability/situational)",
    structure: "Subject + 能 + Verb",
    level: 2,
    explanation:
      "能 expresses physical ability, permission, or possibility given the current situation — 'be able to'. It differs from 会 (learned skill) and 可以 (rule-based permission).",
    examples: [
      { chinese: "你能帮我吗？", pinyin: "Nǐ néng bāng wǒ ma?", english: "Can you help me?" },
      { chinese: "我今天不能来。", pinyin: "Wǒ jīntiān bù néng lái.", english: "I can't come today." },
      { chinese: "他病了，不能去学校。", pinyin: "Tā bìng le, bù néng qù xuéxiào.", english: "He's sick and can't go to school." },
    ],
    drillPrompt: "Say 'I can't eat spicy food' using 能.",
  },
  {
    id: "gp-021",
    pattern: "可以 (kěyǐ) — may / allowed to",
    structure: "Subject + 可以 + Verb",
    level: 2,
    explanation:
      "可以 indicates permission or that something is acceptable/allowed. It is often used in requests and is negated with 不可以 (not allowed) or 不能.",
    examples: [
      { chinese: "你可以坐这里。", pinyin: "Nǐ kěyǐ zuò zhèlǐ.", english: "You may sit here." },
      { chinese: "这里不可以吸烟。", pinyin: "Zhèlǐ bù kěyǐ xīyān.", english: "Smoking is not allowed here." },
      { chinese: "我可以问你一个问题吗？", pinyin: "Wǒ kěyǐ wèn nǐ yī gè wèntí ma?", english: "May I ask you a question?" },
    ],
    drillPrompt: "Ask 'May I use your phone?' using 可以.",
  },
  {
    id: "gp-022",
    pattern: "还 (hái) — still / also / in addition",
    structure: "Subject + 还 + Verb/Adjective",
    level: 2,
    explanation:
      "还 has two main uses: (1) 'still' — an action or state continues; (2) 'also/in addition' — adding another item or quality. Context determines the meaning.",
    examples: [
      { chinese: "他还在睡觉。", pinyin: "Tā hái zài shuìjiào.", english: "He is still sleeping." },
      { chinese: "我会说英语，还会说法语。", pinyin: "Wǒ huì shuō Yīngyǔ, hái huì shuō Fǎyǔ.", english: "I can speak English and also French." },
      { chinese: "你还有问题吗？", pinyin: "Nǐ hái yǒu wèntí ma?", english: "Do you still have questions?" },
    ],
    drillPrompt: "Say 'She is still working' using 还.",
  },
  {
    id: "gp-023",
    pattern: "再 (zài) — again / then (future action)",
    structure: "Subject + 再 + Verb",
    level: 2,
    explanation:
      "再 means 'again' for future repeated actions or 'then' for a subsequent planned action. For past repetition, use 又 (yòu) instead.",
    examples: [
      { chinese: "请再说一遍。", pinyin: "Qǐng zài shuō yī biàn.", english: "Please say it one more time." },
      { chinese: "我先吃饭，再去学习。", pinyin: "Wǒ xiān chīfàn, zài qù xuéxí.", english: "I'll eat first, then study." },
      { chinese: "明天再来吧。", pinyin: "Míngtiān zài lái ba.", english: "Come again tomorrow." },
    ],
    drillPrompt: "Say 'Let's do it again tomorrow' using 再.",
  },
  {
    id: "gp-024",
    pattern: "就 (jiù) — then / right away / as early as",
    structure: "Condition/Time + 就 + Verb",
    level: 2,
    explanation:
      "就 indicates that something happens immediately, sooner than expected, or as a logical consequence. It often follows a time word or conditional clause.",
    examples: [
      { chinese: "我一回家就吃饭。", pinyin: "Wǒ yī huí jiā jiù chīfàn.", english: "As soon as I get home, I eat." },
      { chinese: "他八点就到了。", pinyin: "Tā bā diǎn jiù dào le.", english: "He arrived as early as 8 o'clock." },
      { chinese: "你说，我就明白了。", pinyin: "Nǐ shuō, wǒ jiù míngbái le.", english: "Once you explained it, I understood." },
    ],
    drillPrompt: "Say 'As soon as class ends, I'll go home' using 就.",
  },
  {
    id: "gp-025",
    pattern: "才 (cái) — only then / not until",
    structure: "Condition + Subject + 才 + Verb",
    level: 2,
    explanation:
      "才 indicates that something happens later than expected, or only under a specific condition — 'not until', 'only then'. It contrasts with 就 (sooner than expected).",
    examples: [
      { chinese: "他十点才来。", pinyin: "Tā shí diǎn cái lái.", english: "He didn't come until 10 o'clock." },
      { chinese: "你努力学习，才能成功。", pinyin: "Nǐ nǔlì xuéxí, cái néng chénggōng.", english: "Only if you study hard will you succeed." },
      { chinese: "我昨天才知道这件事。", pinyin: "Wǒ zuótiān cái zhīdào zhè jiàn shì.", english: "I didn't find out about this until yesterday." },
    ],
    drillPrompt: "Say 'I only got home at midnight' using 才.",
  },
  {
    id: "gp-026",
    pattern: "已经 (yǐjīng) — already",
    structure: "Subject + 已经 + Verb + 了",
    level: 2,
    explanation:
      "已经 means 'already' and is used before the verb to indicate an action has been completed. It usually pairs with 了 at the end of the sentence.",
    examples: [
      { chinese: "我已经吃了。", pinyin: "Wǒ yǐjīng chī le.", english: "I already ate." },
      { chinese: "她已经回家了。", pinyin: "Tā yǐjīng huí jiā le.", english: "She has already gone home." },
      { chinese: "火车已经开走了。", pinyin: "Huǒchē yǐjīng kāi zǒu le.", english: "The train has already left." },
    ],
    drillPrompt: "Say 'I have already finished reading that book' using 已经.",
  },
  {
    id: "gp-027",
    pattern: "比 (bǐ) — comparison (A is more … than B)",
    structure: "A + 比 + B + Adjective",
    level: 2,
    explanation:
      "比 is the standard comparison structure. Place the adjective after B without 很 or 非常 — those degree adverbs are not used in 比 sentences.",
    examples: [
      { chinese: "今天比昨天冷。", pinyin: "Jīntiān bǐ zuótiān lěng.", english: "Today is colder than yesterday." },
      { chinese: "他比我高。", pinyin: "Tā bǐ wǒ gāo.", english: "He is taller than me." },
      { chinese: "这个苹果比那个甜。", pinyin: "Zhège píngguǒ bǐ nàge tián.", english: "This apple is sweeter than that one." },
    ],
    drillPrompt: "Say 'My sister is younger than me' using 比.",
  },
  {
    id: "gp-028",
    pattern: "没有 comparison — not as … as",
    structure: "A + 没有 + B + Adjective",
    level: 2,
    explanation:
      "To say A is not as … as B, use A + 没有 + B + Adjective. This is the negative counterpart of the 比 comparison.",
    examples: [
      { chinese: "我没有他高。", pinyin: "Wǒ méiyǒu tā gāo.", english: "I am not as tall as he is." },
      { chinese: "这里没有北京冷。", pinyin: "Zhèlǐ méiyǒu Běijīng lěng.", english: "It's not as cold here as in Beijing." },
      { chinese: "今天没有昨天热。", pinyin: "Jīntiān méiyǒu zuótiān rè.", english: "Today is not as hot as yesterday." },
    ],
    drillPrompt: "Say 'This bag is not as heavy as that one' using 没有.",
  },
  {
    id: "gp-029",
    pattern: "越来越 (yuè lái yuè) — more and more",
    structure: "Subject + 越来越 + Adjective/Verb",
    level: 2,
    explanation:
      "越来越 means 'more and more' and shows that a quality or action is continuously increasing in degree over time.",
    examples: [
      { chinese: "天气越来越冷。", pinyin: "Tiānqì yuè lái yuè lěng.", english: "The weather is getting colder and colder." },
      { chinese: "她的中文越来越好。", pinyin: "Tā de Zhōngwén yuè lái yuè hǎo.", english: "Her Chinese is getting better and better." },
      { chinese: "他越来越喜欢北京了。", pinyin: "Tā yuè lái yuè xǐhuān Běijīng le.", english: "He is liking Beijing more and more." },
    ],
    drillPrompt: "Say 'The prices are getting higher and higher' using 越来越.",
  },
  {
    id: "gp-030",
    pattern: "把 (bǎ) — disposal construction (basic)",
    structure: "Subject + 把 + Object + Verb + Complement",
    level: 2,
    explanation:
      "把 brings the object before the verb to emphasize what is done to it. The verb must be followed by a complement or additional element — 把 sentences cannot end on a bare verb.",
    examples: [
      { chinese: "我把书放在桌子上。", pinyin: "Wǒ bǎ shū fàng zài zhuōzi shàng.", english: "I put the book on the table." },
      { chinese: "她把作业做完了。", pinyin: "Tā bǎ zuòyè zuò wán le.", english: "She finished doing her homework." },
      { chinese: "他把那封信看了一遍。", pinyin: "Tā bǎ nà fēng xìn kàn le yī biàn.", english: "He read that letter once through." },
    ],
    drillPrompt: "Say 'Please put your phone away' using 把.",
  },
  {
    id: "gp-031",
    pattern: "结果补语 — resultative complements (好/完/到/走)",
    structure: "Verb + Result Complement",
    level: 2,
    explanation:
      "A resultative complement follows the verb and describes the result of the action. Common ones: 好 (successfully done), 完 (finished), 到 (reached/achieved), 走 (gone away).",
    examples: [
      { chinese: "我写完了作业。", pinyin: "Wǒ xiě wán le zuòyè.", english: "I finished writing my homework." },
      { chinese: "他找到工作了。", pinyin: "Tā zhǎo dào gōngzuò le.", english: "He found a job." },
      { chinese: "你把衣服洗好了吗？", pinyin: "Nǐ bǎ yīfu xǐ hǎo le ma?", english: "Have you finished washing the clothes?" },
    ],
    drillPrompt: "Say 'I heard it clearly' using 听 and the complement 清楚.",
  },
  {
    id: "gp-032",
    pattern: "得 (de) — degree complement",
    structure: "Verb + 得 + Degree Phrase",
    level: 2,
    explanation:
      "得 links a verb (or adjective) to a complement that describes how well or to what degree the action is performed. The complement after 得 can be an adjective or a clause.",
    examples: [
      { chinese: "他说得很好。", pinyin: "Tā shuō de hěn hǎo.", english: "He speaks very well." },
      { chinese: "她跑得很快。", pinyin: "Tā pǎo de hěn kuài.", english: "She runs very fast." },
      { chinese: "这道题难得我做不出来。", pinyin: "Zhè dào tí nán de wǒ zuò bù chū lái.", english: "This problem is so hard that I can't solve it." },
    ],
    drillPrompt: "Say 'He writes very beautifully' using 得.",
  },
  {
    id: "gp-033",
    pattern: "从…到 (cóng…dào) — from … to",
    structure: "从 + Start + 到 + End + Verb",
    level: 2,
    explanation:
      "从…到 expresses a range — from one time, place, or point to another. It can indicate time spans, distances, or sequences.",
    examples: [
      { chinese: "他从北京到上海坐了五个小时的火车。", pinyin: "Tā cóng Běijīng dào Shànghǎi zuò le wǔ gè xiǎoshí de huǒchē.", english: "He took a five-hour train from Beijing to Shanghai." },
      { chinese: "我从早上到晚上都在工作。", pinyin: "Wǒ cóng zǎoshàng dào wǎnshàng dōu zài gōngzuò.", english: "I work from morning to night." },
      { chinese: "从这里到学校要走多久？", pinyin: "Cóng zhèlǐ dào xuéxiào yào zǒu duō jiǔ?", english: "How long does it take to walk from here to school?" },
    ],
    drillPrompt: "Say 'He works from Monday to Friday' using 从…到.",
  },
  {
    id: "gp-034",
    pattern: "对 (duì) — toward / regarding",
    structure: "Subject + 对 + Object + Verb/Adjective",
    level: 2,
    explanation:
      "对 introduces the target of an attitude, action, or feeling — 'toward', 'regarding', or 'to'. It can also mean 'correct' as a standalone predicate.",
    examples: [
      { chinese: "他对我很好。", pinyin: "Tā duì wǒ hěn hǎo.", english: "He is very kind to me." },
      { chinese: "我对历史很感兴趣。", pinyin: "Wǒ duì lìshǐ hěn gǎn xìngqù.", english: "I am very interested in history." },
      { chinese: "你对这个问题有什么看法？", pinyin: "Nǐ duì zhège wèntí yǒu shénme kànfǎ?", english: "What is your opinion regarding this issue?" },
    ],
    drillPrompt: "Say 'She is very patient with her students' using 对.",
  },
  {
    id: "gp-035",
    pattern: "给 (gěi) — give / for (beneficiary)",
    structure: "Subject + 给 + Recipient + Verb + Object",
    level: 2,
    explanation:
      "给 means 'to give' as a main verb, or as a coverb it marks the recipient/beneficiary of an action ('for/to someone').",
    examples: [
      { chinese: "我给你发了一封邮件。", pinyin: "Wǒ gěi nǐ fā le yī fēng yóujiàn.", english: "I sent you an email." },
      { chinese: "妈妈给我买了一个蛋糕。", pinyin: "Māma gěi wǒ mǎi le yī gè dàngāo.", english: "Mom bought me a cake." },
      { chinese: "他给老师写了一封信。", pinyin: "Tā gěi lǎoshī xiě le yī fēng xìn.", english: "He wrote a letter to the teacher." },
    ],
    drillPrompt: "Say 'Please give me a glass of water' using 给.",
  },
  {
    id: "gp-036",
    pattern: "让 (ràng) — let / make / allow",
    structure: "Subject + 让 + Person + Verb",
    level: 2,
    explanation:
      "让 means 'to let', 'to allow', or 'to make (someone do something)'. It introduces the person who is caused or permitted to perform the action.",
    examples: [
      { chinese: "妈妈让我早点回家。", pinyin: "Māma ràng wǒ zǎo diǎn huí jiā.", english: "Mom told me to come home early." },
      { chinese: "老师让学生们复习课文。", pinyin: "Lǎoshī ràng xuéshēngmen fùxí kèwén.", english: "The teacher had the students review the text." },
      { chinese: "别让我等太久。", pinyin: "Bié ràng wǒ děng tài jiǔ.", english: "Don't make me wait too long." },
    ],
    drillPrompt: "Say 'Please let me try' using 让.",
  },
  {
    id: "gp-037",
    pattern: "时量补语 — duration expressions",
    structure: "Verb + Duration / Verb + 了 + Duration (+ 了)",
    level: 2,
    explanation:
      "Duration complements come after the verb (and its object, if any) to state how long an action lasted. If there is an object, the verb is often repeated or the object precedes the duration.",
    examples: [
      { chinese: "我学了三年中文。", pinyin: "Wǒ xué le sān nián Zhōngwén.", english: "I have studied Chinese for three years." },
      { chinese: "她等了你两个小时。", pinyin: "Tā děng le nǐ liǎng gè xiǎoshí.", english: "She waited for you for two hours." },
      { chinese: "他睡了十个小时。", pinyin: "Tā shuì le shí gè xiǎoshí.", english: "He slept for ten hours." },
    ],
    drillPrompt: "Say 'I watched TV for two hours last night' using a duration expression.",
  },
  {
    id: "gp-038",
    pattern: "还是 (háishi) — or (choice questions)",
    structure: "Option A + 还是 + Option B？",
    level: 2,
    explanation:
      "还是 connects two alternatives in a question asking the listener to choose. It differs from 或者 (or), which is used in statements.",
    examples: [
      { chinese: "你喝咖啡还是喝茶？", pinyin: "Nǐ hē kāfēi háishi hē chá?", english: "Do you want coffee or tea?" },
      { chinese: "你是中国人还是日本人？", pinyin: "Nǐ shì Zhōngguórén háishi Rìběnrén?", english: "Are you Chinese or Japanese?" },
      { chinese: "我们坐地铁还是打车？", pinyin: "Wǒmen zuò dìtiě háishi dǎchē?", english: "Shall we take the subway or a taxi?" },
    ],
    drillPrompt: "Ask 'Do you want to eat here or take it to go?' using 还是.",
  },
  {
    id: "gp-039",
    pattern: "一…就 (yī…jiù) — as soon as",
    structure: "一 + Verb₁, (Subject) + 就 + Verb₂",
    level: 2,
    explanation:
      "一…就 means 'as soon as … then …'. 一 introduces the first action and 就 introduces the immediate result or next action.",
    examples: [
      { chinese: "他一下班就回家。", pinyin: "Tā yī xià bān jiù huí jiā.", english: "As soon as he gets off work, he goes home." },
      { chinese: "我一看到她就笑了。", pinyin: "Wǒ yī kàn dào tā jiù xiào le.", english: "As soon as I saw her, I smiled." },
      { chinese: "她一听到这个消息就哭了。", pinyin: "Tā yī tīng dào zhège xiāoxi jiù kū le.", english: "As soon as she heard the news, she cried." },
    ],
    drillPrompt: "Say 'As soon as I woke up, I checked my phone' using 一…就.",
  },
  {
    id: "gp-040",
    pattern: "先…再 (xiān…zài) — first … then",
    structure: "Subject + 先 + Verb₁, (Subject) + 再 + Verb₂",
    level: 2,
    explanation:
      "先…再 describes two sequential actions: do A first, then do B. 先 sets the order and 再 follows with the next action.",
    examples: [
      { chinese: "你先洗手，再吃饭。", pinyin: "Nǐ xiān xǐ shǒu, zài chīfàn.", english: "Wash your hands first, then eat." },
      { chinese: "我先做作业，再看电视。", pinyin: "Wǒ xiān zuò zuòyè, zài kàn diànshì.", english: "I'll do homework first, then watch TV." },
      { chinese: "我们先坐地铁，再换公共汽车。", pinyin: "Wǒmen xiān zuò dìtiě, zài huàn gōnggòng qìchē.", english: "We'll take the subway first, then transfer to a bus." },
    ],
    drillPrompt: "Say 'First finish eating, then we can go' using 先…再.",
  },

  // ─── HSK 3 (patterns gp-041 through gp-055) ──────────────────────────────

  {
    id: "gp-041",
    pattern: "被 (bèi) — passive voice",
    structure: "Subject (receiver) + 被 + Agent + Verb + Complement",
    level: 3,
    explanation:
      "被 marks the passive voice and indicates that the subject received the action. The agent (doer) follows 被. 被 sentences typically carry a sense of an undesirable or notable result.",
    examples: [
      { chinese: "我的钱包被偷了。", pinyin: "Wǒ de qiánbāo bèi tōu le.", english: "My wallet was stolen." },
      { chinese: "窗户被风吹开了。", pinyin: "Chuānghù bèi fēng chuī kāi le.", english: "The window was blown open by the wind." },
      { chinese: "他被老师批评了。", pinyin: "Tā bèi lǎoshī pīpíng le.", english: "He was criticized by the teacher." },
    ],
    drillPrompt: "Say 'The cake was eaten by the children' using 被.",
  },
  {
    id: "gp-042",
    pattern: "虽然…但是 (suīrán…dànshì) — although … but",
    structure: "虽然 + Clause A, 但是 + Clause B",
    level: 3,
    explanation:
      "虽然 introduces a concessive clause ('although/even though'), and 但是 introduces the contrasting result. In Chinese, 但是 must still appear even when 虽然 is used — unlike English.",
    examples: [
      { chinese: "虽然很贵，但是质量很好。", pinyin: "Suīrán hěn guì, dànshì zhìliàng hěn hǎo.", english: "Although it's expensive, the quality is very good." },
      { chinese: "虽然他很累，但是还在工作。", pinyin: "Suīrán tā hěn lèi, dànshì hái zài gōngzuò.", english: "Although he is very tired, he is still working." },
      { chinese: "虽然我不喜欢他，但是我尊重他。", pinyin: "Suīrán wǒ bù xǐhuān tā, dànshì wǒ zūnzhòng tā.", english: "Although I don't like him, I respect him." },
    ],
    drillPrompt: "Say 'Although the weather is bad, we still went out' using 虽然…但是.",
  },
  {
    id: "gp-043",
    pattern: "如果…就 (rúguǒ…jiù) — if … then",
    structure: "如果 + Condition, (Subject) + 就 + Result",
    level: 3,
    explanation:
      "如果 introduces a conditional clause ('if') and 就 introduces the consequence ('then'). 如果 can be omitted in casual speech, but 就 is usually retained.",
    examples: [
      { chinese: "如果明天下雨，我们就不去了。", pinyin: "Rúguǒ míngtiān xià yǔ, wǒmen jiù bù qù le.", english: "If it rains tomorrow, we won't go." },
      { chinese: "如果你有问题，就给我打电话。", pinyin: "Rúguǒ nǐ yǒu wèntí, jiù gěi wǒ dǎ diànhuà.", english: "If you have a question, call me." },
      { chinese: "如果她来了，我就告诉你。", pinyin: "Rúguǒ tā lái le, wǒ jiù gàosù nǐ.", english: "If she comes, I'll let you know." },
    ],
    drillPrompt: "Say 'If you study hard, you will pass the exam' using 如果…就.",
  },
  {
    id: "gp-044",
    pattern: "不但…而且 (bùdàn…érqiě) — not only … but also",
    structure: "不但 + Clause A, 而且 + Clause B",
    level: 3,
    explanation:
      "不但…而且 adds information progressively: 'not only A, but also B (and more)'. It emphasizes that B goes beyond A.",
    examples: [
      { chinese: "他不但会说中文，而且会说日语。", pinyin: "Tā bùdàn huì shuō Zhōngwén, érqiě huì shuō Rìyǔ.", english: "He can not only speak Chinese but also Japanese." },
      { chinese: "这家餐厅不但便宜，而且好吃。", pinyin: "Zhè jiā cāntīng bùdàn piányí, érqiě hǎochī.", english: "This restaurant is not only cheap but also delicious." },
      { chinese: "她不但聪明，而且非常勤奋。", pinyin: "Tā bùdàn cōngmíng, érqiě fēicháng qínfèn.", english: "She is not only smart but also very hardworking." },
    ],
    drillPrompt: "Say 'This book is not only interesting but also very useful' using 不但…而且.",
  },
  {
    id: "gp-045",
    pattern: "是…的 (shì…de) — emphasis construction",
    structure: "是 + [Emphasized Element] + Verb + 的",
    level: 3,
    explanation:
      "是…的 highlights specific information about a past action, such as the time, place, manner, or agent. The action itself is already known; 是…的 clarifies the details.",
    examples: [
      { chinese: "我是昨天来的。", pinyin: "Wǒ shì zuótiān lái de.", english: "It was yesterday that I came." },
      { chinese: "他是坐飞机去的。", pinyin: "Tā shì zuò fēijī qù de.", english: "It was by plane that he went." },
      { chinese: "这本书是在网上买的。", pinyin: "Zhè běn shū shì zài wǎngshàng mǎi de.", english: "This book was bought online." },
    ],
    drillPrompt: "Say 'It was in Shanghai that she was born' using 是…的.",
  },
  {
    id: "gp-046",
    pattern: "越…越 (yuè…yuè) — the more … the more",
    structure: "越 + Verb/Adjective A + 越 + Verb/Adjective B",
    level: 3,
    explanation:
      "越…越 means 'the more A, the more B', showing that two qualities or actions increase in tandem. Both elements can be verbs, adjectives, or verb phrases.",
    examples: [
      { chinese: "他越说越兴奋。", pinyin: "Tā yuè shuō yuè xīngfèn.", english: "The more he talked, the more excited he got." },
      { chinese: "越难的事，她越努力。", pinyin: "Yuè nán de shì, tā yuè nǔlì.", english: "The harder the task, the harder she works." },
      { chinese: "这本书越读越有趣。", pinyin: "Zhè běn shū yuè dú yuè yǒuqù.", english: "The more you read this book, the more interesting it gets." },
    ],
    drillPrompt: "Say 'The more you practice, the better your Chinese will get' using 越…越.",
  },
  {
    id: "gp-047",
    pattern: "有点儿 (yǒudiǎnr) — a bit (unwanted quality)",
    structure: "Subject + 有点儿 + Adjective",
    level: 3,
    explanation:
      "有点儿 means 'a little / somewhat' and is used before adjectives that carry a negative or undesirable quality. It expresses mild dissatisfaction or complaint.",
    examples: [
      { chinese: "这道菜有点儿咸。", pinyin: "Zhè dào cài yǒudiǎnr xián.", english: "This dish is a bit salty." },
      { chinese: "今天有点儿冷。", pinyin: "Jīntiān yǒudiǎnr lěng.", english: "It's a bit cold today." },
      { chinese: "他有点儿紧张。", pinyin: "Tā yǒudiǎnr jǐnzhāng.", english: "He is a little nervous." },
    ],
    drillPrompt: "Say 'This movie is a bit boring' using 有点儿.",
  },
  {
    id: "gp-048",
    pattern: "一点儿 (yīdiǎnr) — a little (neutral modifier)",
    structure: "Verb + 一点儿 / Adjective + 一点儿",
    level: 3,
    explanation:
      "一点儿 means 'a little' in a neutral or positive sense and modifies verbs or adjectives after them. It often softens commands ('a little more/faster').",
    examples: [
      { chinese: "请说快一点儿。", pinyin: "Qǐng shuō kuài yīdiǎnr.", english: "Please speak a little faster." },
      { chinese: "我能多要一点儿米饭吗？", pinyin: "Wǒ néng duō yào yīdiǎnr mǐfàn ma?", english: "Can I have a little more rice?" },
      { chinese: "你能安静一点儿吗？", pinyin: "Nǐ néng ānjìng yīdiǎnr ma?", english: "Could you be a little quieter?" },
    ],
    drillPrompt: "Ask someone to 'walk a little slower' using 一点儿.",
  },
  {
    id: "gp-049",
    pattern: "趋向补语 — directional complements (进来/出去/上来/下去)",
    structure: "Verb + Directional Complement",
    level: 3,
    explanation:
      "Directional complements follow a verb to show the direction of movement relative to the speaker. Common pairs: 进/出 (in/out), 上/下 (up/down), 来/去 (toward/away from speaker). They combine: 进来 (come in), 出去 (go out), 上来 (come up), 下去 (go down).",
    examples: [
      { chinese: "请进来。", pinyin: "Qǐng jìn lái.", english: "Please come in." },
      { chinese: "他跑出去了。", pinyin: "Tā pǎo chū qù le.", english: "He ran out (away from here)." },
      { chinese: "她把行李拿上来了。", pinyin: "Tā bǎ xíngli ná shàng lái le.", english: "She brought the luggage up." },
    ],
    drillPrompt: "Say 'The students walked into the classroom' using 走 and 进来.",
  },
  {
    id: "gp-050",
    pattern: "把 with result/direction (advanced)",
    structure: "Subject + 把 + Object + Verb + Result/Direction Complement",
    level: 3,
    explanation:
      "The advanced 把 construction pairs the verb with a result or directional complement to show what is accomplished with the specific object. The object must be definite.",
    examples: [
      { chinese: "请把窗户关上。", pinyin: "Qǐng bǎ chuānghù guān shàng.", english: "Please close the window." },
      { chinese: "他把那个箱子搬进来了。", pinyin: "Tā bǎ nàge xiāngzi bān jìn lái le.", english: "He moved that box inside." },
      { chinese: "我把报告写完了。", pinyin: "Wǒ bǎ bàogào xiě wán le.", english: "I finished writing the report." },
    ],
    drillPrompt: "Say 'Please put these books onto the shelf' using 把 and 放上去.",
  },
  {
    id: "gp-051",
    pattern: "除了…以外 (chúle…yǐwài) — besides / except",
    structure: "除了 + Noun/Clause + 以外, Subject + 都/还/也 + Verb",
    level: 3,
    explanation:
      "除了…以外 means 'besides' (inclusive — use 还/也) or 'except' (exclusive — use 都). The second clause clarifies whether the item is included or excluded.",
    examples: [
      { chinese: "除了英语以外，他还会说法语。", pinyin: "Chúle Yīngyǔ yǐwài, tā hái huì shuō Fǎyǔ.", english: "Besides English, he can also speak French." },
      { chinese: "除了他以外，大家都来了。", pinyin: "Chúle tā yǐwài, dàjiā dōu lái le.", english: "Except for him, everyone came." },
      { chinese: "除了周末以外，我每天都上班。", pinyin: "Chúle zhōumò yǐwài, wǒ měitiān dōu shàngbān.", english: "Except for weekends, I work every day." },
    ],
    drillPrompt: "Say 'Besides coffee, I also like tea' using 除了…以外.",
  },
  {
    id: "gp-052",
    pattern: "只要…就 (zhǐyào…jiù) — as long as … then",
    structure: "只要 + Condition, (Subject) + 就 + Result",
    level: 3,
    explanation:
      "只要…就 means 'as long as / provided that'. It states a sufficient condition — if the condition is met, the result will follow.",
    examples: [
      { chinese: "只要你努力，就能成功。", pinyin: "Zhǐyào nǐ nǔlì, jiù néng chénggōng.", english: "As long as you work hard, you will succeed." },
      { chinese: "只要天气好，我们就去爬山。", pinyin: "Zhǐyào tiānqì hǎo, wǒmen jiù qù páshān.", english: "As long as the weather is good, we'll go hiking." },
      { chinese: "只要有时间，她就会来帮忙。", pinyin: "Zhǐyào yǒu shíjiān, tā jiù huì lái bāngmáng.", english: "As long as she has time, she'll come and help." },
    ],
    drillPrompt: "Say 'As long as you practice every day, your Chinese will improve' using 只要…就.",
  },
  {
    id: "gp-053",
    pattern: "为了 (wèile) — in order to / for the purpose of",
    structure: "为了 + Goal + (Subject) + Verb",
    level: 3,
    explanation:
      "为了 introduces the purpose or motivation behind an action — 'in order to' or 'for the sake of'. It comes at the beginning of the sentence or directly before the main verb.",
    examples: [
      { chinese: "为了学好中文，他每天练习写字。", pinyin: "Wèile xué hǎo Zhōngwén, tā měitiān liànxí xiězì.", english: "In order to learn Chinese well, he practices writing every day." },
      { chinese: "她为了家人努力工作。", pinyin: "Tā wèile jiārén nǔlì gōngzuò.", english: "She works hard for her family." },
      { chinese: "为了赶上火车，我们跑了起来。", pinyin: "Wèile gǎnshàng huǒchē, wǒmen pǎo le qǐlái.", english: "In order to catch the train, we started running." },
    ],
    drillPrompt: "Say 'In order to stay healthy, I exercise every morning' using 为了.",
  },
  {
    id: "gp-054",
    pattern: "连…都/也 (lián…dōu/yě) — even",
    structure: "连 + Noun/Verb + 都/也 + Verb",
    level: 3,
    explanation:
      "连…都/也 emphasizes an extreme or unexpected case — 'even X'. 连 introduces the unexpected item and 都 or 也 comes before the verb to complete the emphasis.",
    examples: [
      { chinese: "他连自己的名字都写错了。", pinyin: "Tā lián zìjǐ de míngzi dōu xiě cuò le.", english: "He even wrote his own name wrong." },
      { chinese: "她连一分钟都没有休息。", pinyin: "Tā lián yī fēnzhōng dōu méiyǒu xiūxi.", english: "She didn't rest for even a minute." },
      { chinese: "连小孩子也知道这件事。", pinyin: "Lián xiǎo háizi yě zhīdào zhè jiàn shì.", english: "Even small children know about this." },
    ],
    drillPrompt: "Say 'He doesn't even know her name' using 连…都.",
  },
  {
    id: "gp-055",
    pattern: "不管…都/也 (bùguǎn…dōu/yě) — no matter … still",
    structure: "不管 + Condition/Question Word + 都/也 + Verb",
    level: 3,
    explanation:
      "不管…都/也 means 'no matter (what/how/who/when)'. It introduces a variable condition and asserts that the outcome remains the same regardless.",
    examples: [
      { chinese: "不管多难，她都不放弃。", pinyin: "Bùguǎn duō nán, tā dōu bù fàngqì.", english: "No matter how hard it is, she never gives up." },
      { chinese: "不管你去哪里，我都跟着你。", pinyin: "Bùguǎn nǐ qù nǎlǐ, wǒ dōu gēnzhe nǐ.", english: "No matter where you go, I will follow you." },
      { chinese: "不管天气怎么样，他都跑步。", pinyin: "Bùguǎn tiānqì zěnmeyàng, tā dōu pǎobù.", english: "No matter what the weather is like, he goes running." },
    ],
    drillPrompt: "Say 'No matter what happens, we will stay together' using 不管…都.",
  },
];
