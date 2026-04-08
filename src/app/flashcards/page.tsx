'use client';

import { useState, useCallback, useEffect } from 'react';
import { Shuffle, Filter } from 'lucide-react';
import Header from '@/components/layout/header';
import Flashcard from '@/components/flashcards/flashcard';
import SwipeControls from '@/components/flashcards/swipe-controls';
import ProgressBar from '@/components/flashcards/progress-bar';
import { flashcards } from '@/data/flashcards';
import { saveCardProgress } from '@/lib/storage';
import { speakChinese } from '@/lib/audio';

const categories = ['all', ...new Set(flashcards.map((c) => c.category))];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildDeck(category: string) {
  const filtered =
    category === 'all'
      ? [...flashcards]
      : flashcards.filter((c) => c.category === category);
  return shuffleArray(filtered);
}

export default function FlashcardsPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deck, setDeck] = useState(() => buildDeck('all'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Read category from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat && categories.includes(cat)) {
      setCategoryFilter(cat);
      setDeck(buildDeck(cat));
      setCurrentIndex(0);
    }
  }, []);

  // Rebuild deck when category changes via filter buttons
  const changeCategory = (cat: string) => {
    setCategoryFilter(cat);
    setDeck(buildDeck(cat));
    setCurrentIndex(0);
    setCorrect(0);
    setReviewed(0);
    setIsFlipped(false);
    setShowComplete(false);
    setShowFilters(false);
  };

  const currentCard = deck[currentIndex];

  const [isRevealing, setIsRevealing] = useState(false);

  const handleNext = useCallback(
    (wasCorrect: boolean) => {
      if (!currentCard || isRevealing) return;
      saveCardProgress(currentCard.id, wasCorrect);
      if (wasCorrect) setCorrect((c) => c + 1);
      setReviewed((r) => r + 1);

      // Flip to reveal Chinese + pinyin and play audio
      setIsFlipped(true);
      setIsRevealing(true);
      speakChinese(currentCard.chinese);

      // Wait 2 seconds showing the answer, then move to next
      setTimeout(() => {
        setIsFlipped(false);
        setIsRevealing(false);
        if (currentIndex + 1 >= deck.length) {
          setShowComplete(true);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 2000);
    },
    [currentCard, currentIndex, deck.length, isRevealing]
  );

  const resetDeck = () => {
    setDeck(buildDeck(categoryFilter));
    setCurrentIndex(0);
    setCorrect(0);
    setReviewed(0);
    setIsFlipped(false);
    setShowComplete(false);
  };

  if (showComplete) {
    return (
      <div className="min-h-screen">
        <Header title="Flashcards" />
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-4 text-6xl animate-scaleIn">
            🎉
          </div>
          <h2 className="text-2xl font-bold">Session Complete!</h2>
          <p className="mt-2 text-muted">
            {correct} / {reviewed} correct (
            {reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0}%)
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={resetDeck}
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-white"
            >
              Practice Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Flashcards" />
      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Controls */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-sm"
          >
            <Filter className="h-4 w-4" />
            {categoryFilter === 'all' ? 'All Cards' : categoryFilter}
          </button>
          <button
            onClick={resetDeck}
            className="flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-sm"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="mb-4 overflow-hidden animate-fadeInOnly">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => changeCategory(cat)}
                  className={`rounded-full px-3 py-1 text-sm capitalize ${
                    cat === categoryFilter
                      ? 'bg-primary text-white'
                      : 'bg-card text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        <ProgressBar
          current={currentIndex + 1}
          total={deck.length}
          correct={correct}
        />

        {/* Card */}
        {currentCard && (
          <div className="mt-6">
            <Flashcard
              chinese={currentCard.chinese}
              pinyin={currentCard.pinyin}
              english={currentCard.english}
              isFlipped={isFlipped}
              onFlip={() => {
                setIsFlipped(!isFlipped);
                if (!isFlipped) speakChinese(currentCard.chinese);
              }}
            />
            <div className="mt-6">
              {isRevealing ? (
                <p className="text-center text-sm text-muted animate-pulse">Listen and review...</p>
              ) : (
                <SwipeControls
                  onCorrect={() => handleNext(true)}
                  onIncorrect={() => handleNext(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
