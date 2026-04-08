export type Flashcard = {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  category: string;
};

export const flashcards: Flashcard[] = [
  // === Basic Greetings and Pleasantries (10) ===
  { id: "fc-1", chinese: "你好", pinyin: "nǐ hǎo", english: "Hello", category: "greetings" },
  { id: "fc-2", chinese: "谢谢", pinyin: "xièxie", english: "Thank you", category: "greetings" },
  { id: "fc-3", chinese: "不客气", pinyin: "bù kèqi", english: "You're welcome", category: "greetings" },
  { id: "fc-4", chinese: "对不起", pinyin: "duìbuqǐ", english: "Sorry / Excuse me", category: "greetings" },
  { id: "fc-5", chinese: "没关系", pinyin: "méi guānxi", english: "It's okay / No problem", category: "greetings" },
  { id: "fc-6", chinese: "再见", pinyin: "zàijiàn", english: "Goodbye", category: "greetings" },
  { id: "fc-7", chinese: "请", pinyin: "qǐng", english: "Please", category: "greetings" },
  { id: "fc-8", chinese: "你好吗？", pinyin: "nǐ hǎo ma?", english: "How are you?", category: "greetings" },
  { id: "fc-9", chinese: "早上好", pinyin: "zǎoshang hǎo", english: "Good morning", category: "greetings" },
  { id: "fc-10", chinese: "晚安", pinyin: "wǎn'ān", english: "Good night", category: "greetings" },

  // === Numbers and Money (15) ===
  { id: "fc-11", chinese: "一", pinyin: "yī", english: "One (1)", category: "numbers" },
  { id: "fc-12", chinese: "二", pinyin: "èr", english: "Two (2)", category: "numbers" },
  { id: "fc-13", chinese: "三", pinyin: "sān", english: "Three (3)", category: "numbers" },
  { id: "fc-14", chinese: "四", pinyin: "sì", english: "Four (4)", category: "numbers" },
  { id: "fc-15", chinese: "五", pinyin: "wǔ", english: "Five (5)", category: "numbers" },
  { id: "fc-16", chinese: "六", pinyin: "liù", english: "Six (6)", category: "numbers" },
  { id: "fc-17", chinese: "七", pinyin: "qī", english: "Seven (7)", category: "numbers" },
  { id: "fc-18", chinese: "八", pinyin: "bā", english: "Eight (8)", category: "numbers" },
  { id: "fc-19", chinese: "九", pinyin: "jiǔ", english: "Nine (9)", category: "numbers" },
  { id: "fc-20", chinese: "十", pinyin: "shí", english: "Ten (10)", category: "numbers" },
  { id: "fc-21", chinese: "百", pinyin: "bǎi", english: "Hundred (100)", category: "numbers" },
  { id: "fc-22", chinese: "千", pinyin: "qiān", english: "Thousand (1,000)", category: "numbers" },
  { id: "fc-23", chinese: "万", pinyin: "wàn", english: "Ten thousand (10,000)", category: "numbers" },
  { id: "fc-24", chinese: "多少钱？", pinyin: "duōshao qián?", english: "How much money?", category: "numbers" },
  { id: "fc-25", chinese: "块 / 元", pinyin: "kuài / yuán", english: "Yuan (unit of currency)", category: "numbers" },

  // === Shopping and Prices - Lesson 7 (10) ===
  { id: "fc-26", chinese: "太贵了", pinyin: "tài guì le", english: "Too expensive", category: "shopping" },
  { id: "fc-27", chinese: "便宜一点", pinyin: "piányi yīdiǎn", english: "A little cheaper", category: "shopping" },
  { id: "fc-28", chinese: "我要这个", pinyin: "wǒ yào zhège", english: "I want this one", category: "shopping" },
  { id: "fc-29", chinese: "可以试一下吗？", pinyin: "kěyǐ shì yīxià ma?", english: "Can I try it?", category: "shopping" },
  { id: "fc-30", chinese: "有没有别的颜色？", pinyin: "yǒu méiyǒu bié de yánsè?", english: "Do you have other colors?", category: "shopping" },
  { id: "fc-31", chinese: "大号", pinyin: "dà hào", english: "Large size", category: "shopping" },
  { id: "fc-32", chinese: "小号", pinyin: "xiǎo hào", english: "Small size", category: "shopping" },
  { id: "fc-33", chinese: "打折", pinyin: "dǎ zhé", english: "On sale / Discount", category: "shopping" },
  { id: "fc-34", chinese: "收据", pinyin: "shōujù", english: "Receipt", category: "shopping" },
  { id: "fc-35", chinese: "可以刷卡吗？", pinyin: "kěyǐ shuā kǎ ma?", english: "Can I pay by card?", category: "shopping" },

  // === Directions - Lesson 8 (10) ===
  { id: "fc-36", chinese: "在哪里？", pinyin: "zài nǎlǐ?", english: "Where is it?", category: "directions" },
  { id: "fc-37", chinese: "左边", pinyin: "zuǒbiān", english: "Left side", category: "directions" },
  { id: "fc-38", chinese: "右边", pinyin: "yòubiān", english: "Right side", category: "directions" },
  { id: "fc-39", chinese: "前面", pinyin: "qiánmiàn", english: "In front / Ahead", category: "directions" },
  { id: "fc-40", chinese: "后面", pinyin: "hòumiàn", english: "Behind / Back", category: "directions" },
  { id: "fc-41", chinese: "对面", pinyin: "duìmiàn", english: "Opposite / Across", category: "directions" },
  { id: "fc-42", chinese: "旁边", pinyin: "pángbiān", english: "Next to / Beside", category: "directions" },
  { id: "fc-43", chinese: "远", pinyin: "yuǎn", english: "Far", category: "directions" },
  { id: "fc-44", chinese: "近", pinyin: "jìn", english: "Near / Close", category: "directions" },
  { id: "fc-45", chinese: "一直走", pinyin: "yīzhí zǒu", english: "Go straight", category: "directions" },

  // === Food and Drinks (15) ===
  { id: "fc-46", chinese: "水", pinyin: "shuǐ", english: "Water", category: "food" },
  { id: "fc-47", chinese: "茶", pinyin: "chá", english: "Tea", category: "food" },
  { id: "fc-48", chinese: "咖啡", pinyin: "kāfēi", english: "Coffee", category: "food" },
  { id: "fc-49", chinese: "啤酒", pinyin: "píjiǔ", english: "Beer", category: "food" },
  { id: "fc-50", chinese: "米饭", pinyin: "mǐfàn", english: "Rice", category: "food" },
  { id: "fc-51", chinese: "面条", pinyin: "miàntiáo", english: "Noodles", category: "food" },
  { id: "fc-52", chinese: "饺子", pinyin: "jiǎozi", english: "Dumplings", category: "food" },
  { id: "fc-53", chinese: "鸡肉", pinyin: "jīròu", english: "Chicken", category: "food" },
  { id: "fc-54", chinese: "牛肉", pinyin: "niúròu", english: "Beef", category: "food" },
  { id: "fc-55", chinese: "猪肉", pinyin: "zhūròu", english: "Pork", category: "food" },
  { id: "fc-56", chinese: "鱼", pinyin: "yú", english: "Fish", category: "food" },
  { id: "fc-57", chinese: "蔬菜", pinyin: "shūcài", english: "Vegetables", category: "food" },
  { id: "fc-58", chinese: "水果", pinyin: "shuǐguǒ", english: "Fruit", category: "food" },
  { id: "fc-59", chinese: "辣", pinyin: "là", english: "Spicy", category: "food" },
  { id: "fc-60", chinese: "甜", pinyin: "tián", english: "Sweet", category: "food" },

  // === Business / Packaging Terms (20) ===
  { id: "fc-61", chinese: "公司", pinyin: "gōngsī", english: "Company", category: "business" },
  { id: "fc-62", chinese: "工厂", pinyin: "gōngchǎng", english: "Factory", category: "business" },
  { id: "fc-63", chinese: "供应商", pinyin: "gōngyìngshāng", english: "Supplier", category: "business" },
  { id: "fc-64", chinese: "客户", pinyin: "kèhù", english: "Customer / Client", category: "business" },
  { id: "fc-65", chinese: "价格", pinyin: "jiàgé", english: "Price", category: "business" },
  { id: "fc-66", chinese: "合同", pinyin: "hétóng", english: "Contract", category: "business" },
  { id: "fc-67", chinese: "发票", pinyin: "fāpiào", english: "Invoice / Receipt", category: "business" },
  { id: "fc-68", chinese: "名片", pinyin: "míngpiàn", english: "Business card", category: "business" },
  { id: "fc-69", chinese: "会议", pinyin: "huìyì", english: "Meeting", category: "business" },
  { id: "fc-70", chinese: "纸箱", pinyin: "zhǐxiāng", english: "Carton / Box", category: "business" },
  { id: "fc-71", chinese: "瓦楞纸", pinyin: "wǎléngzhǐ", english: "Corrugated paper", category: "business" },
  { id: "fc-72", chinese: "印刷", pinyin: "yìnshuā", english: "Printing", category: "business" },
  { id: "fc-73", chinese: "模切", pinyin: "mòqiē", english: "Die-cutting", category: "business" },
  { id: "fc-74", chinese: "样品", pinyin: "yàngpǐn", english: "Sample", category: "business" },
  { id: "fc-75", chinese: "质量", pinyin: "zhìliàng", english: "Quality", category: "business" },
  { id: "fc-76", chinese: "订单", pinyin: "dìngdān", english: "Order", category: "business" },
  { id: "fc-77", chinese: "报价", pinyin: "bàojià", english: "Quotation / Quote", category: "business" },
  { id: "fc-78", chinese: "生产", pinyin: "shēngchǎn", english: "Production", category: "business" },
  { id: "fc-79", chinese: "出口", pinyin: "chūkǒu", english: "Export", category: "business" },
  { id: "fc-80", chinese: "进口", pinyin: "jìnkǒu", english: "Import", category: "business" },

  // === Travel Essentials (10) ===
  { id: "fc-81", chinese: "酒店", pinyin: "jiǔdiàn", english: "Hotel", category: "travel" },
  { id: "fc-82", chinese: "机场", pinyin: "jīchǎng", english: "Airport", category: "travel" },
  { id: "fc-83", chinese: "出租车", pinyin: "chūzūchē", english: "Taxi", category: "travel" },
  { id: "fc-84", chinese: "地铁", pinyin: "dìtiě", english: "Subway", category: "travel" },
  { id: "fc-85", chinese: "护照", pinyin: "hùzhào", english: "Passport", category: "travel" },
  { id: "fc-86", chinese: "签证", pinyin: "qiānzhèng", english: "Visa", category: "travel" },
  { id: "fc-87", chinese: "行李", pinyin: "xínglǐ", english: "Luggage", category: "travel" },
  { id: "fc-88", chinese: "厕所", pinyin: "cèsuǒ", english: "Restroom / Toilet", category: "travel" },
  { id: "fc-89", chinese: "地图", pinyin: "dìtú", english: "Map", category: "travel" },
  { id: "fc-90", chinese: "充电器", pinyin: "chōngdiànqì", english: "Charger", category: "travel" },

  // === Time and Dates (10) ===
  { id: "fc-91", chinese: "今天", pinyin: "jīntiān", english: "Today", category: "time" },
  { id: "fc-92", chinese: "明天", pinyin: "míngtiān", english: "Tomorrow", category: "time" },
  { id: "fc-93", chinese: "昨天", pinyin: "zuótiān", english: "Yesterday", category: "time" },
  { id: "fc-94", chinese: "现在", pinyin: "xiànzài", english: "Now", category: "time" },
  { id: "fc-95", chinese: "几点？", pinyin: "jǐ diǎn?", english: "What time?", category: "time" },
  { id: "fc-96", chinese: "上午", pinyin: "shàngwǔ", english: "Morning (AM)", category: "time" },
  { id: "fc-97", chinese: "下午", pinyin: "xiàwǔ", english: "Afternoon (PM)", category: "time" },
  { id: "fc-98", chinese: "星期一", pinyin: "xīngqī yī", english: "Monday", category: "time" },
  { id: "fc-99", chinese: "小时", pinyin: "xiǎoshí", english: "Hour", category: "time" },
  { id: "fc-100", chinese: "分钟", pinyin: "fēnzhōng", english: "Minute", category: "time" },

  // === Colors and Descriptions (5) ===
  { id: "fc-101", chinese: "红色", pinyin: "hóngsè", english: "Red", category: "colors" },
  { id: "fc-102", chinese: "白色", pinyin: "báisè", english: "White", category: "colors" },
  { id: "fc-103", chinese: "黑色", pinyin: "hēisè", english: "Black", category: "colors" },
  { id: "fc-104", chinese: "大", pinyin: "dà", english: "Big / Large", category: "colors" },
  { id: "fc-105", chinese: "小", pinyin: "xiǎo", english: "Small / Little", category: "colors" },
];
