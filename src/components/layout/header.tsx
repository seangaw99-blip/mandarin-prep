'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function Header({ title, showBack }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Auto-show back button on sub-pages (more than one path segment)
  const segments = pathname.split('/').filter(Boolean);
  const shouldShowBack = showBack ?? segments.length > 1;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-2">
        {shouldShowBack && (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-foreground transition-colors -ml-1"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
      </div>
      <button
        onClick={toggleTheme}
        className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:text-foreground transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
