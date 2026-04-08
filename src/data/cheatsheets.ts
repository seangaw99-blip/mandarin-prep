export type CheatPhrase = {
  chinese: string;
  pinyin: string;
  english: string;
};

export type CheatSheet = {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  phrases: CheatPhrase[];
};

export const cheatsheets: CheatSheet[] = [
  {
    id: "cs-restaurant",
    title: "Restaurant",
    icon: "🍜",
    description: "Ordering food, allergies, and paying the bill",
    color: "bg-orange-500",
    phrases: [
      { chinese: "我要点菜", pinyin: "Wǒ yào diǎn cài", english: "I'd like to order" },
      { chinese: "请推荐一下", pinyin: "Qǐng tuījiàn yīxià", english: "Please recommend something" },
      { chinese: "不要太辣", pinyin: "Bù yào tài là", english: "Not too spicy" },
      { chinese: "我对花生过敏", pinyin: "Wǒ duì huāshēng guòmǐn", english: "I'm allergic to peanuts" },
      { chinese: "不要放味精", pinyin: "Bù yào fàng wèijīng", english: "No MSG please" },
      { chinese: "我不吃猪肉", pinyin: "Wǒ bù chī zhūròu", english: "I don't eat pork" },
      { chinese: "来一瓶啤酒", pinyin: "Lái yī píng píjiǔ", english: "One beer please" },
      { chinese: "一碗米饭", pinyin: "Yī wǎn mǐfàn", english: "One bowl of rice" },
      { chinese: "很好吃！", pinyin: "Hěn hǎo chī!", english: "Delicious!" },
      { chinese: "买单", pinyin: "Mǎi dān", english: "Bill please" },
      { chinese: "可以用微信支付吗？", pinyin: "Kěyǐ yòng Wēixìn zhīfù ma?", english: "Can I use WeChat Pay?" },
      { chinese: "可以打包吗？", pinyin: "Kěyǐ dǎbāo ma?", english: "Can I get this to go?" },
    ],
  },
  {
    id: "cs-taxi",
    title: "Taxi",
    icon: "🚕",
    description: "Destination, meter, directions, and paying",
    color: "bg-yellow-500",
    phrases: [
      { chinese: "请送我去这个地址", pinyin: "Qǐng sòng wǒ qù zhège dìzhǐ", english: "Take me to this address" },
      { chinese: "请打表", pinyin: "Qǐng dǎ biǎo", english: "Use the meter please" },
      { chinese: "左转", pinyin: "Zuǒ zhuǎn", english: "Turn left" },
      { chinese: "右转", pinyin: "Yòu zhuǎn", english: "Turn right" },
      { chinese: "直走", pinyin: "Zhí zǒu", english: "Go straight" },
      { chinese: "请在这里停车", pinyin: "Qǐng zài zhèlǐ tíng chē", english: "Stop here please" },
      { chinese: "多少钱？", pinyin: "Duōshao qián?", english: "How much?" },
      { chinese: "大概要多长时间？", pinyin: "Dàgài yào duō cháng shíjiān?", english: "How long will it take?" },
      { chinese: "我赶时间", pinyin: "Wǒ gǎn shíjiān", english: "I'm in a hurry" },
      { chinese: "请给我一张发票", pinyin: "Qǐng gěi wǒ yī zhāng fāpiào", english: "Give me a receipt please" },
    ],
  },
  {
    id: "cs-hotel",
    title: "Hotel",
    icon: "🏨",
    description: "Reservation, WiFi, room issues, and checkout",
    color: "bg-blue-500",
    phrases: [
      { chinese: "我有预订", pinyin: "Wǒ yǒu yùdìng", english: "I have a reservation" },
      { chinese: "我要办理入住", pinyin: "Wǒ yào bànlǐ rùzhù", english: "Check in please" },
      { chinese: "WiFi密码是什么？", pinyin: "WiFi mìmǎ shì shénme?", english: "WiFi password?" },
      { chinese: "我的房间号是…", pinyin: "Wǒ de fángjiān hào shì...", english: "My room number is..." },
      { chinese: "空调不工作了", pinyin: "Kōngtiáo bù gōngzuò le", english: "AC isn't working" },
      { chinese: "热水不够热", pinyin: "Rè shuǐ bù gòu rè", english: "Hot water isn't hot enough" },
      { chinese: "请帮我叫一辆出租车", pinyin: "Qǐng bāng wǒ jiào yī liàng chūzūchē", english: "Call me a taxi please" },
      { chinese: "早餐几点？", pinyin: "Zǎocān jǐ diǎn?", english: "What time is breakfast?" },
      { chinese: "我要退房", pinyin: "Wǒ yào tuì fáng", english: "Check out please" },
      { chinese: "可以延迟退房吗？", pinyin: "Kěyǐ yánchí tuì fáng ma?", english: "Late checkout?" },
    ],
  },
  {
    id: "cs-emergency",
    title: "Emergency",
    icon: "🆘",
    description: "Help, doctor, police, and hotel address",
    color: "bg-red-500",
    phrases: [
      { chinese: "救命！", pinyin: "Jiùmìng!", english: "HELP!" },
      { chinese: "请帮帮我", pinyin: "Qǐng bāng bāng wǒ", english: "Please help me" },
      { chinese: "请叫救护车", pinyin: "Qǐng jiào jiùhùchē", english: "Call an ambulance" },
      { chinese: "请报警", pinyin: "Qǐng bàojǐng", english: "Call the police" },
      { chinese: "我需要看医生", pinyin: "Wǒ xūyào kàn yīshēng", english: "I need a doctor" },
      { chinese: "我不舒服", pinyin: "Wǒ bù shūfu", english: "I feel sick" },
      { chinese: "请送我去医院", pinyin: "Qǐng sòng wǒ qù yīyuàn", english: "Take me to the hospital" },
      { chinese: "我住在这个酒店", pinyin: "Wǒ zhù zài zhège jiǔdiàn", english: "I'm staying at this hotel" },
      { chinese: "我的护照丢了", pinyin: "Wǒ de hùzhào diū le", english: "I lost my passport" },
      { chinese: "我迷路了", pinyin: "Wǒ mílù le", english: "I'm lost" },
      { chinese: "药房在哪里？", pinyin: "Yàofáng zài nǎlǐ?", english: "Where is a pharmacy?" },
      { chinese: "我听不懂，请写下来", pinyin: "Wǒ tīng bù dǒng, qǐng xiě xiàlái", english: "I don't understand, write it down" },
    ],
  },
  {
    id: "cs-factory",
    title: "Factory Visit",
    icon: "🏭",
    description: "Introduction, product discussion, and touring",
    color: "bg-slate-600",
    phrases: [
      { chinese: "很高兴参观你们的工厂", pinyin: "Hěn gāoxìng cānguān nǐmen de gōngchǎng", english: "Pleased to visit your factory" },
      { chinese: "这是我的名片", pinyin: "Zhè shì wǒ de míngpiàn", english: "Here is my business card" },
      { chinese: "我们公司做纸箱加工", pinyin: "Wǒmen gōngsī zuò zhǐxiāng jiāgōng", english: "Our company does box converting" },
      { chinese: "可以看一下样品吗？", pinyin: "Kěyǐ kàn yīxià yàngpǐn ma?", english: "Can I see samples?" },
      { chinese: "这条生产线的产能是多少？", pinyin: "Zhè tiáo shēngchǎn xiàn de chǎnnéng shì duōshao?", english: "What is this line's capacity?" },
      { chinese: "你们做柔印还是胶印？", pinyin: "Nǐmen zuò róuyìn háishì jiāoyìn?", english: "Flexo or offset printing?" },
      { chinese: "可以拍照吗？", pinyin: "Kěyǐ pāizhào ma?", english: "Can I take photos?" },
      { chinese: "你们有ISO认证吗？", pinyin: "Nǐmen yǒu ISO rènzhèng ma?", english: "Do you have ISO certification?" },
      { chinese: "印刷质量很好", pinyin: "Yìnshuā zhìliàng hěn hǎo", english: "Print quality is great" },
      { chinese: "感谢你们的热情接待", pinyin: "Gǎnxiè nǐmen de rèqíng jiēdài", english: "Thanks for the warm hospitality" },
    ],
  },
  {
    id: "cs-numbers",
    title: "Numbers & Money",
    icon: "💰",
    description: "Quick reference for counting and haggling",
    color: "bg-green-500",
    phrases: [
      { chinese: "一 二 三 四 五", pinyin: "yī èr sān sì wǔ", english: "1 2 3 4 5" },
      { chinese: "六 七 八 九 十", pinyin: "liù qī bā jiǔ shí", english: "6 7 8 9 10" },
      { chinese: "二十 / 三十 / 五十", pinyin: "èrshí / sānshí / wǔshí", english: "20 / 30 / 50" },
      { chinese: "一百 / 一千 / 一万", pinyin: "yībǎi / yīqiān / yīwàn", english: "100 / 1,000 / 10,000" },
      { chinese: "多少钱？", pinyin: "Duōshao qián?", english: "How much?" },
      { chinese: "太贵了", pinyin: "Tài guì le", english: "Too expensive" },
      { chinese: "便宜一点", pinyin: "Piányi yīdiǎn", english: "Cheaper please" },
      { chinese: "打折", pinyin: "Dǎ zhé", english: "Discount" },
      { chinese: "块 (元)", pinyin: "kuài (yuán)", english: "Yuan (currency unit)" },
      { chinese: "可以便宜多少？", pinyin: "Kěyǐ piányi duōshao?", english: "How much cheaper can it be?" },
    ],
  },
];
