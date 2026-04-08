'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Layers,
  Briefcase,
  FileText,
  MessageSquare,
  MessageCircle,
  Plane,
  Target,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { getDaysUntilTrip, getTripDay } from '@/lib/utils';
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

const studyFocus: Record<number, { title: string; tasks: StudyTask[] }> = {
  6: {
    title: 'Foundation Refresh',
    tasks: [
      { label: 'Flashcards: Greetings', href: '/flashcards?cat=greetings', icon: '👋' },
      { label: 'Flashcards: Numbers & Money', href: '/flashcards?cat=numbers', icon: '🔢' },
      { label: 'Practice: Hotel Check-in', href: '/practice/dlg-1', icon: '🏨' },
    ],
  },
  5: {
    title: 'Travel Survival',
    tasks: [
      { label: 'Phrases: Airport', href: '/phrases/airport', icon: '✈️' },
      { label: 'Phrases: Taxi & Transport', href: '/phrases/taxi', icon: '🚕' },
      { label: 'Cheat Sheet: Taxi Card', href: '/cheatsheets/cs-taxi', icon: '📋' },
      { label: 'Practice: Taking a Taxi', href: '/practice/dlg-3', icon: '💬' },
    ],
  },
  4: {
    title: 'Food & Hotel',
    tasks: [
      { label: 'Phrases: Restaurant', href: '/phrases/restaurant', icon: '🍜' },
      { label: 'Phrases: Hotel', href: '/phrases/hotel', icon: '🏨' },
      { label: 'Flashcards: Food & Drinks', href: '/flashcards?cat=food', icon: '🥢' },
      { label: 'Practice: Ordering Food', href: '/practice/dlg-2', icon: '💬' },
    ],
  },
  3: {
    title: 'Business Prep',
    tasks: [
      { label: 'Business Vocabulary', href: '/business', icon: '📦' },
      { label: 'Phrases: Factory Visit', href: '/phrases/factory', icon: '🏭' },
      { label: 'Phrases: Negotiation', href: '/phrases/negotiation', icon: '💰' },
      { label: 'Practice: Price Negotiation', href: '/practice/dlg-5', icon: '💬' },
    ],
  },
  2: {
    title: 'Full Review',
    tasks: [
      { label: 'Flashcards: All Categories', href: '/flashcards', icon: '🃏' },
      { label: 'All Cheat Sheets', href: '/cheatsheets', icon: '📋' },
      { label: 'Practice: Factory Tour', href: '/practice/dlg-4', icon: '🏭' },
      { label: 'Flashcards: Business', href: '/flashcards?cat=business', icon: '💼' },
    ],
  },
  1: {
    title: 'Final Drill',
    tasks: [
      { label: 'Flashcards: Speed Run', href: '/flashcards', icon: '⚡' },
      { label: 'Cheat Sheet: Emergency', href: '/cheatsheets/cs-emergency', icon: '🚨' },
      { label: 'Cheat Sheet: Factory Visit', href: '/cheatsheets/cs-factory', icon: '🏭' },
      { label: 'AI Chat: Practice Conversation', href: '/chat', icon: '🤖' },
    ],
  },
  0: {
    title: "You're in China!",
    tasks: [
      { label: 'Cheat Sheet: Restaurant', href: '/cheatsheets/cs-restaurant', icon: '🍜' },
      { label: 'Cheat Sheet: Taxi', href: '/cheatsheets/cs-taxi', icon: '🚕' },
      { label: 'Cheat Sheet: Emergency', href: '/cheatsheets/cs-emergency', icon: '🚨' },
      { label: 'Phrases: Emergency', href: '/phrases/emergency', icon: '🏥' },
    ],
  },
};

export default function HomePage() {
  const [daysLeft, setDaysLeft] = useState(6);
  const [tripDay, setTripDay] = useState(0);
  const [stats, setStats] = useState({ totalReviewed: 0, mastered: 0, learning: 0, totalCorrect: 0, totalIncorrect: 0 });

  useEffect(() => {
    setDaysLeft(getDaysUntilTrip());
    setTripDay(getTripDay());
    setStats(getStats());
  }, []);

  const isInChina = tripDay > 0;
  const todayFocus = studyFocus[Math.min(daysLeft, 6)] || studyFocus[0];

  return (
    <div className="min-h-screen">
      <Header title="Mandarin Prep" />

      {/* Countdown Hero */}
      <div className="bg-gradient-to-br from-primary to-red-700 px-4 py-8 text-white">
        <div className="mx-auto max-w-lg text-center">
          <Plane className="mx-auto mb-2 h-8 w-8 opacity-80" />
          {isInChina ? (
            <>
              <p className="text-sm uppercase tracking-wider opacity-80">Day {tripDay} in China</p>
              <p className="font-chinese mt-1 text-3xl font-bold">加油！你可以的！</p>
              <p className="mt-1 text-sm opacity-80">Keep going! You can do it!</p>
            </>
          ) : (
            <>
              <p className="text-sm uppercase tracking-wider opacity-80">Days until China</p>
              <p className="mt-1 text-7xl font-bold">{daysLeft}</p>
              <p className="mt-1 text-sm opacity-80">April 14 – 27, 2026</p>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        {/* Today's Focus - now with clickable links */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Today&apos;s Focus: {todayFocus.title}</h2>
          </div>
          <div className="space-y-2">
            {todayFocus.tasks.map((task, i) => (
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

        {/* Quick Phrase */}
        <section className="rounded-xl bg-card p-4">
          <p className="text-xs text-muted mb-1">Phrase of the day</p>
          <p className="font-chinese text-2xl font-bold">你好，我是IPLMI包装公司的Sean。</p>
          <p className="text-sm text-muted mt-1">Nǐ hǎo, wǒ shì IPLMI bāozhuāng gōngsī de Sean.</p>
          <p className="text-sm mt-1">Hello, I&apos;m Sean from IPLMI Packaging Company.</p>
        </section>
      </div>
    </div>
  );
}
