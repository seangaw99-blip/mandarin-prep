export type DialogueLine = {
  speaker: "A" | "B";
  chinese: string;
  pinyin: string;
  english: string;
};

export type Dialogue = {
  id: string;
  title: string;
  description: string;
  scenario: string;
  lines: DialogueLine[];
};

export const dialogues: Dialogue[] = [
  {
    id: "dlg-1",
    title: "Hotel Check-in",
    description: "Arriving at a hotel in China and checking in to your reserved room",
    scenario: "hotel",
    lines: [
      { speaker: "A", chinese: "你好，我有预订。", pinyin: "Nǐ hǎo, wǒ yǒu yùdìng.", english: "Hello, I have a reservation." },
      { speaker: "B", chinese: "好的，请问您贵姓？", pinyin: "Hǎo de, qǐngwèn nín guì xìng?", english: "Okay, may I ask your surname?" },
      { speaker: "A", chinese: "我姓…，预订了五个晚上。", pinyin: "Wǒ xìng..., yùdìng le wǔ gè wǎnshang.", english: "My surname is..., I booked five nights." },
      { speaker: "B", chinese: "找到了。请出示您的护照。", pinyin: "Zhǎo dào le. Qǐng chūshì nín de hùzhào.", english: "Found it. Please show your passport." },
      { speaker: "A", chinese: "给你。请问WiFi密码是什么？", pinyin: "Gěi nǐ. Qǐngwèn WiFi mìmǎ shì shénme?", english: "Here you go. What's the WiFi password?" },
      { speaker: "B", chinese: "WiFi密码在房卡上面。您的房间是812。", pinyin: "WiFi mìmǎ zài fáng kǎ shàngmiàn. Nín de fángjiān shì bā yāo èr.", english: "The WiFi password is on the room card. Your room is 812." },
      { speaker: "A", chinese: "请问早餐几点开始？", pinyin: "Qǐngwèn zǎocān jǐ diǎn kāishǐ?", english: "What time does breakfast start?" },
      { speaker: "B", chinese: "早餐是早上六点半到九点半，在二楼。", pinyin: "Zǎocān shì zǎoshang liù diǎn bàn dào jiǔ diǎn bàn, zài èr lóu.", english: "Breakfast is from 6:30 to 9:30 AM, on the second floor." },
      { speaker: "A", chinese: "好的，谢谢。电梯在哪里？", pinyin: "Hǎo de, xièxie. Diàntī zài nǎlǐ?", english: "Okay, thanks. Where is the elevator?" },
      { speaker: "B", chinese: "电梯在左边，走到头就看到了。祝您住得愉快！", pinyin: "Diàntī zài zuǒbiān, zǒu dào tóu jiù kàn dào le. Zhù nín zhù de yúkuài!", english: "The elevator is on the left, walk to the end and you'll see it. Have a pleasant stay!" },
    ],
  },
  {
    id: "dlg-2",
    title: "Ordering at a Restaurant",
    description: "Sitting down at a restaurant and ordering food and drinks",
    scenario: "restaurant",
    lines: [
      { speaker: "B", chinese: "欢迎光临！请问几位？", pinyin: "Huānyíng guānglín! Qǐngwèn jǐ wèi?", english: "Welcome! How many people?" },
      { speaker: "A", chinese: "两位。有没有英文菜单？", pinyin: "Liǎng wèi. Yǒu méiyǒu Yīngwén càidān?", english: "Two. Do you have an English menu?" },
      { speaker: "B", chinese: "不好意思，没有英文菜单。我帮您推荐吧。", pinyin: "Bù hǎo yìsi, méiyǒu Yīngwén càidān. Wǒ bāng nín tuījiàn ba.", english: "Sorry, no English menu. Let me recommend for you." },
      { speaker: "A", chinese: "好的，请推荐一下。不要太辣的。", pinyin: "Hǎo de, qǐng tuījiàn yīxià. Bù yào tài là de.", english: "Okay, please recommend something. Not too spicy." },
      { speaker: "B", chinese: "这个糖醋鱼很好吃，还有这个蘑菇鸡。", pinyin: "Zhège tángcù yú hěn hǎo chī, hái yǒu zhège mógū jī.", english: "This sweet and sour fish is delicious, and also this mushroom chicken." },
      { speaker: "A", chinese: "好，两个都要。再来一碗米饭和一瓶啤酒。", pinyin: "Hǎo, liǎng gè dōu yào. Zài lái yī wǎn mǐfàn hé yī píng píjiǔ.", english: "Good, I'll have both. Also a bowl of rice and a bottle of beer." },
      { speaker: "B", chinese: "好的，请稍等。", pinyin: "Hǎo de, qǐng shāo děng.", english: "Okay, please wait a moment." },
      { speaker: "A", chinese: "这个菜很好吃！", pinyin: "Zhège cài hěn hǎo chī!", english: "This dish is delicious!" },
      { speaker: "A", chinese: "服务员，买单。", pinyin: "Fúwùyuán, mǎi dān.", english: "Waiter, the bill please." },
      { speaker: "B", chinese: "一共一百二十八元。可以扫码支付。", pinyin: "Yīgòng yībǎi èrshíbā yuán. Kěyǐ sǎo mǎ zhīfù.", english: "128 yuan total. You can scan to pay." },
      { speaker: "A", chinese: "可以用微信支付吗？", pinyin: "Kěyǐ yòng Wēixìn zhīfù ma?", english: "Can I use WeChat Pay?" },
      { speaker: "B", chinese: "可以的，请扫这个二维码。", pinyin: "Kěyǐ de, qǐng sǎo zhège èrwéimǎ.", english: "Yes, please scan this QR code." },
    ],
  },
  {
    id: "dlg-3",
    title: "Taking a Taxi",
    description: "Getting a taxi from the hotel to a factory meeting",
    scenario: "taxi",
    lines: [
      { speaker: "A", chinese: "师傅，你好。请送我去这个地址。", pinyin: "Shīfu, nǐ hǎo. Qǐng sòng wǒ qù zhège dìzhǐ.", english: "Driver, hello. Please take me to this address." },
      { speaker: "B", chinese: "好的，我看一下。这个地方在开发区，大概四十分钟。", pinyin: "Hǎo de, wǒ kàn yīxià. Zhège dìfāng zài kāifāqū, dàgài sìshí fēnzhōng.", english: "Okay, let me look. This place is in the development zone, about 40 minutes." },
      { speaker: "A", chinese: "请打表。", pinyin: "Qǐng dǎ biǎo.", english: "Please use the meter." },
      { speaker: "B", chinese: "没问题。现在路上不太堵。", pinyin: "Méi wèntí. Xiànzài lù shàng bù tài dǔ.", english: "No problem. Traffic isn't too bad right now." },
      { speaker: "A", chinese: "好的，谢谢。我赶时间，九点有个会议。", pinyin: "Hǎo de, xièxie. Wǒ gǎn shíjiān, jiǔ diǎn yǒu gè huìyì.", english: "Okay, thanks. I'm in a hurry, I have a meeting at 9." },
      { speaker: "B", chinese: "放心吧，来得及。", pinyin: "Fàngxīn ba, lái de jí.", english: "Don't worry, we'll make it." },
      { speaker: "A", chinese: "到了吗？", pinyin: "Dào le ma?", english: "Are we there?" },
      { speaker: "B", chinese: "快到了，前面就是。", pinyin: "Kuài dào le, qiánmiàn jiù shì.", english: "Almost there, it's just ahead." },
      { speaker: "A", chinese: "请在这里停车。多少钱？", pinyin: "Qǐng zài zhèlǐ tíng chē. Duōshao qián?", english: "Please stop here. How much?" },
      { speaker: "B", chinese: "八十五块。", pinyin: "Bāshíwǔ kuài.", english: "85 yuan." },
      { speaker: "A", chinese: "可以用支付宝吗？请给我一张发票。", pinyin: "Kěyǐ yòng Zhīfùbǎo ma? Qǐng gěi wǒ yī zhāng fāpiào.", english: "Can I use Alipay? Please give me a receipt." },
      { speaker: "B", chinese: "可以。这是发票。", pinyin: "Kěyǐ. Zhè shì fāpiào.", english: "Yes. Here's the receipt." },
    ],
  },
  {
    id: "dlg-4",
    title: "Factory Introduction & Tour",
    description: "Arriving at a packaging factory for a tour and initial discussion",
    scenario: "factory",
    lines: [
      { speaker: "B", chinese: "欢迎欢迎！我是王经理。", pinyin: "Huānyíng huānyíng! Wǒ shì Wáng jīnglǐ.", english: "Welcome! I'm Manager Wang." },
      { speaker: "A", chinese: "你好，王经理。我是Sean，很高兴认识你。这是我的名片。", pinyin: "Nǐ hǎo, Wáng jīnglǐ. Wǒ shì Sean, hěn gāoxìng rènshi nǐ. Zhè shì wǒ de míngpiàn.", english: "Hello, Manager Wang. I'm Sean, nice to meet you. Here's my business card." },
      { speaker: "B", chinese: "谢谢。请先到会议室坐一下，喝杯茶。", pinyin: "Xièxie. Qǐng xiān dào huìyìshì zuò yīxià, hē bēi chá.", english: "Thank you. Please sit in the conference room first, have some tea." },
      { speaker: "A", chinese: "谢谢。你们工厂有多少条生产线？", pinyin: "Xièxie. Nǐmen gōngchǎng yǒu duōshao tiáo shēngchǎn xiàn?", english: "Thank you. How many production lines does your factory have?" },
      { speaker: "B", chinese: "我们有十二条生产线，年产量五千万平方米。", pinyin: "Wǒmen yǒu shí'èr tiáo shēngchǎn xiàn, nián chǎnliàng wǔqiān wàn píngfāng mǐ.", english: "We have 12 production lines, annual output of 50 million square meters." },
      { speaker: "A", chinese: "很好。你们做三层和五层瓦楞纸板吗？", pinyin: "Hěn hǎo. Nǐmen zuò sān céng hé wǔ céng wǎléng zhǐbǎn ma?", english: "Great. Do you make 3-ply and 5-ply corrugated board?" },
      { speaker: "B", chinese: "都做。我们也有柔印和胶印设备。我带你去车间看看。", pinyin: "Dōu zuò. Wǒmen yě yǒu róuyìn hé jiāoyìn shèbèi. Wǒ dài nǐ qù chējiān kàn kan.", english: "Both. We also have flexo and offset equipment. Let me take you to the workshop." },
      { speaker: "A", chinese: "这是模切机吗？是什么品牌的？", pinyin: "Zhè shì mòqiē jī ma? Shì shénme pǐnpái de?", english: "Is this the die-cutting machine? What brand is it?" },
      { speaker: "B", chinese: "对，这是日本进口的模切机，精度非常高。", pinyin: "Duì, zhè shì Rìběn jìnkǒu de mòqiē jī, jīngdù fēicháng gāo.", english: "Yes, this is a Japanese imported die-cutter, very high precision." },
      { speaker: "A", chinese: "印刷质量看起来很好。可以拍照吗？", pinyin: "Yìnshuā zhìliàng kàn qǐlái hěn hǎo. Kěyǐ pāizhào ma?", english: "The print quality looks great. Can I take photos?" },
      { speaker: "B", chinese: "可以，没问题。我们回会议室谈一下合作的事情吧。", pinyin: "Kěyǐ, méi wèntí. Wǒmen huí huìyìshì tán yīxià hézuò de shìqing ba.", english: "Sure, no problem. Let's go back to the conference room to discuss cooperation." },
    ],
  },
  {
    id: "dlg-5",
    title: "Price Negotiation with Supplier",
    description: "Negotiating pricing, MOQ, and terms with a packaging supplier",
    scenario: "negotiation",
    lines: [
      { speaker: "A", chinese: "王经理，可以给我报个价吗？这个规格的纸箱。", pinyin: "Wáng jīnglǐ, kěyǐ gěi wǒ bào gè jià ma? Zhège guīgé de zhǐxiāng.", english: "Manager Wang, can you quote me a price? For this spec of carton." },
      { speaker: "B", chinese: "这个规格的话，单价是三块五一个。", pinyin: "Zhège guīgé dehuà, dān jià shì sān kuài wǔ yī gè.", english: "For this spec, the unit price is 3.5 yuan each." },
      { speaker: "A", chinese: "最低起订量是多少？", pinyin: "Zuìdī qǐ dìng liàng shì duōshao?", english: "What's the minimum order quantity?" },
      { speaker: "B", chinese: "一万个起订。", pinyin: "Yī wàn gè qǐ dìng.", english: "Minimum 10,000 pieces." },
      { speaker: "A", chinese: "如果订单量大，价格能优惠吗？比如五万个。", pinyin: "Rúguǒ dìngdān liàng dà, jiàgé néng yōuhuì ma? Bǐrú wǔ wàn gè.", english: "If the order is large, can we get a discount? Like 50,000 pieces." },
      { speaker: "B", chinese: "五万个的话，可以给你三块二。", pinyin: "Wǔ wàn gè dehuà, kěyǐ gěi nǐ sān kuài èr.", english: "For 50,000 pieces, we can do 3.2 yuan." },
      { speaker: "A", chinese: "还是有点贵。能不能三块？我们想建立长期合作。", pinyin: "Háishì yǒudiǎn guì. Néng bù néng sān kuài? Wǒmen xiǎng jiànlì chángqī hézuò.", english: "Still a bit expensive. Can we do 3? We want to build a long-term partnership." },
      { speaker: "B", chinese: "三块的话很难。最低三块一，这已经是最好的价格了。", pinyin: "Sān kuài dehuà hěn nán. Zuìdī sān kuài yī, zhè yǐjīng shì zuì hǎo de jiàgé le.", english: "3 yuan is tough. Minimum 3.1, this is already the best price." },
      { speaker: "A", chinese: "好吧，三块一可以。交货期多长时间？", pinyin: "Hǎo ba, sān kuài yī kěyǐ. Jiāohuò qī duō cháng shíjiān?", english: "Okay, 3.1 works. What's the delivery lead time?" },
      { speaker: "B", chinese: "正常是十五到二十天。", pinyin: "Zhèngcháng shì shíwǔ dào èrshí tiān.", english: "Normally 15 to 20 days." },
      { speaker: "A", chinese: "好的。我们可以先签一个试订单。", pinyin: "Hǎo de. Wǒmen kěyǐ xiān qiān yī gè shì dìngdān.", english: "Okay. We can start with a trial order." },
      { speaker: "B", chinese: "没问题。希望我们合作愉快！", pinyin: "Méi wèntí. Xīwàng wǒmen hézuò yúkuài!", english: "No problem. Hope we have a pleasant cooperation!" },
    ],
  },
  {
    id: "dlg-6",
    title: "Emergency - Feeling Sick",
    description: "Not feeling well and getting help to see a doctor",
    scenario: "emergency",
    lines: [
      { speaker: "A", chinese: "你好，我不舒服，需要帮助。", pinyin: "Nǐ hǎo, wǒ bù shūfu, xūyào bāngzhù.", english: "Hello, I don't feel well, I need help." },
      { speaker: "B", chinese: "您怎么了？哪里不舒服？", pinyin: "Nín zěnme le? Nǎlǐ bù shūfu?", english: "What's wrong? Where do you feel unwell?" },
      { speaker: "A", chinese: "我肚子疼，而且头疼。", pinyin: "Wǒ dùzi téng, érqiě tóu téng.", english: "My stomach hurts, and I have a headache." },
      { speaker: "B", chinese: "您吃了什么？有没有发烧？", pinyin: "Nín chī le shénme? Yǒu méiyǒu fāshāo?", english: "What did you eat? Do you have a fever?" },
      { speaker: "A", chinese: "昨天吃了海鲜。我不知道有没有发烧。", pinyin: "Zuótiān chī le hǎixiān. Wǒ bù zhīdào yǒu méiyǒu fāshāo.", english: "I ate seafood yesterday. I don't know if I have a fever." },
      { speaker: "B", chinese: "我帮您叫一辆出租车去医院吧。", pinyin: "Wǒ bāng nín jiào yī liàng chūzūchē qù yīyuàn ba.", english: "Let me call a taxi to take you to the hospital." },
      { speaker: "A", chinese: "好的，谢谢。最近的医院在哪里？", pinyin: "Hǎo de, xièxie. Zuìjìn de yīyuàn zài nǎlǐ?", english: "Okay, thanks. Where is the nearest hospital?" },
      { speaker: "B", chinese: "人民医院很近，开车十分钟。", pinyin: "Rénmín yīyuàn hěn jìn, kāi chē shí fēnzhōng.", english: "People's Hospital is close, 10 minutes by car." },
      { speaker: "A", chinese: "我有药物过敏，对青霉素过敏。", pinyin: "Wǒ yǒu yàowù guòmǐn, duì qīngméisù guòmǐn.", english: "I have a drug allergy, I'm allergic to penicillin." },
      { speaker: "B", chinese: "好的，到了医院要跟医生说。我陪您去。", pinyin: "Hǎo de, dào le yīyuàn yào gēn yīshēng shuō. Wǒ péi nín qù.", english: "Okay, tell the doctor when you get there. I'll go with you." },
      { speaker: "A", chinese: "太感谢了。我住在这个酒店，这是酒店的地址。", pinyin: "Tài gǎnxiè le. Wǒ zhù zài zhège jiǔdiàn, zhè shì jiǔdiàn de dìzhǐ.", english: "Thank you so much. I'm staying at this hotel, here's the hotel address." },
    ],
  },
];
