export interface DrillSentence {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  level: 'beginner' | 'hsk1' | 'hsk2';
}

export const DRILL_SENTENCES: DrillSentence[] = [
  // Beginner
  { id: 'drill-001', chinese: '你好。', pinyin: 'Nǐ hǎo.', english: 'Hello.', level: 'beginner' },
  { id: 'drill-002', chinese: '谢谢。', pinyin: 'Xièxiè.', english: 'Thank you.', level: 'beginner' },
  { id: 'drill-003', chinese: '对不起。', pinyin: 'Duìbuqǐ.', english: 'Sorry.', level: 'beginner' },
  { id: 'drill-004', chinese: '再见。', pinyin: 'Zàijiàn.', english: 'Goodbye.', level: 'beginner' },
  { id: 'drill-005', chinese: '我叫李明。', pinyin: 'Wǒ jiào Lǐ Míng.', english: 'My name is Li Ming.', level: 'beginner' },
  { id: 'drill-006', chinese: '你好吗？', pinyin: 'Nǐ hǎo ma?', english: 'How are you?', level: 'beginner' },
  { id: 'drill-007', chinese: '我很好。', pinyin: 'Wǒ hěn hǎo.', english: 'I am fine.', level: 'beginner' },
  { id: 'drill-008', chinese: '这是什么？', pinyin: 'Zhè shì shénme?', english: 'What is this?', level: 'beginner' },
  { id: 'drill-009', chinese: '多少钱？', pinyin: 'Duōshao qián?', english: 'How much does it cost?', level: 'beginner' },
  { id: 'drill-010', chinese: '我是老师。', pinyin: 'Wǒ shì lǎoshī.', english: 'I am a teacher.', level: 'beginner' },
  { id: 'drill-011', chinese: '他是学生。', pinyin: 'Tā shì xuéshēng.', english: 'He is a student.', level: 'beginner' },
  { id: 'drill-012', chinese: '我喜欢喝茶。', pinyin: 'Wǒ xǐhuān hē chá.', english: 'I like to drink tea.', level: 'beginner' },

  // HSK 1
  { id: 'drill-013', chinese: '我想吃米饭。', pinyin: 'Wǒ xiǎng chī mǐfàn.', english: 'I want to eat rice.', level: 'hsk1' },
  { id: 'drill-014', chinese: '你家在哪里？', pinyin: 'Nǐ jiā zài nǎlǐ?', english: 'Where is your home?', level: 'hsk1' },
  { id: 'drill-015', chinese: '我有一个哥哥。', pinyin: 'Wǒ yǒu yī gè gēgē.', english: 'I have an older brother.', level: 'hsk1' },
  { id: 'drill-016', chinese: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', english: 'The weather is very nice today.', level: 'hsk1' },
  { id: 'drill-017', chinese: '我不喝咖啡。', pinyin: 'Wǒ bù hē kāfēi.', english: 'I don\'t drink coffee.', level: 'hsk1' },
  { id: 'drill-018', chinese: '请问，洗手间在哪儿？', pinyin: 'Qǐngwèn, xǐshǒujiān zài nǎr?', english: 'Excuse me, where is the restroom?', level: 'hsk1' },
  { id: 'drill-019', chinese: '我们去吃饭吧。', pinyin: 'Wǒmen qù chīfàn ba.', english: 'Let\'s go eat.', level: 'hsk1' },
  { id: 'drill-020', chinese: '这个苹果很甜。', pinyin: 'Zhège píngguǒ hěn tián.', english: 'This apple is very sweet.', level: 'hsk1' },
  { id: 'drill-021', chinese: '他的中文说得很好。', pinyin: 'Tā de Zhōngwén shuō de hěn hǎo.', english: 'He speaks Chinese very well.', level: 'hsk1' },
  { id: 'drill-022', chinese: '我每天学习两个小时。', pinyin: 'Wǒ měitiān xuéxí liǎng gè xiǎoshí.', english: 'I study for two hours every day.', level: 'hsk1' },
  { id: 'drill-023', chinese: '你几岁了？', pinyin: 'Nǐ jǐ suì le?', english: 'How old are you?', level: 'hsk1' },
  { id: 'drill-024', chinese: '我喜欢看书和听音乐。', pinyin: 'Wǒ xǐhuān kàn shū hé tīng yīnyuè.', english: 'I like reading books and listening to music.', level: 'hsk1' },

  // HSK 2
  { id: 'drill-025', chinese: '我已经吃过了。', pinyin: 'Wǒ yǐjīng chī guò le.', english: 'I have already eaten.', level: 'hsk2' },
  { id: 'drill-026', chinese: '他比我高一点儿。', pinyin: 'Tā bǐ wǒ gāo yīdiǎnr.', english: 'He is a little taller than me.', level: 'hsk2' },
  { id: 'drill-027', chinese: '她正在看电视。', pinyin: 'Tā zhèngzài kàn diànshì.', english: 'She is watching TV right now.', level: 'hsk2' },
  { id: 'drill-028', chinese: '我把书放在桌子上了。', pinyin: 'Wǒ bǎ shū fàng zài zhuōzi shàng le.', english: 'I put the book on the table.', level: 'hsk2' },
  { id: 'drill-029', chinese: '天气越来越冷了。', pinyin: 'Tiānqì yuè lái yuè lěng le.', english: 'The weather is getting colder and colder.', level: 'hsk2' },
  { id: 'drill-030', chinese: '你能帮我一个忙吗？', pinyin: 'Nǐ néng bāng wǒ yī gè máng ma?', english: 'Can you do me a favor?', level: 'hsk2' },
  { id: 'drill-031', chinese: '我从北京来，你呢？', pinyin: 'Wǒ cóng Běijīng lái, nǐ ne?', english: 'I\'m from Beijing, and you?', level: 'hsk2' },
  { id: 'drill-032', chinese: '这件衣服比那件贵。', pinyin: 'Zhè jiàn yīfu bǐ nà jiàn guì.', english: 'This piece of clothing is more expensive than that one.', level: 'hsk2' },
  { id: 'drill-033', chinese: '我去年去过中国。', pinyin: 'Wǒ qùnián qù guò Zhōngguó.', english: 'I have been to China before (last year).', level: 'hsk2' },
  { id: 'drill-034', chinese: '他们已经结婚了。', pinyin: 'Tāmen yǐjīng jiéhūn le.', english: 'They are already married.', level: 'hsk2' },
  { id: 'drill-035', chinese: '如果你有时间，我们一起去吧。', pinyin: 'Rúguǒ nǐ yǒu shíjiān, wǒmen yīqǐ qù ba.', english: 'If you have time, let\'s go together.', level: 'hsk2' },
  { id: 'drill-036', chinese: '虽然很贵，但是质量很好。', pinyin: 'Suīrán hěn guì, dànshì zhìliàng hěn hǎo.', english: 'Although it\'s expensive, the quality is very good.', level: 'hsk2' },
];
