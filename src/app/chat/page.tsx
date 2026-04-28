'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Settings, Bot, Mic, MicOff, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/header';
import SpeakerButton from '@/components/ui/speaker-button';
import { listenForChinese, type RecognitionController } from '@/lib/speech-recognition';
import { getUserProfile, type StartingLevel, type LearningGoal } from '@/lib/user-profile';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ParsedResponse {
  chinese?: string;
  pinyin?: string;
  english?: string;
  correction?: string;
  raw: string;
}

const STORAGE_KEY = 'mandarin-chat-groq-key';
const CHAT_HISTORY_KEY = 'mandarin-chat-history';

const LEVEL_LABELS: Record<StartingLevel, string> = {
  beginner: 'Absolute Beginner',
  basics: 'HSK 1 Basics',
  hsk1: 'HSK 1–2',
  hsk2plus: 'HSK 2+',
};

function getLevelContext(level: StartingLevel): string {
  switch (level) {
    case 'beginner':
      return `The student is an absolute beginner. Use ONLY the most basic HSK 1 words (我, 你, 是, 有, 不, 吗, 什么, 好, 谢谢, 对不起, 你好, numbers). Keep every sentence under 8 characters. After each Chinese sentence, add a brief word-for-word breakdown in parentheses — e.g., 我 (I) 是 (am) 学生 (student). Be very patient and encouraging.`;
    case 'basics':
      return `The student knows basic HSK 1 vocabulary. Use HSK 1 vocabulary and introduce simple HSK 2 words. Keep sentences short (under 15 characters). When introducing a new word, give its meaning in parentheses the first time.`;
    case 'hsk1':
      return `The student is around HSK 1–2 level. Use HSK 1–2 vocabulary comfortably. You may introduce occasional HSK 3 words (mark them with English in parentheses). Sentences can include simple two-clause structures.`;
    case 'hsk2plus':
      return `The student has solid HSK 1–2 foundations and is working toward HSK 3. Use HSK 1–3 vocabulary freely. You may use compound sentences, resultative complements, and comparison structures. Occasionally challenge them with an HSK 4 word.`;
  }
}

function getBaseRules(level: StartingLevel): string {
  const levelCtx = getLevelContext(level);
  return `Student level: ${levelCtx}

Rules:
1. ALWAYS respond in EXACTLY this format (every single response, no exceptions):
   Chinese: [your response in Chinese characters only]
   Pinyin: [pinyin with tone marks for the Chinese above]
   English: [full English translation of the Chinese above]

2. If the user makes a mistake in their Chinese, add this AFTER the above format:
   Correction: [Write in ENGLISH: what they said, what was wrong, the correct Chinese with pinyin. Example: "You wrote 我去吃 — try 我想吃 (wǒ xiǎng chī) to say 'I want to eat'. 想 expresses desire here."]

3. Keep responses concise (1–2 sentences). Prioritize vocabulary at the student's level.
4. If the user writes in English, respond in the format above and gently encourage them to try Chinese.
5. The English and Correction lines must ALWAYS be in English.
6. Be warm, patient, and encouraging. Ask a simple follow-up question to keep the conversation going.
7. Stay in character for the chosen scenario.

CRITICAL: English and Correction lines must be in ENGLISH only. Never put Chinese characters on those lines.`;
}

interface Topic {
  id: string;
  label: string;
  icon: string;
  description: string;
  systemPromptTemplate: string;
  starterMessage: { chinese: string; pinyin: string; english: string } | null;
}

