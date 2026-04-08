export type BusinessTerm = {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  category: string;
};

export type BusinessSentence = {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  category: string;
  context: string;
};

export const businessTerms: BusinessTerm[] = [
  // March 8 Lesson - Core 10 Terms
  { id: "bt-1", chinese: "供应商", pinyin: "gōngyìngshāng", english: "Supplier", category: "business" },
  { id: "bt-2", chinese: "包装材料", pinyin: "bāozhuāng cáiliào", english: "Packaging materials", category: "business" },
  { id: "bt-3", chinese: "报价", pinyin: "bàojià", english: "Quotation", category: "business" },
  { id: "bt-4", chinese: "订单", pinyin: "dìngdān", english: "Order", category: "business" },
  { id: "bt-5", chinese: "交货期", pinyin: "jiāohuò qī", english: "Delivery date", category: "business" },
  { id: "bt-6", chinese: "质量", pinyin: "zhìliàng", english: "Quality", category: "business" },
  { id: "bt-7", chinese: "样品", pinyin: "yàngpǐn", english: "Sample", category: "business" },
  { id: "bt-8", chinese: "库存", pinyin: "kùcún", english: "Stock / Inventory", category: "business" },
  { id: "bt-9", chinese: "折扣", pinyin: "zhékòu", english: "Discount", category: "business" },
  { id: "bt-10", chinese: "合作", pinyin: "hézuò", english: "Cooperation", category: "business" },

  // Packaging Industry Terms
  { id: "bt-11", chinese: "瓦楞纸", pinyin: "wǎléngzhǐ", english: "Corrugated paper", category: "packaging" },
  { id: "bt-12", chinese: "纸箱", pinyin: "zhǐxiāng", english: "Carton / Box", category: "packaging" },
  { id: "bt-13", chinese: "印刷", pinyin: "yìnshuā", english: "Printing", category: "packaging" },
  { id: "bt-14", chinese: "模切", pinyin: "mòqiē", english: "Die-cutting", category: "packaging" },
  { id: "bt-15", chinese: "规格", pinyin: "guīgé", english: "Specifications", category: "packaging" },
  { id: "bt-16", chinese: "瓦楞纸板", pinyin: "wǎléng zhǐbǎn", english: "Corrugated board", category: "packaging" },
  { id: "bt-17", chinese: "面纸", pinyin: "miànzhǐ", english: "Liner paper", category: "packaging" },
  { id: "bt-18", chinese: "芯纸", pinyin: "xīnzhǐ", english: "Fluting / Medium paper", category: "packaging" },
  { id: "bt-19", chinese: "克重", pinyin: "kèzhòng", english: "Grammage (g/m2)", category: "packaging" },
  { id: "bt-20", chinese: "抗压强度", pinyin: "kàng yā qiángdù", english: "Compression strength", category: "packaging" },
  { id: "bt-21", chinese: "柔印", pinyin: "róuyìn", english: "Flexographic printing", category: "packaging" },
  { id: "bt-22", chinese: "胶印", pinyin: "jiāoyìn", english: "Offset printing", category: "packaging" },
  { id: "bt-23", chinese: "生产线", pinyin: "shēngchǎn xiàn", english: "Production line", category: "packaging" },
  { id: "bt-24", chinese: "粘合", pinyin: "zhānhé", english: "Gluing / Bonding", category: "packaging" },
  { id: "bt-25", chinese: "开槽", pinyin: "kāi cáo", english: "Slotting", category: "packaging" },
  { id: "bt-26", chinese: "压线", pinyin: "yā xiàn", english: "Creasing / Scoring", category: "packaging" },
  { id: "bt-27", chinese: "覆膜", pinyin: "fù mó", english: "Lamination", category: "packaging" },
  { id: "bt-28", chinese: "单面瓦楞", pinyin: "dān miàn wǎléng", english: "Single-face corrugated", category: "packaging" },
  { id: "bt-29", chinese: "双瓦楞", pinyin: "shuāng wǎléng", english: "Double-wall corrugated", category: "packaging" },
  { id: "bt-30", chinese: "纸板厚度", pinyin: "zhǐbǎn hòudù", english: "Board thickness", category: "packaging" },
  { id: "bt-31", chinese: "定制", pinyin: "dìngzhì", english: "Custom-made", category: "packaging" },
  { id: "bt-32", chinese: "楞型", pinyin: "léng xíng", english: "Flute type (A/B/C/E)", category: "packaging" },
  { id: "bt-33", chinese: "色差", pinyin: "sè chā", english: "Color deviation / Variance", category: "packaging" },
  { id: "bt-34", chinese: "刀模", pinyin: "dāo mó", english: "Die / Cutting die", category: "packaging" },
  { id: "bt-35", chinese: "耐破强度", pinyin: "nài pò qiángdù", english: "Burst strength", category: "packaging" },
];

