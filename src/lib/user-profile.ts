export interface UserProfile {
  name: string;
  occupation: string;
  industry: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  completedAt: string;
}

const STORAGE_KEY = 'mandarin-user-profile';

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
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

export function getChineseIntro(profile: UserProfile): {
  chinese: string;
  pinyin: string;
  english: string;
} {
  return {
    chinese: `你好，我是${profile.industry}公司的${profile.name}。`,
    pinyin: `Nǐ hǎo, wǒ shì ${profile.industry} gōngsī de ${profile.name}.`,
    english: `Hello, I'm ${profile.name} from a ${profile.industry} company.`,
  };
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
