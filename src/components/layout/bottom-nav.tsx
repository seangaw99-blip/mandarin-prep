'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, GraduationCap, BookOpen, MessageCircle, MoreHorizontal } from 'lucide-react';

const tabs = [
  { href: '/',           label: 'Home',       icon: House },
  { href: '/study',      label: 'Study',      icon: GraduationCap },
  { href: '/dictionary', label: 'Dictionary', icon: BookOpen },
  { href: '/chat',       label: 'Practice',   icon: MessageCircle },
  { href: '/more',       label: 'More',       icon: MoreHorizontal },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full text-xs transition-colors ${
                isActive ? 'text-primary' : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={isActive ? 'font-semibold' : 'font-normal'}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
