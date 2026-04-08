'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Settings, Bot, User, Mic, MicOff } from 'lucide-react';
import Header from '@/components/layout/header';
import SpeakerButton from '@/components/ui/speaker-button';
import { listenForChinese, type RecognitionController } from '@/lib/speech-recognition';

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

const STORAGE_KEY = 'mandarin-chat-api-key';
const CHAT_HISTORY_KEY = 'mandarin-chat-history';

const SYSTEM_PROMPT = `You are a friendly Mandarin Chinese conversation partner helping a beginner (HSK 1-2 level) named Sean practice Chinese. Sean runs a packaging company called IPLMI and is traveling to China for business.

Rules:
1. Always respond in this format for each message:
   Chinese: [your response in Chinese characters]
   Pinyin: [pinyin with tone marks]
   English: [English translation]

2. If the user writes in Chinese and makes mistakes, add:
   Correction: [explain the error and correct it kindly]

3. Keep responses short (1-3 sentences). Use simple vocabulary appropriate for HSK 1-2.
4. If the user writes in English, respond in Chinese and encourage them to try Chinese.
5. Mix in business/packaging vocabulary naturally when relevant.
6. Be encouraging and patient. Use vocabulary the user likely knows from beginner textbooks.
7. Sometimes ask simple questions to keep the conversation going.

Example exchange:
User: 你好
You:
Chinese: 你好！你今天好吗？
Pinyin: Nǐ hǎo! Nǐ jīntiān hǎo ma?
English: Hello! How are you today?`;

const SCENARIOS = [
  { label: '🗣️ Free Chat', prompt: '你好！' },
  { label: '🏭 Factory Visit', prompt: '你好，我想看一下你们的工厂。' },
  { label: '🍜 Restaurant', prompt: '你好，我要点菜。' },
  { label: '🚕 Taxi', prompt: '师傅你好，我要去酒店。' },
  { label: '💰 Negotiation', prompt: '这个价格太贵了。' },
];

function parseResponse(text: string): ParsedResponse {
  const chineseMatch = text.match(/Chinese:\s*(.+)/i);
  const pinyinMatch = text.match(/Pinyin:\s*(.+)/i);
  const englishMatch = text.match(/English:\s*(.+)/i);
  const correctionMatch = text.match(/Correction:\s*(.+)/i);

  return {
    chinese: chineseMatch?.[1]?.trim(),
    pinyin: pinyinMatch?.[1]?.trim(),
    english: englishMatch?.[1]?.trim(),
    correction: correctionMatch?.[1]?.trim(),
    raw: text,
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const micControllerRef = useRef<RecognitionController | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    if (history) {
      try {
        setMessages(JSON.parse(history));
      } catch {}
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

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(STORAGE_KEY, key);
    setShowSettings(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !apiKey) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...newMessages.map((m) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      const data = await response.json();
      const assistantContent =
        data.choices?.[0]?.message?.content || 'Sorry, I could not respond.';

      setMessages([
        ...newMessages,
        { role: 'assistant', content: assistantContent },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Error connecting to Groq API. Check your API key and internet connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const handleMicToggle = async () => {
    if (isRecording && micControllerRef.current) {
      // Stop recording
      micControllerRef.current.stop();
      micControllerRef.current = null;
      setIsRecording(false);
      return;
    }

    // Start recording
    setIsRecording(true);
    try {
      const controller = listenForChinese();
      micControllerRef.current = controller;
      const result = await controller.promise;
      micControllerRef.current = null;
      setIsRecording(false);
      if (result.transcript.trim()) {
        sendMessage(result.transcript);
      }
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
              Get a free API key from groq.com.
            </p>
            <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-muted">
              <li>Go to console.groq.com and sign up (free)</li>
              <li>Create an API key</li>
              <li>Paste it below</li>
            </ol>
            <input
              type="password"
              placeholder="Enter your Groq API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mb-3 w-full rounded-lg bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => saveApiKey(apiKey)}
              disabled={!apiKey.trim()}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-50"
            >
              Save & Start Chatting
            </button>
            {showSettings && (
              <button
                onClick={() => setShowSettings(false)}
                className="mt-2 w-full rounded-lg bg-card py-2 text-sm text-muted"
              >
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

      {/* Controls */}
      <div className="border-b border-border px-4 py-2">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {SCENARIOS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.prompt)}
                className="shrink-0 rounded-full bg-card px-3 py-1 text-xs"
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-lg p-2 text-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={clearChat}
              className="rounded-lg p-2 text-muted hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-lg space-y-4">
          {messages.length === 0 && (
            <div className="py-12 text-center">
              <Bot className="mx-auto mb-3 h-12 w-12 text-muted" />
              <p className="text-lg font-semibold">Mandarin Chat Partner</p>
              <p className="mt-1 text-sm text-muted">
                Practice conversational Chinese. Type in Chinese or English!
              </p>
              <p className="mt-2 text-xs text-muted">
                Try a scenario above or just say 你好
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <div
                  key={i}
                  className="flex justify-end animate-fadeIn"
                >
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-white">
                    <p className="font-chinese text-base">{msg.content}</p>
                  </div>
                </div>
              );
            }

            const parsed = parseResponse(msg.content);
            return (
              <div
                key={i}
                className="flex justify-start animate-fadeIn"
              >
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-card px-4 py-3">
                  {parsed.chinese ? (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-chinese text-lg font-bold">
                          {parsed.chinese}
                        </p>
                        <SpeakerButton text={parsed.chinese} size="sm" />
                      </div>
                      {parsed.pinyin && (
                        <p className="mt-1 text-sm text-muted">{parsed.pinyin}</p>
                      )}
                      {parsed.english && (
                        <p className="mt-1 text-sm">{parsed.english}</p>
                      )}
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
            <div
              className="flex justify-start animate-fadeInOnly"
            >
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

      {/* Input */}
      <div className="border-t border-border bg-background px-4 py-3 safe-bottom">
        {isRecording && (
          <div className="mx-auto max-w-lg mb-2 text-center">
            <p className="text-xs text-red-400 animate-pulse">Recording... tap mic to stop</p>
          </div>
        )}
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            onClick={handleMicToggle}
            className={`rounded-xl px-3 py-3 transition-colors ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-card text-muted hover:text-primary'
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
