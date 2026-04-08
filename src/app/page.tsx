'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Layers,
  Briefcase,
  FileText,
  MessageSquare,
  MessageCircle,
  Target,
  TrendingUp,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { getStats } from '@/lib/storage';
import Header from '@/components/layout/header';

const quickLinks = [
  { href: '/phrases', icon: BookOpen, label: 'Phrases', color: 'bg-blue-500' },
  { href: '/flashcards', icon: Layers, label: 'Flashcards', color: 'bg-amber-500' },
  { href: '/business', icon: Briefcase, label: 'Business', color: 'bg-emerald-500' },
  { href: '/cheatsheets', icon: FileText, label: 'Cheat Sheets', color: 'bg-purple-500' },
  { href: '/practice', icon: MessageSquare, label: 'Practice', color: 'bg-rose-500' },
  { href: '/chat', icon: MessageCircle, label: 'AI Chat', color: 'bg-cyan-500' },
];

interface StudyTask {
  label: string;
  href: string;
  icon: string;
}

const studyTasks: StudyTask[] = [
  { label: 'Flashcards: Greetings', href: '/flashcards?cat=greetings', icon: '👋' },
  { label: 'Flashcards: Numbers & Money', href: '/flashcards?cat=numbers', icon: '🔢' },
  { label: 'Phrases: Airport', href: '/phrases/airport', icon: '✈️' },
  { label: 'Phrases: Taxi & Transport', href: '/phrases/taxi', icon: '🚕' },
  { label: 'Phrases: Restaurant', href: '/phrases/restaurant', icon: '🍜' },
  { label: 'Phrases: Hotel', href: '/phrases/hotel', icon: '🏨' },
  { label: 'Business Vocabulary', href: '/business', icon: '📦' },
  { label: 'Phrases: Factory Visit', href: '/phrases/factory', icon: '🏭' },
  { label: 'Phrases: Negotiation', href: '/phrases/negotiation', icon: '💰' },
  { label: 'Practice: Hotel Check-in', href: '/practice/dlg-1', icon: '🏨' },
  { label: 'Practice: Ordering Food', href: '/practice/dlg-2', icon: '🍜' },
  { label: 'Practice: Taking a Taxi', href: '/practice/dlg-3', icon: '🚕' },
  { label: 'Practice: Factory Tour', href: '/practice/dlg-4', icon: '🏭' },
  { label: 'Practice: Price Negotiation', href: '/practice/dlg-5', icon: '💰' },
  { label: 'Cheat Sheet: Restaurant', href: '/cheatsheets/cs-restaurant', icon: '📋' },
  { label: 'Cheat Sheet: Taxi', href: '/cheatsheets/cs-taxi', icon: '📋' },
  { label: 'AI Chat Practice', href: '/chat', icon: '🤖' },
];

const POMODORO_KEY = 'mandarin-pomodoro';

type PomodoroMode = 'study' | 'break';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function loadPomodoroStats(): { totalSessions: number; totalMinutes: number } {
  if (typeof window === 'undefined') return { totalSessions: 0, totalMinutes: 0 };
  try {
    const data = localStorage.getItem(POMODORO_KEY);
    return data ? JSON.parse(data) : { totalSessions: 0, totalMinutes: 0 };
  } catch {
    return { totalSessions: 0, totalMinutes: 0 };
  }
}

function savePomodoroSession(minutes: number) {
  const stats = loadPomodoroStats();
  stats.totalSessions++;
  stats.totalMinutes += minutes;
  localStorage.setItem(POMODORO_KEY, JSON.stringify(stats));
}

