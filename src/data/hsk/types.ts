export interface HskWord {
  id: string;
  simplified: string;
  pinyin: string;
  english: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  partOfSpeech: string;
  exampleSentence: string;
  examplePinyin: string;
  exampleEnglish: string;
}
