'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  BookOpen,
  Layers,
  Briefcase,
  MessageCircle,
  BookText,
} from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: House },
  { href: '/phrases', label: 'Phrases', icon: BookOpen },
  { href: '/flashcards', label: 'Cards', icon: Layers },
  { href: '/business', label: 'Business', icon: Briefcase },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/vocabulary', label: 'Vocab', icon: BookText },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full text-xs transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={isActive ? 'font-semibold' : 'font-normal'}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
