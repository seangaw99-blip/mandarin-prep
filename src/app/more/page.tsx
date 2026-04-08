'use client';

import Link from 'next/link';
import { FileText, MessageSquare, Moon, Sun, Info } from 'lucide-react';
import Header from '@/components/layout/header';
import { useTheme } from '@/components/theme-provider';

export default function MorePage() {
  const { theme, toggleTheme } = useTheme();

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

        <div className="mt-6 rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-muted" />
            <h3 className="text-sm font-semibold text-muted">About</h3>
          </div>
          <p className="text-xs text-muted">
            Built for Sean&apos;s China business trip (Apr 14-27, 2026).
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
