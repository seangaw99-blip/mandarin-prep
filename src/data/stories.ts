export interface StoryLine {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface Story {
  id: string;
  title: string;
  titlePinyin: string;
  level: 'hsk1' | 'hsk2' | 'hsk3';
  topic: string;
  wordCount: number;
  lines: StoryLine[];
}

export const stories: Story[] = [
  {
    id: 'story-001',
    title: '我的家',
    titlePinyin: 'Wǒ de jiā',
    level: 'hsk1',
    topic: 'Family & Home',
    wordCount: 52,
    lines: [
      { chinese: '我叫小明。', pinyin: 'Wǒ jiào Xiǎo Míng.', english: 'My name is Xiao Ming.' },
      { chinese: '我是中国人。', pinyin: 'Wǒ shì Zhōngguórén.', english: 'I am Chinese.' },
      { chinese: '我家有四个人。', pinyin: 'Wǒ jiā yǒu sì gè rén.', english: 'There are four people in my family.' },
      { chinese: '爸爸、妈妈、姐姐和我。', pinyin: 'Bàba, māma, jiějie hé wǒ.', english: 'Dad, mom, my older sister, and me.' },
      { chinese: '爸爸是老师。', pinyin: 'Bàba shì lǎoshī.', english: 'Dad is a teacher.' },
      { chinese: '妈妈是医生。', pinyin: 'Māma shì yīshēng.', english: 'Mom is a doctor.' },
      { chinese: '姐姐在大学学习。', pinyin: 'Jiějie zài dàxué xuéxí.', english: 'My older sister studies at university.' },
      { chinese: '我喜欢我的家。', pinyin: 'Wǒ xǐhuān wǒ de jiā.', english: 'I love my family.' },
    ],
  },
  {
    id: 'story-002',
    title: '今天的天气',
    titlePinyin: 'Jīntiān de tiānqì',
    level: 'hsk1',
    topic: 'Weather & Daily Life',
    wordCount: 58,
    lines: [
      { chinese: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', english: 'The weather is very nice today.' },
      { chinese: '太阳很大，不冷也不热。', pinyin: 'Tàiyáng hěn dà, bù lěng yě bù rè.', english: 'The sun is bright — not cold and not hot.' },
      { chinese: '我和朋友去公园。', pinyin: 'Wǒ hé péngyou qù gōngyuán.', english: 'I go to the park with a friend.' },
      { chinese: '公园里有很多树和花。', pinyin: 'Gōngyuán lǐ yǒu hěn duō shù hé huā.', english: 'There are many trees and flowers in the park.' },
      { chinese: '我们在公园喝茶。', pinyin: 'Wǒmen zài gōngyuán hē chá.', english: 'We drink tea in the park.' },
      { chinese: '我很开心。', pinyin: 'Wǒ hěn kāixīn.', english: 'I am very happy.' },
    ],
  },
  {
    id: 'story-003',
    title: '去餐厅吃饭',
    titlePinyin: 'Qù cāntīng chīfàn',
    level: 'hsk1',
    topic: 'Food & Restaurants',
    wordCount: 72,
    lines: [
      { chinese: '昨天，我和朋友去餐厅吃饭。', pinyin: 'Zuótiān, wǒ hé péngyou qù cāntīng chīfàn.', english: 'Yesterday, my friend and I went to a restaurant to eat.' },
      { chinese: '服务员说："你们好！请坐。"', pinyin: 'Fúwùyuán shuō: "Nǐmen hǎo! Qǐng zuò."', english: 'The waiter said: "Hello! Please sit down."' },
      { chinese: '我们看菜单。菜单上有很多菜。', pinyin: 'Wǒmen kàn càidān. Càidān shàng yǒu hěn duō cài.', english: 'We looked at the menu. There were many dishes on the menu.' },
      { chinese: '我要一碗米饭和一杯茶。', pinyin: 'Wǒ yào yī wǎn mǐfàn hé yī bēi chá.', english: 'I ordered a bowl of rice and a cup of tea.' },
      { chinese: '朋友要一碗面条。', pinyin: 'Péngyou yào yī wǎn miàntiáo.', english: 'My friend ordered a bowl of noodles.' },
      { chinese: '菜很好吃。我们都很高兴。', pinyin: 'Cài hěn hǎochī. Wǒmen dōu hěn gāoxìng.', english: 'The food was delicious. We were both very happy.' },
      { chinese: '多少钱？五十块。', pinyin: 'Duōshao qián? Wǔshí kuài.', english: 'How much? Fifty yuan.' },
    ],
  },
  {
    id: 'story-004',
    title: '学中文',
    titlePinyin: 'Xué Zhōngwén',
    level: 'hsk2',
    topic: 'Learning & Study',
    wordCount: 86,
    lines: [
      { chinese: '我开始学中文已经六个月了。', pinyin: 'Wǒ kāishǐ xué Zhōngwén yǐjīng liù gè yuè le.', english: 'I have been studying Chinese for six months already.' },
      { chinese: '刚开始的时候，中文很难。', pinyin: 'Gāng kāishǐ de shíhou, Zhōngwén hěn nán.', english: 'In the beginning, Chinese was very difficult.' },
      { chinese: '汉字特别难写。', pinyin: 'Hànzì tèbié nán xiě.', english: 'Chinese characters are especially hard to write.' },
      { chinese: '但是我每天都练习，慢慢就好了。', pinyin: 'Dànshì wǒ měitiān dōu liànxí, màn màn jiù hǎo le.', english: 'But I practice every day, and gradually it got better.' },
      { chinese: '现在我能看懂简单的中文。', pinyin: 'Xiànzài wǒ néng kàn dǒng jiǎndān de Zhōngwén.', english: 'Now I can understand simple Chinese.' },
      { chinese: '我也能和中国朋友用中文聊天。', pinyin: 'Wǒ yě néng hé Zhōngguó péngyou yòng Zhōngwén liáotiān.', english: 'I can also chat with Chinese friends in Chinese.' },
      { chinese: '学语言要有耐心，但是很有意思。', pinyin: 'Xué yǔyán yào yǒu nàixīn, dànshì hěn yǒu yìsi.', english: 'Learning a language requires patience, but it is very interesting.' },
    ],
  },
  {
    id: 'story-005',
    title: '在超市买东西',
    titlePinyin: 'Zài chāoshì mǎi dōngxi',
    level: 'hsk2',
    topic: 'Shopping',
    wordCount: 95,
    lines: [
      { chinese: '周末，我去超市买东西。', pinyin: 'Zhōumò, wǒ qù chāoshì mǎi dōngxi.', english: 'On the weekend, I went to the supermarket to buy things.' },
      { chinese: '超市里的东西很多，也很便宜。', pinyin: 'Chāoshì lǐ de dōngxi hěn duō, yě hěn piányí.', english: 'The supermarket has many items and they are quite cheap.' },
      { chinese: '我买了苹果、牛奶和面包。', pinyin: 'Wǒ mǎi le píngguǒ, niúnǎi hé miànbāo.', english: 'I bought apples, milk, and bread.' },
      { chinese: '我还想买一瓶果汁，可是找不到。', pinyin: 'Wǒ hái xiǎng mǎi yī píng guǒzhī, kěshì zhǎo bu dào.', english: 'I also wanted to buy a bottle of juice, but I couldn\'t find it.' },
      { chinese: '我问服务员："请问，果汁在哪里？"', pinyin: 'Wǒ wèn fúwùyuán: "Qǐngwèn, guǒzhī zài nǎlǐ?"', english: 'I asked the staff: "Excuse me, where is the juice?"' },
      { chinese: '她说："在那边，第三排。"', pinyin: 'Tā shuō: "Zài nàbiān, dì sān pái."', english: 'She said: "Over there, in the third aisle."' },
      { chinese: '我找到了果汁，然后去结账。', pinyin: 'Wǒ zhǎo dào le guǒzhī, rán hòu qù jiézhàng.', english: 'I found the juice, then went to pay.' },
      { chinese: '一共花了八十五块钱。', pinyin: 'Yīgòng huā le bāshíwǔ kuài qián.', english: 'I spent eighty-five yuan in total.' },
    ],
  },
  {
    id: 'story-006',
    title: '北京之旅',
    titlePinyin: 'Běijīng zhī lǚ',
    level: 'hsk3',
    topic: 'Travel & Culture',
    wordCount: 108,
    lines: [
      { chinese: '上个月，我去北京旅游了。', pinyin: 'Shàng gè yuè, wǒ qù Běijīng lǚyóu le.', english: 'Last month, I traveled to Beijing.' },
      { chinese: '北京是中国的首都，历史非常悠久。', pinyin: 'Běijīng shì Zhōngguó de shǒudū, lìshǐ fēicháng yōujiǔ.', english: 'Beijing is the capital of China and has a very long history.' },
      { chinese: '第一天，我去了天安门广场和故宫。', pinyin: 'Dì yī tiān, wǒ qù le Tiān\'ānmén guǎngchǎng hé Gùgōng.', english: 'On the first day, I visited Tiananmen Square and the Forbidden City.' },
      { chinese: '故宫很大，里面有很多古代的建筑。', pinyin: 'Gùgōng hěn dà, lǐmiàn yǒu hěn duō gǔdài de jiànzhú.', english: 'The Forbidden City is very large and has many ancient buildings inside.' },
      { chinese: '第二天，我爬了长城。', pinyin: 'Dì èr tiān, wǒ pá le Chángchéng.', english: 'On the second day, I climbed the Great Wall.' },
      { chinese: '虽然很累，但是风景非常美。', pinyin: 'Suīrán hěn lèi, dànshì fēngjǐng fēicháng měi.', english: 'Although it was very tiring, the scenery was absolutely beautiful.' },
      { chinese: '我还吃了正宗的北京烤鸭。', pinyin: 'Wǒ hái chī le zhèngzōng de Běijīng kǎoyā.', english: 'I also ate authentic Peking Duck.' },
      { chinese: '这次旅行让我对中国文化有了更深的了解。', pinyin: 'Zhè cì lǚxíng ràng wǒ duì Zhōngguó wénhuà yǒu le gèng shēn de liǎojiě.', english: 'This trip gave me a much deeper understanding of Chinese culture.' },
    ],
  },
];
