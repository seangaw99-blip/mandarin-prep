export type LearningGoal = 'travel' | 'business' | 'exam' | 'heritage' | 'fluency';
export type StartingLevel = 'beginner' | 'basics' | 'hsk1' | 'hsk2plus';

export interface UserProfile {
  name: string;
  goal: LearningGoal;
  startingLevel: StartingLevel;
  dailyMinutes: 5 | 10 | 15 | 20;
  industry: string;
  // Legacy / optional
  occupation?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  completedAt: string;
}

const STORAGE_KEY = 'mandarin-user-profile';

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    // Migrate legacy profiles that lack new fields
    if (!parsed.goal) parsed.goal = 'fluency';
    if (!parsed.startingLevel) parsed.startingLevel = 'beginner';
    if (!parsed.dailyMinutes) parsed.dailyMinutes = 10;
    return parsed as UserProfile;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearUserProfile() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getGreeting(profile: UserProfile): {
  chinese: string;
  pinyin: string;
  english: string;
} {
  const hour = new Date().getHours();
  if (hour < 12) {
    return {
      chinese: `早上好，${profile.name}！准备好学习了吗？`,
      pinyin: `Zǎoshang hǎo, ${profile.name}! Zhǔnbèi hǎo xuéxí le ma?`,
      english: `Good morning, ${profile.name}! Ready to study?`,
    };
  } else if (hour < 18) {
    return {
      chinese: `下午好，${profile.name}！继续加油！`,
      pinyin: `Xiàwǔ hǎo, ${profile.name}! Jìxù jiāyóu!`,
      english: `Good afternoon, ${profile.name}! Keep it up!`,
    };
  } else {
    return {
      chinese: `晚上好，${profile.name}！今天学了什么？`,
      pinyin: `Wǎnshang hǎo, ${profile.name}! Jīntiān xué le shénme?`,
      english: `Good evening, ${profile.name}! What did you learn today?`,
    };
  }
}

export function getGoalLabel(goal: LearningGoal): string {
  const labels: Record<LearningGoal, string> = {
    travel: 'Travel & Survival',
    business: 'Business & Work',
    exam: 'Pass HSK Exam',
    heritage: 'Heritage & Family',
    fluency: 'General Fluency',
  };
  return labels[goal];
}