export const businessSentences: BusinessSentence[] = [
  // Category 1: Greetings & Opening
  {
    id: "bs-1",
    chinese: "你好，很高兴认识你",
    pinyin: "Nǐ hǎo, hěn gāoxìng rènshi nǐ",
    english: "Hello, nice to meet you",
    category: "Greetings & Opening",
    context: "First meeting with a supplier or factory contact",
  },
  {
    id: "bs-2",
    chinese: "我是Sean，来自美国的包装公司",
    pinyin: "Wǒ shì Sean, láizì Měiguó de bāozhuāng gōngsī",
    english: "I'm Sean, from a packaging company in the US",
    category: "Greetings & Opening",
    context: "Introducing yourself at the start of a meeting",
  },
  {
    id: "bs-3",
    chinese: "感谢你们的热情接待",
    pinyin: "Gǎnxiè nǐmen de rèqíng jiēdài",
    english: "Thank you for your warm hospitality",
    category: "Greetings & Opening",
    context: "After being welcomed at a factory or office",
  },
  {
    id: "bs-4",
    chinese: "这是我的名片",
    pinyin: "Zhè shì wǒ de míngpiàn",
    english: "This is my business card",
    category: "Greetings & Opening",
    context: "Exchanging business cards at a meeting",
  },
  {
    id: "bs-5",
    chinese: "我们公司做纸箱加工",
    pinyin: "Wǒmen gōngsī zuò zhǐxiāng jiāgōng",
    english: "Our company does box converting",
    category: "Greetings & Opening",
    context: "Explaining your business to a new contact",
  },

  // Category 2: Business Inquiry
  {
    id: "bs-6",
    chinese: "请问你们的报价是多少？",
    pinyin: "Qǐngwèn nǐmen de bàojià shì duōshao?",
    english: "May I ask what your quotation is?",
    category: "Business Inquiry",
    context: "Asking for pricing on products or materials",
  },
  {
    id: "bs-7",
    chinese: "你们有哪些包装材料？",
    pinyin: "Nǐmen yǒu nǎxiē bāozhuāng cáiliào?",
    english: "What packaging materials do you have?",
    category: "Business Inquiry",
    context: "Asking about available materials at a supplier",
  },
  {
    id: "bs-8",
    chinese: "可以看一下样品吗？",
    pinyin: "Kěyǐ kàn yīxià yàngpǐn ma?",
    english: "Can I look at some samples?",
    category: "Business Inquiry",
    context: "Requesting to see product samples",
  },
  {
    id: "bs-9",
    chinese: "你们的产能怎么样？",
    pinyin: "Nǐmen de chǎnnéng zěnmeyàng?",
    english: "What is your production capacity like?",
    category: "Business Inquiry",
    context: "Evaluating if a supplier can handle your volume",
  },
  {
    id: "bs-10",
    chinese: "这个规格的纸箱多少钱一个？",
    pinyin: "Zhège guīgé de zhǐxiāng duōshao qián yī gè?",
    english: "How much per box for this specification?",
    category: "Business Inquiry",
    context: "Getting per-unit pricing on specific box sizes",
  },

  // Category 3: Order Communication
  {
    id: "bs-11",
    chinese: "我想下一个订单",
    pinyin: "Wǒ xiǎng xià yī gè dìngdān",
    english: "I'd like to place an order",
    category: "Order Communication",
    context: "Ready to commit to purchasing",
  },
  {
    id: "bs-12",
    chinese: "交货期能不能快一点？",
    pinyin: "Jiāohuò qī néng bù néng kuài yīdiǎn?",
    english: "Can the delivery be faster?",
    category: "Order Communication",
    context: "Negotiating shorter lead times",
  },
  {
    id: "bs-13",
    chinese: "请确认一下订单数量",
    pinyin: "Qǐng quèrèn yīxià dìngdān shùliàng",
    english: "Please confirm the order quantity",
    category: "Order Communication",
    context: "Finalizing order details before signing",
  },
  {
    id: "bs-14",
    chinese: "库存还有多少？",
    pinyin: "Kùcún hái yǒu duōshao?",
    english: "How much stock is left?",
    category: "Order Communication",
    context: "Checking inventory availability",
  },
  {
    id: "bs-15",
    chinese: "我们需要按月供货",
    pinyin: "Wǒmen xūyào àn yuè gōnghuò",
    english: "We need monthly supply",
    category: "Order Communication",
    context: "Discussing recurring delivery schedules",
  },

  // Category 4: Problem Communication
  {
    id: "bs-16",
    chinese: "这批货的质量有问题",
    pinyin: "Zhè pī huò de zhìliàng yǒu wèntí",
    english: "This batch has quality issues",
    category: "Problem Communication",
    context: "Raising concerns about received goods",
  },
  {
    id: "bs-17",
    chinese: "颜色跟样品不一样",
    pinyin: "Yánsè gēn yàngpǐn bù yīyàng",
    english: "The color doesn't match the sample",
    category: "Problem Communication",
    context: "Pointing out color discrepancy in production",
  },
  {
    id: "bs-18",
    chinese: "尺寸不对",
    pinyin: "Chǐcùn bù duì",
    english: "The dimensions are wrong",
    category: "Problem Communication",
    context: "Reporting incorrect sizing on delivered product",
  },
  {
    id: "bs-19",
    chinese: "这个问题怎么解决？",
    pinyin: "Zhège wèntí zěnme jiějué?",
    english: "How do we solve this problem?",
    category: "Problem Communication",
    context: "Asking the supplier to address an issue",
  },
  {
    id: "bs-20",
    chinese: "请重新生产这批货",
    pinyin: "Qǐng chóngxīn shēngchǎn zhè pī huò",
    english: "Please reproduce this batch",
    category: "Problem Communication",
    context: "Requesting a replacement production run",
  },

  // Category 5: Follow-up & Closing
  {
    id: "bs-21",
    chinese: "谢谢你们的合作",
    pinyin: "Xièxie nǐmen de hézuò",
    english: "Thank you for your cooperation",
    category: "Follow-up & Closing",
    context: "Ending a meeting on a positive note",
  },
  {
    id: "bs-22",
    chinese: "请把报价发到我的邮箱",
    pinyin: "Qǐng bǎ bàojià fā dào wǒ de yóuxiāng",
    english: "Please send the quotation to my email",
    category: "Follow-up & Closing",
    context: "Requesting follow-up documentation after a meeting",
  },
  {
    id: "bs-23",
    chinese: "我回去跟团队商量一下",
    pinyin: "Wǒ huíqù gēn tuánduì shāngliang yīxià",
    english: "I'll go back and discuss with my team",
    category: "Follow-up & Closing",
    context: "Buying time before committing to a deal",
  },
  {
    id: "bs-24",
    chinese: "期待下次合作",
    pinyin: "Qīdài xià cì hézuò",
    english: "Looking forward to our next cooperation",
    category: "Follow-up & Closing",
    context: "Expressing intent for future business",
  },
  {
    id: "bs-25",
    chinese: "我们保持联系",
    pinyin: "Wǒmen bǎochí liánxì",
    english: "Let's stay in touch",
    category: "Follow-up & Closing",
    context: "Maintaining the relationship after a visit",
  },
];
