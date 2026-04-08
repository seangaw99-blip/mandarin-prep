'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, MessageSquare, Moon, Sun, Info, BookText, UserCog } from 'lucide-react';
import Header from '@/components/layout/header';
import { useTheme } from '@/components/theme-provider';
import { clearUserProfile } from '@/lib/user-profile';

export default function MorePage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleResetProfile = () => {
    if (confirm('This will reset your profile and restart the onboarding. Continue?')) {
      clearUserProfile();
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="More" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-3">
        <Link href="/cheatsheets">
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 mb-3">
            <FileText className="h-5 w-5 text-purple-500" />
            <div>
              <h3 className="font-semibold">Cheat Sheets</h3>
              <p className="text-sm text-muted">Quick-reference cards to show locals</p>
            </div>
          </div>
        </Link>

        <Link href="/vocabulary">
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 mb-3">
            <BookText className="h-5 w-5 text-emerald-500" />
            <div>
              <h3 className="font-semibold">Vocabulary Reference</h3>
              <p className="text-sm text-muted">Browse 300+ words by category</p>
            </div>
          </div>
        </Link>

        <Link href="/practice">
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 mb-3">
            <MessageSquare className="h-5 w-5 text-rose-500" />
            <div>
              <h3 className="font-semibold">Conversation Practice</h3>
              <p className="text-sm text-muted">Role-play real dialogues</p>
            </div>
          </div>
        </Link>

        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-4 rounded-xl bg-card p-4"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Moon className="h-5 w-5 text-blue-500" />
          )}
          <div className="text-left">
            <h3 className="font-semibold">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </h3>
            <p className="text-sm text-muted">Switch appearance</p>
          </div>
        </button>

        <button
          onClick={handleResetProfile}
          className="flex w-full items-center gap-4 rounded-xl bg-card p-4"
        >
          <UserCog className="h-5 w-5 text-orange-500" />
          <div className="text-left">
            <h3 className="font-semibold">Reset Profile</h3>
            <p className="text-sm text-muted">Redo onboarding questions</p>
          </div>
        </button>

        <div className="mt-6 rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-muted" />
            <h3 className="text-sm font-semibold text-muted">About</h3>
          </div>
          <p className="text-xs text-muted">
            Mandarin Prep — Learn Chinese for your business trip.
            Content based on 标准汉语会话360句 lessons 1-8 and custom business vocabulary.
          </p>
          <p className="text-xs text-muted mt-2">
            Install this app: tap the share button in your browser and select &quot;Add to Home Screen&quot;.
          </p>
        </div>
      </div>
    </div>
  );
}
