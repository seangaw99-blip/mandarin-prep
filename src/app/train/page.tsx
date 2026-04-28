'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Music, PenLine, Headphones } from 'lucide-react';

interface TrainMode {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  disabled?: boolean;
}

const TRAIN_MODES: TrainMode[] = [
  {
    href: '/train/tones',
    icon: Music,
    color: 'bg-purple-500',
    title: 'Tone Trainer',
    desc: 'Hear words, identify tone 1–4. Build pitch perception fast.',
    badge: 'Core skill',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    href: '/train/hanzi',
    icon: PenLine,
    color: 'bg-indigo-500',
    title: 'Stroke Order',
    desc: 'Watch animated stroke order, then practice writing from memory.',
    badge: 'Characters',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    href: '/train/listening',
    icon: Headphones,
    color: 'bg-teal-500',
    title: 'Listening Drills',
    desc: 'Dictation exercises — hear a sentence, type what you hear.',
    badge: 'Dictation',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
];

export default function TrainPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="rounded-full p-2 bg-card">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Training</h1>
          <p className="text-xs text-muted">Focused skill drills</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-3">
        {TRAIN_MODES.map((m) => (
          m.disabled ? (
            <div key={m.href} className="flex items-center gap-4 rounded-2xl bg-card p-4 opacity-60">
              <div className={`rounded-full ${m.color} p-3 shrink-0`}>
                <m.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm">{m.title}</h3>
                  <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${m.badgeColor}`}>{m.badge}</span>
                </div>
                <p className="text-xs text-muted">{m.desc}</p>
              </div>
            </div>
          ) : (
            <Link key={m.href} href={m.href}>
              <div className="flex items-center gap-4 rounded-2xl bg-card p-4 active:scale-[0.98] transition-transform">
                <div className={`rounded-full ${m.color} p-3 shrink-0`}>
                  <m.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm">{m.title}</h3>
                    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${m.badgeColor}`}>{m.badge}</span>
                  </div>
                  <p className="text-xs text-muted">{m.desc}</p>
                </div>
              </div>
            </Link>
          )
        ))}
      </div>
    </div>
  );
}