const TOPIC_TEMPLATES: Topic[] = [
  {
    id: 'free',
    label: 'Free Chat',
    icon: '🗣️',
    description: 'Open conversation on any topic',
    systemPromptTemplate: `You are a friendly Mandarin Chinese conversation partner helping {{NAME}} practice Chinese. {{NAME}} works in the {{INDUSTRY}} industry.\n\n{{RULES}}`,
    starterMessage: null,
  },
  {
    id: 'factory',
    label: 'Factory Visit',
    icon: '🏭',
    description: 'Practice visiting a supplier',
    systemPromptTemplate: `You are a Chinese factory manager at a {{INDUSTRY}} factory. {{NAME}} is visiting your factory. Role-play as the manager showing them around, discussing production, quality control, and capacity. Use {{INDUSTRY}}-relevant vocabulary naturally.\n\n{{RULES}}`,
    starterMessage: { chinese: '欢迎来到我们的工厂！我带你参观一下。', pinyin: 'Huānyíng lái dào wǒmen de gōngchǎng! Wǒ dài nǐ cānguān yíxià.', english: 'Welcome to our factory! Let me show you around.' },
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: '🍜',
    description: 'Practice ordering food and dining',
    systemPromptTemplate: `You are a friendly waiter/waitress at a Chinese restaurant. {{NAME}} is a foreign customer. Help them order food, explain menu items, ask about preferences, and handle the bill. Use common food vocabulary.\n\n{{RULES}}`,
    starterMessage: { chinese: '欢迎光临！请问几位？', pinyin: 'Huānyíng guānglín! Qǐngwèn jǐ wèi?', english: 'Welcome! How many people?' },
  },
  {
    id: 'taxi',
    label: 'Taxi Ride',
    icon: '🚕',
    description: 'Practice giving directions to a driver',
    systemPromptTemplate: `You are a taxi driver in a Chinese city. {{NAME}} is your passenger. They need to get to various places (hotel, factory, restaurant, airport). Ask where they want to go, mention traffic, discuss payment methods.\n\n{{RULES}}`,
    starterMessage: { chinese: '你好！去哪里？', pinyin: 'Nǐ hǎo! Qù nǎlǐ?', english: 'Hello! Where to?' },
  },
  {
    id: 'negotiation',
    label: 'Price Negotiation',
    icon: '💰',
    description: 'Practice negotiating prices',
    systemPromptTemplate: `You are a Chinese supplier in the {{INDUSTRY}} industry. {{NAME}} wants to negotiate prices, MOQ, discounts, delivery dates, and payment terms. Be willing to negotiate but start at a higher price.\n\n{{RULES}}`,
    starterMessage: { chinese: '你好！这是我们最新的报价单。', pinyin: 'Nǐ hǎo! Zhè shì wǒmen zuìxīn de bàojià dān.', english: 'Hello! This is our latest quotation.' },
  },
  {
    id: 'hotel',
    label: 'Hotel Check-in',
    icon: '🏨',
    description: 'Practice checking into a hotel',
    systemPromptTemplate: `You are a hotel receptionist at a business hotel in China. {{NAME}} is checking in. Help them with reservation, room, WiFi, breakfast, and taxi service.\n\n{{RULES}}`,
    starterMessage: { chinese: '您好，欢迎入住！请问有预订吗？', pinyin: 'Nín hǎo, huānyíng rùzhù! Qǐngwèn yǒu yùdìng ma?', english: 'Hello, welcome! Do you have a reservation?' },
  },
  {
    id: 'cafe',
    label: 'Café Meeting',
    icon: '☕',
    description: 'Casual chat with a new Chinese friend',
    systemPromptTemplate: `You are a friendly young Chinese person meeting {{NAME}} at a café for the first time. You are curious about their life, work, and country. Make friendly small talk about hobbies, food, family, and travel. Keep it relaxed and fun.\n\n{{RULES}}`,
    starterMessage: { chinese: '你好！第一次来中国吗？', pinyin: 'Nǐ hǎo! Dì yī cì lái Zhōngguó ma?', english: 'Hello! Is this your first time in China?' },
  },
  {
    id: 'airport',
    label: 'Airport',
    icon: '✈️',
    description: 'Practice at the airport and customs',
    systemPromptTemplate: `You are an airport staff member at a Chinese international airport. {{NAME}} needs help with check-in, customs, baggage, finding gates, and taking the airport metro. Be helpful and use airport/transport vocabulary.\n\n{{RULES}}`,
    starterMessage: { chinese: '您好！请出示您的护照和机票。', pinyin: 'Nín hǎo! Qǐng chūshì nín de hùzhào hé jīpiào.', english: 'Hello! Please show your passport and ticket.' },
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: '🛍️',
    description: 'Practice buying things at a market',
    systemPromptTemplate: `You are a shopkeeper at a Chinese market. {{NAME}} is shopping. Help them find items, discuss prices (use 块/元), sizes, colors, and bargain a little. Use measure words and money expressions.\n\n{{RULES}}`,
    starterMessage: { chinese: '欢迎！您要买什么？', pinyin: 'Huānyíng! Nín yào mǎi shénme?', english: 'Welcome! What would you like to buy?' },
  },
  {
    id: 'doctor',
    label: 'Doctor Visit',
    icon: '🏥',
    description: 'Practice describing symptoms',
    systemPromptTemplate: `You are a doctor at a Chinese clinic. {{NAME}} is a patient describing symptoms (headache, fever, stomach pain, etc.). Ask about their symptoms, give simple advice, and prescribe medicine. Use body parts and health vocabulary.\n\n{{RULES}}`,
    starterMessage: { chinese: '你好！哪里不舒服？', pinyin: 'Nǐ hǎo! Nǎlǐ bù shūfu?', english: 'Hello! What seems to be the problem?' },
  },
];

