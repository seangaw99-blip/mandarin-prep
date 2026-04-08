'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, User, Briefcase, Building2, Users, Calendar } from 'lucide-react';
import { saveUserProfile } from '@/lib/user-profile';

const industries = [
  'Packaging', 'Manufacturing', 'Construction', 'Technology',
  'Finance', 'Healthcare', 'Education', 'Retail',
  'Food & Beverage', 'Logistics', 'Real Estate', 'Other',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [industry, setIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState('');

  const totalSteps = 5;

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim().length > 0;
      case 1: return occupation.trim().length > 0;
      case 2: return industry.length > 0 && (industry !== 'Other' || customIndustry.trim().length > 0);
      case 3: return true;
      case 4: return age.trim().length > 0 && !isNaN(Number(age));
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Save and go to home
      saveUserProfile({
        name: name.trim(),
        occupation: occupation.trim(),
        industry: industry === 'Other' ? customIndustry.trim() : industry,
        gender,
        age: Number(age),
        completedAt: new Date().toISOString(),
      });
      router.push('/');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress bar */}
      <div className="h-1 bg-card">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
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
                <h1 className="text-2xl font-bold">What&apos;s your name?</h1>
                <p className="text-sm text-muted mt-2">We&apos;ll personalize your learning experience</p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                placeholder="Enter your name"
                autoFocus
                className="w-full rounded-xl bg-card px-4 py-4 text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Step 1: Occupation */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold">What do you do?</h1>
                <p className="text-sm text-muted mt-2">Your job title or role</p>
              </div>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                placeholder="e.g. Business Owner, Engineer, Student"
                autoFocus
                className="w-full rounded-xl bg-card px-4 py-4 text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Step 2: Industry */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold">What industry?</h1>
                <p className="text-sm text-muted mt-2">We&apos;ll add relevant vocabulary</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      industry === ind
                        ? 'bg-primary text-white'
                        : 'bg-card text-foreground hover:bg-card/80'
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
                  onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                  placeholder="Enter your industry"
                  autoFocus
                  className="w-full rounded-xl bg-card px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>
          )}

          {/* Step 3: Gender */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <h1 className="text-2xl font-bold">Gender</h1>
                <p className="text-sm text-muted mt-2">For accurate Chinese pronouns in examples</p>
              </div>
              <div className="flex gap-3">
                {([['male', 'Male'], ['female', 'Female'], ['other', 'Other']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setGender(val)}
                    className={`flex-1 rounded-xl px-4 py-4 text-sm font-medium transition-colors ${
                      gender === val
                        ? 'bg-primary text-white'
                        : 'bg-card text-foreground hover:bg-card/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Age */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold">How old are you?</h1>
                <p className="text-sm text-muted mt-2">So you can practice saying your age in Chinese</p>
              </div>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                placeholder="Enter your age"
                autoFocus
                min="1"
                max="120"
                className="w-full rounded-xl bg-card px-4 py-4 text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="px-6 pb-8">
        <div className="mx-auto max-w-sm flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
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
            {step === totalSteps - 1 ? 'Start Learning' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
