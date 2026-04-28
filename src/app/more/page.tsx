'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, MessageSquare, Moon, Sun, Info, BookText,
  UserCog, Briefcase, BookOpen, Layers, Dumbbell, BookMarked,
} from 'lucide-react';
import Header from '@/components/layout/header';
import { useTheme } from '@/components/theme-provider';
import { clearUserProfile } from '@/lib/user-profile';

const sections = [
  {
    label: 'Training',
    items: [
      { href: '/train', icon: Dumbbell, color: 'text-purple-500', title: 'Training Hub', desc: 'Tones, stroke order, listening drills' },
      { href: '/grammar', icon: BookText, color: 'text-blue-500', title: 'Grammar Patterns', desc: '55 essential HSK 1–3 patterns' },
    ],
  },
  {
    label: 'Learning Tools',
    items: [
      { href: '/flashcards', icon: Layers, color: 'text-amber-500', title: 'Flashcards', desc: 'Classic card review mode' },
      { href: '/read', icon: BookMarked, color: 'text-teal-500', title: 'Graded Reading', desc: 'Short stories at HSK 1–3 level' },
      { href: '/phrases', icon: BookOpen, color: 'text-blue-500', title: 'Phrases by Scenario', desc: 'Airport, restaurant, hotel, and more' },
      { href: '/practice', icon: MessageSquare, color: 'text-rose-500', title: 'Dialogue Practice', desc: 'Role-play scripted conversations' },
      { href: '/business', icon: Briefcase, color: 'text-emerald-500', title: 'Business & Packaging', desc: 'Industry-specific vocabulary' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { href: '/vocabulary', icon: BookText, color: 'text-purple-500', title: 'Vocabulary Browser', desc: 'Browse 300+ words by category' },
      { href: '/cheatsheets', icon: FileText, color: 'text-orange-500', title: 'Cheat Sheets', desc: 'Quick-reference cards to show locals' },
    ],
  },
];

export default function MorePage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleResetProfile = () => {
    if (confirm('This will reset your profile and restart onboarding. Continue?')) {
      clearUserProfile();
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="More" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            <h2 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">
              {section.label}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-4 rounded-xl bg-card p-4 active:scale-[0.98] transition-transform">
                    <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
                    <div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Settings */}
        <div>
          <h2 className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Settings</h2>
          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-4 rounded-xl bg-card p-4 active:scale-[0.98] transition-transform"
            >
              {theme === 'dark'
                ? <Sun className="h-5 w-5 text-amber-500 shrink-0" />
                : <Moon className="h-5 w-5 text-blue-500 shrink-0" />}
              <div className="text-left">
                <h3 className="font-semibold text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</h3>
                <p className="text-xs text-muted">Switch appearance</p>
              </div>
            </button>

            <button
              onClick={handleResetProfile}
              className="flex w-full items-center gap-4 rounded-xl bg-card p-4 active:scale-[0.98] transition-transform"
            >
              <UserCog className="h-5 w-5 text-orange-500 shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-sm">Reset Profile</h3>
                <p className="text-xs text-muted">Redo onboarding questions</p>
              </div>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-muted" />
            <h3 className="text-sm font-semibold text-muted">About Mandarin Hero</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Zero to fluent Mandarin — structured HSK curriculum, spaced-repetition flashcards,
            built-in dictionary, AI conversation partner, tone training, and more.
            Content from HSK official word lists, CC-CEDICT, and curated tutor lessons.
          </p>
          <p className="text-xs text-muted mt-2">
            Install as an app: tap Share → &ldquo;Add to Home Screen&rdquo; in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