function buildTopics(
  userName: string,
  industry: string,
  level: StartingLevel,
): Topic[] {
  const rules = getBaseRules(level);
  return TOPIC_TEMPLATES.map((t) => ({
    ...t,
    systemPromptTemplate: t.systemPromptTemplate
      .replace(/\{\{NAME\}\}/g, userName || 'the student')
      .replace(/\{\{INDUSTRY\}\}/g, industry || 'business')
      .replace(/\{\{RULES\}\}/g, rules),
  }));
}

function getSystemPrompt(topic: Topic): string {
  return topic.systemPromptTemplate;
}

function parseResponse(text: string): ParsedResponse {
  const lines = text.split('\n');
  let chinese = '';
  let pinyin = '';
  let english = '';
  let correction = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^Chinese:\s*/i)) {
      chinese = trimmed.replace(/^Chinese:\s*/i, '');
    } else if (trimmed.match(/^Pinyin:\s*/i)) {
      pinyin = trimmed.replace(/^Pinyin:\s*/i, '');
    } else if (trimmed.match(/^English:\s*/i)) {
      english = trimmed.replace(/^English:\s*/i, '');
    } else if (trimmed.match(/^Correction:\s*/i)) {
      correction = trimmed.replace(/^Correction:\s*/i, '');
    }
  }

  return {
    chinese: chinese || undefined,
    pinyin: pinyin || undefined,
    english: english || undefined,
    correction: correction || undefined,
    raw: text,
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>(TOPIC_TEMPLATES);
  const [userLevel, setUserLevel] = useState<StartingLevel>('basics');
  const [userName, setUserName] = useState('');
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const micControllerRef = useRef<RecognitionController | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    if (history) {
      try { setMessages(JSON.parse(history)); } catch {}
    }
    const profile = getUserProfile();
    if (profile) {
      const level = profile.startingLevel ?? 'basics';
      setUserLevel(level);
      setUserName(profile.name ?? '');
      setTopics(buildTopics(profile.name, profile.industry, level));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.slice(-50)));
    }
  }, [messages]);

  const handleLevelChange = (level: StartingLevel) => {
    setUserLevel(level);
    setShowLevelPicker(false);
    const profile = getUserProfile();
    setTopics(buildTopics(profile?.name ?? userName, profile?.industry ?? '', level));
    // Rebuild active topic with new level
    if (activeTopic) {
      const newTopics = buildTopics(profile?.name ?? userName, profile?.industry ?? '', level);
      const rebuilt = newTopics.find((t) => t.id === activeTopic.id);
      if (rebuilt) setActiveTopic(rebuilt);
    }
  };

  const saveApiKey = () => {
    if (!apiKeyInput.trim()) return;
    setApiKey(apiKeyInput.trim());
    localStorage.setItem(STORAGE_KEY, apiKeyInput.trim());
    setShowSettings(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !apiKey) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const currentTopic = activeTopic ?? topics[0];

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: getSystemPrompt(currentTopic) },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: `API Error: ${data.error.message}` }]);
        return;
      }

      const assistantContent = data.choices?.[0]?.message?.content || 'Sorry, I could not respond.';
      setMessages([...newMessages, { role: 'assistant', content: assistantContent }]);
    } catch (error) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Could not connect to Groq API. Check your API key.'}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setActiveTopic(null);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const selectTopic = (topic: Topic) => {
    setMessages([]);
    setActiveTopic(topic);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    if (topic.starterMessage) {
      const s = topic.starterMessage;
      setMessages([{ role: 'assistant', content: `Chinese: ${s.chinese}\nPinyin: ${s.pinyin}\nEnglish: ${s.english}` }]);
    }
  };

  const handleMicToggle = async () => {
    if (isRecording && micControllerRef.current) {
      micControllerRef.current.stop();
      micControllerRef.current = null;
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    try {
      const controller = listenForChinese();
      micControllerRef.current = controller;
      const result = await controller.promise;
      micControllerRef.current = null;
      setIsRecording(false);
      if (result.transcript.trim()) sendMessage(result.transcript);
    } catch {
      micControllerRef.current = null;
      setIsRecording(false);
    }
  };

  if (!apiKey || showSettings) {
    return (
      <div className="min-h-screen">
        <Header title="AI Chat Partner" />
        <div className="mx-auto max-w-lg px-4 py-8">
          <div className="rounded-xl bg-card p-6">
            <h2 className="mb-2 text-xl font-bold">Set Up AI Chat</h2>
            <p className="mb-4 text-sm text-muted">
              This feature uses Groq&apos;s free API to power a Mandarin conversation partner.
              Get a free API key from console.groq.com.
            </p>
            <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-muted">
              <li>Go to console.groq.com and sign up (free)</li>
              <li>Create an API key</li>
              <li>Paste it below</li>
            </ol>
            <input
              type="password"
              placeholder="Enter your Groq API key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="mb-3 w-full rounded-lg bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={saveApiKey}
              disabled={!apiKeyInput.trim()}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-50"
            >
              Save & Start Chatting
            </button>
            {showSettings && (
              <button onClick={() => setShowSettings(false)} className="mt-2 w-full rounded-lg bg-card py-2 text-sm text-muted">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="AI Chat Partner" />

      {/* Top bar */}
      <div className="border-b border-border px-4 py-2">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTopic && (
              <span className="text-sm font-medium">
                {activeTopic.icon} {activeTopic.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Level picker */}
            <div className="relative">
              <button
                onClick={() => setShowLevelPicker(!showLevelPicker)}
                className="flex items-center gap-1 rounded-lg bg-card px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground"
              >
                {LEVEL_LABELS[userLevel]}
                <ChevronDown className="h-3 w-3" />
              </button>
              {showLevelPicker && (
                <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl bg-card shadow-lg border border-border overflow-hidden">
                  {(Object.entries(LEVEL_LABELS) as [StartingLevel, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => handleLevelChange(val)}
                      className={`w-full px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                        userLevel === val ? 'bg-primary text-white' : 'hover:bg-background text-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={clearChat} className="rounded-lg p-2 text-muted hover:text-foreground" title="New conversation">
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={() => setShowSettings(true)} className="rounded-lg p-2 text-muted hover:text-foreground" title="API settings">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-36">
        <div className="mx-auto max-w-lg space-y-4">
          {/* Topic selector */}
          {!activeTopic && messages.length === 0 && (
            <div className="py-4">
              <div className="text-center mb-6">
                <Bot className="mx-auto mb-3 h-10 w-10 text-muted" />
                <p className="text-lg font-semibold">Choose a Scenario</p>
                <p className="mt-1 text-sm text-muted">
                  Pick a situation to practice, or start a free conversation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => selectTopic(topic)}
                    className="rounded-xl bg-card p-4 text-left active:scale-[0.97] transition-transform"
                  >
                    <span className="text-2xl">{topic.icon}</span>
                    <h3 className="font-semibold text-sm mt-2">{topic.label}</h3>
                    <p className="text-xs text-muted mt-1">{topic.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <div key={i} className="flex justify-end animate-fadeIn">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-white">
                    <p className="font-chinese text-base">{msg.content}</p>
                  </div>
                </div>
              );
            }

            const parsed = parseResponse(msg.content);
            return (
              <div key={i} className="flex justify-start animate-fadeIn">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-card px-4 py-3">
                  {parsed.chinese ? (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-chinese text-lg font-bold">{parsed.chinese}</p>
                        <SpeakerButton text={parsed.chinese} size="sm" />
                      </div>
                      {parsed.pinyin && <p className="mt-1 text-sm text-muted">{parsed.pinyin}</p>}
                      {parsed.english && <p className="mt-1 text-sm">{parsed.english}</p>}
                      {parsed.correction && (
                        <div className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2">
                          <p className="text-xs font-medium text-amber-500">
                            💡 {parsed.correction}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start animate-fadeInOnly">
              <div className="rounded-2xl rounded-bl-md bg-card px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0.1s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Click-outside to close level picker */}
      {showLevelPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowLevelPicker(false)} />
      )}

      {/* Input bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-background px-4 py-3">
        {isRecording && (
          <div className="mx-auto max-w-lg mb-2 text-center">
            <p className="text-xs text-red-400 animate-pulse">Recording... tap mic to stop</p>
          </div>
        )}
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            onClick={handleMicToggle}
            className={`rounded-xl px-3 py-3 transition-colors ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-card text-muted hover:text-primary'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Type or tap mic to speak..."
            className="font-chinese flex-1 rounded-xl bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="rounded-xl bg-primary px-4 py-3 text-white disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
