'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, User, Target, Gauge, Clock, Building2 } from 'lucide-react';
import { saveUserProfile, type LearningGoal, type StartingLevel } from '@/lib/user-profile';

const GOALS: { value: LearningGoal; label: string; emoji: string; desc: string }[] = [
  { value: 'travel',  label: 'Travel',         emoji: '✈️',  desc: 'Survive and thrive while traveling in China' },
  { value: 'business', label: 'Business',      emoji: '💼',  desc: 'Communicate with suppliers, clients, partners' },
  { value: 'exam',    label: 'Pass HSK',        emoji: '📝',  desc: 'Get an official HSK certification' },
  { value: 'heritage', label: 'Heritage',      emoji: '🏮',  desc: 'Connect with family, culture, roots' },
  { value: 'fluency', label: 'Full Fluency',   emoji: '🌏',  desc: 'Zero to conversational fluency over time' },
];

const LEVELS: { value: StartingLevel; label: string; desc: string }[] = [
  { value: 'beginner',  label: 'Complete beginner',     desc: 'I know nothing or almost nothing yet' },
  { value: 'basics',    label: 'Know the basics',       desc: 'I know a few words: 你好, 谢谢, numbers' },
  { value: 'hsk1',      label: 'Around HSK 1–2',        desc: 'I can handle simple phrases and conversations' },
  { value: 'hsk2plus',  label: 'HSK 2+ / intermediate', desc: 'I have solid foundations and want to go deeper' },
];

const DAILY_GOALS = [
  { mins: 5  as const, label: '5 min',  desc: 'Light — a quick daily habit' },
  { mins: 10 as const, label: '10 min', desc: 'Steady — solid weekly progress' },
  { mins: 15 as const, label: '15 min', desc: 'Committed — real results fast' },
  { mins: 20 as const, label: '20+ min', desc: 'Intense — accelerated learning' },
];

const INDUSTRIES = [
  'Packaging', 'Manufacturing', 'Construction', 'Technology',
  'Finance', 'Healthcare', 'Education', 'Retail',
  'Food & Beverage', 'Logistics', 'Real Estate', 'Other',
];

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [goal, setGoal] = useState<LearningGoal | ''>('');
  const [level, setLevel] = useState<StartingLevel | ''>('');
  const [dailyMins, setDailyMins] = useState<5 | 10 | 15 | 20 | 0>(0);
  const [industry, setIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim().length > 0;
      case 1: return goal !== '';
      case 2: return level !== '';
      case 3: return dailyMins > 0;
      case 4: return industry.length > 0 && (industry !== 'Other' || customIndustry.trim().length > 0);
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      return;
    }
    saveUserProfile({
      name: name.trim(),
      goal: goal as LearningGoal,
      startingLevel: level as StartingLevel,
      dailyMinutes: dailyMins as 5 | 10 | 15 | 20,
      industry: industry === 'Other' ? customIndustry.trim() : industry,
      completedAt: new Date().toISOString(),
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress */}
      <div className="h-1 bg-card">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="mx-auto w-full max-w-sm">

          {/* Step 0: Name */}
          {step === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Welcome to Mandarin Hero</h1>
                <p className="text-sm text-muted mt-2">What should we call you?</p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                placeholder="Your name"
                autoFocus
                className="w-full rounded-xl bg-card px-4 py-4 text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold">Why learn Mandarin?</h1>
                <p className="text-sm text-muted mt-2">We&apos;ll shape your curriculum around your goal</p>
              </div>
              <div className="space-y-2">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                      goal === g.value ? 'bg-primary text-white' : 'bg-card text-foreground'
                    }`}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm">{g.label}</p>
                      <p className={`text-xs ${goal === g.value ? 'text-white/70' : 'text-muted'}`}>{g.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Level */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Gauge className="h-8 w-8 text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold">Where are you now?</h1>
                <p className="text-sm text-muted mt-2">Your current Mandarin level</p>
              </div>
              <div className="space-y-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`w-full flex items-start gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                      level === l.value ? 'bg-primary text-white' : 'bg-card text-foreground'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{l.label}</p>
                      <p className={`text-xs ${level === l.value ? 'text-white/70' : 'text-muted'}`}>{l.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Daily goal */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold">Daily commitment</h1>
                <p className="text-sm text-muted mt-2">How much time can you dedicate each day?</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DAILY_GOALS.map((d) => (
                  <button
                    key={d.mins}
                    onClick={() => setDailyMins(d.mins)}
                    className={`rounded-xl px-4 py-4 text-left transition-colors ${
                      dailyMins === d.mins ? 'bg-primary text-white' : 'bg-card text-foreground'
                    }`}
                  >
                    <p className="text-xl font-bold">{d.label}</p>
                    <p className={`text-xs mt-0.5 ${dailyMins === d.mins ? 'text-white/70' : 'text-muted'}`}>{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Industry */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-purple-500" />
                </div>
                <h1 className="text-2xl font-bold">Your industry</h1>
                <p className="text-sm text-muted mt-2">Personalizes AI chat and vocabulary</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      industry === ind ? 'bg-primary text-white' : 'bg-card text-foreground'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
              {industry === 'Other' && (
                <input
                  type="text"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  placeholder="Your industry"
                  autoFocus
                  className="w-full rounded-xl bg-card px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>
          )}

        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8">
        <div className="mx-auto max-w-sm flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-xl bg-card px-4 py-3 text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-40"
          >
            {step === TOTAL_STEPS - 1 ? '🚀 Start Learning' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
