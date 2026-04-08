export type StudyDay = {
  day: number;
  date: string;
  title: string;
  focus: string;
  tasks: string[];
  sections: string[];
};

export const studyPlan: StudyDay[] = [
  {
    day: 1,
    date: "April 8",
    title: "Survival Basics",
    focus: "Greetings, numbers, and essential travel phrases you'll use from the moment you land",
    tasks: [
      "Review all 10 greeting flashcards until you can say them without looking",
      "Practice numbers 1-100 and money expressions (块/元)",
      "Learn the Airport & Immigration scenario phrases",
      "Practice Dialogue 3: Taking a Taxi — read it aloud 3 times",
      "Print or screenshot the Taxi and Emergency cheat sheets for your phone",
    ],
    sections: ["flashcards", "scenarios", "dialogues", "cheatsheets"],
  },
  {
    day: 2,
    date: "April 9",
    title: "Getting Around & Eating",
    focus: "Navigate taxis, order food confidently, and handle hotel basics",
    tasks: [
      "Review yesterday's flashcards (greetings + numbers) — aim for 90% recall",
      "Learn the Taxi & Transport scenario phrases",
      "Learn the Restaurant & Food scenario phrases",
      "Practice Dialogue 1: Hotel Check-in — read aloud 3 times",
      "Practice Dialogue 2: Ordering at a Restaurant — read aloud 3 times",
      "Learn directions flashcards (left, right, straight, near, far)",
      "Save the Restaurant cheat sheet to your phone",
    ],
    sections: ["flashcards", "scenarios", "dialogues", "cheatsheets"],
  },
  {
    day: 3,
    date: "April 10",
    title: "Business Vocabulary Deep Dive",
    focus: "Master the 10 core business terms and packaging industry vocabulary",
    tasks: [
      "Learn all 10 core business terms from your March 8 lesson",
      "Study the 15+ packaging-specific terms (corrugated, die-cutting, printing, etc.)",
      "Practice the 5 Business Inquiry sentences with their contexts",
      "Practice the 5 Greetings & Opening sentences — these set the tone",
      "Review all 20 business flashcards",
      "Read through Dialogue 4: Factory Introduction & Tour",
    ],
    sections: ["business-vocab", "flashcards", "dialogues"],
  },
  {
    day: 4,
    date: "April 11",
    title: "Factory & Negotiation Prep",
    focus: "Practice the exact conversations you'll have at factories and with suppliers",
    tasks: [
      "Review all business terms — quiz yourself without looking",
      "Learn the Factory Visit scenario phrases (production lines, equipment, QC)",
      "Learn the Business Negotiation scenario phrases (MOQ, pricing, delivery)",
      "Practice Dialogue 4: Factory Introduction & Tour — read aloud 3 times",
      "Practice Dialogue 5: Price Negotiation — read aloud 3 times",
      "Study Order Communication and Problem Communication sentences",
      "Save the Factory Visit cheat sheet to your phone",
    ],
    sections: ["scenarios", "business-vocab", "dialogues", "cheatsheets"],
  },
  {
    day: 5,
    date: "April 12",
    title: "Emergency Prep & Full Review",
    focus: "Learn emergency phrases and do a comprehensive review of everything",
    tasks: [
      "Learn the Emergency & Help scenario phrases",
      "Practice Dialogue 6: Emergency - Feeling Sick — read aloud 3 times",
      "Full flashcard review — go through all 105 cards, mark any you struggle with",
      "Review all 25 business sentences — practice saying them naturally",
      "Review Hotel scenario phrases",
      "Save the Emergency cheat sheet — keep it accessible at all times",
      "Write your hotel address in Chinese on a card to keep in your wallet",
    ],
    sections: ["scenarios", "flashcards", "business-vocab", "dialogues", "cheatsheets"],
  },
  {
    day: 6,
    date: "April 13",
    title: "Final Prep & Confidence Building",
    focus: "Last day before departure — focus on weak spots and build muscle memory",
    tasks: [
      "Run through all 6 dialogues one more time — focus on your speaking parts",
      "Quick review of struggling flashcards only",
      "Practice your self-introduction: name, company, what you do",
      "Practice key negotiation phrases: MOQ, pricing, delivery, quality",
      "Review all 6 cheat sheets — make sure they're saved to your phone",
      "Practice the Follow-up & Closing business sentences",
      "Pack your business cards and any printed materials",
      "Set up WeChat Pay and/or Alipay if not done already",
    ],
    sections: ["dialogues", "flashcards", "business-vocab", "scenarios", "cheatsheets"],
  },
];