export default function HomePage() {
  const [stats, setStats] = useState({ totalReviewed: 0, mastered: 0, learning: 0, totalCorrect: 0, totalIncorrect: 0 });
  const [pomodoroStats, setPomodoroStats] = useState({ totalSessions: 0, totalMinutes: 0 });

  // Pomodoro state
  const [studyDuration, setStudyDuration] = useState(25); // minutes
  const [breakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>('study');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStats(getStats());
    setPomodoroStats(loadPomodoroStats());
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          // Timer completed
          if (mode === 'study') {
            savePomodoroSession(studyDuration);
            setPomodoroStats(loadPomodoroStats());
            // Switch to break
            setMode('break');
            setTimeLeft(breakDuration * 60);
          } else {
            // Break over, back to study
            setMode('study');
            setTimeLeft(studyDuration * 60);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [mode, studyDuration, breakDuration, stopTimer]);

  const resetTimer = () => {
    stopTimer();
    setMode('study');
    setTimeLeft(studyDuration * 60);
  };

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const changeDuration = (mins: number) => {
    setStudyDuration(mins);
    if (!isRunning && mode === 'study') {
      setTimeLeft(mins * 60);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const progress = mode === 'study'
    ? 1 - timeLeft / (studyDuration * 60)
    : 1 - timeLeft / (breakDuration * 60);

  return (
    <div className="min-h-screen">
      <Header title="Mandarin Prep" />

      {/* Pomodoro Timer */}
      <div className={`px-4 py-6 ${mode === 'study' ? 'bg-gradient-to-br from-primary to-red-700' : 'bg-gradient-to-br from-green-600 to-emerald-700'} text-white`}>
        <div className="mx-auto max-w-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="h-5 w-5 opacity-80" />
            <p className="text-sm uppercase tracking-wider opacity-80">
              {mode === 'study' ? 'Study Session' : 'Break Time'}
            </p>
          </div>

          {/* Timer display */}
          <p className="text-6xl font-bold font-mono tracking-wider my-3">
            {formatTime(timeLeft)}
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-xs mx-auto h-1.5 bg-white/20 rounded-full mb-4">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <button
              onClick={resetTimer}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={toggleTimer}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-red-600 hover:bg-white/90 transition-colors"
            >
              {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>
            <div className="w-10 h-10" /> {/* Spacer for alignment */}
          </div>

          {/* Duration presets */}
          {!isRunning && mode === 'study' && (
            <div className="flex items-center justify-center gap-2">
              {[15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => changeDuration(mins)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    studyDuration === mins ? 'bg-white text-red-600 font-semibold' : 'bg-white/20'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          )}

          {/* Session stats */}
          {pomodoroStats.totalSessions > 0 && (
            <p className="text-xs opacity-60 mt-2">
              {pomodoroStats.totalSessions} sessions completed &middot; {pomodoroStats.totalMinutes} min studied
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        {/* Greeting & CTA */}
        <Link href="/flashcards">
          <section className="rounded-xl bg-card p-4 active:scale-[0.98] transition-transform">
            <p className="font-chinese text-2xl font-bold">你好，Sean！准备好学习了吗？</p>
            <p className="text-sm text-muted mt-1">Nǐ hǎo, Sean! Zhǔnbèi hǎo xuéxí le ma?</p>
            <p className="text-sm mt-1">Hello, Sean! Ready to study?</p>
            <p className="text-xs text-primary font-semibold mt-2">Start a flashcard session →</p>
          </section>
        </Link>

        {/* Suggested Study Tasks */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Study Tasks</h2>
          </div>
          <div className="space-y-2">
            {studyTasks.slice(0, 5).map((task, i) => (
              <Link key={i} href={task.href}>
                <div className="flex items-center gap-3 rounded-lg bg-card p-3 mb-2 active:scale-[0.98] transition-transform">
                  <span className="text-xl shrink-0">{task.icon}</span>
                  <span className="text-sm flex-1">{task.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        {stats.totalReviewed > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Your Progress</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-card p-3 text-center">
                <p className="text-2xl font-bold text-primary">{stats.totalReviewed}</p>
                <p className="text-xs text-muted">Reviewed</p>
              </div>
              <div className="rounded-lg bg-card p-3 text-center">
                <p className="text-2xl font-bold text-success">{stats.mastered}</p>
                <p className="text-xs text-muted">Mastered</p>
              </div>
              <div className="rounded-lg bg-card p-3 text-center">
                <p className="text-2xl font-bold text-secondary">{stats.learning}</p>
                <p className="text-xs text-muted">Learning</p>
              </div>
            </div>
          </section>
        )}

        {/* Quick Links */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Study Sections</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 active:scale-95 transition-transform">
                  <div className={`rounded-full ${link.color} p-3`}>
                    <link.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium">{link.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
