import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Bookmark, Shuffle, RotateCcw, ChevronLeft, ChevronRight, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';

interface FlashcardViewProps {
  words: LexiconWord[];
  bookmarkedIds: number[];
  onToggleBookmark: (id: number) => void;
}

export function FlashcardView({
  words,
  bookmarkedIds,
  onToggleBookmark
}: FlashcardViewProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'saved' | 'unmastered'>('all');
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isSpeakingEn, setIsSpeakingEn] = useState(false);

  // Touch Swipe tracking
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Filtered Deck
  const deck = useMemo(() => {
    let list = words;
    if (filterMode === 'saved') {
      list = list.filter(w => bookmarkedIds.includes(w.id));
    } else if (filterMode === 'unmastered') {
      list = list.filter(w => !masteredIds.includes(w.id));
    }
    return list;
  }, [words, filterMode, bookmarkedIds, masteredIds]);

  // Reset index if deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterMode, words.length]);

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleNext = () => {
    if (deck.length === 0) return;
    triggerHaptic();
    setIsFlipped(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    if (deck.length === 0) return;
    triggerHaptic();
    setIsFlipped(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleFlip = () => {
    triggerHaptic(15);
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    triggerHaptic(20);
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * deck.length));
  };

  // Keyboard navigation for study mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
      if (isInput) return;

      if (e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleFlip();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (deck[currentIndex]) {
          toggleMastered();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck, currentIndex, isFlipped]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only trigger if horizontal swipe is prominent (> 45px) and not vertical scroll
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!deck || deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-amber-400">
          <HelpCircle size={28} />
        </div>
        <h3 className="text-2xl font-serif italic text-zinc-200 mb-2">No Flashcards in this View</h3>
        <p className="text-zinc-500 font-sans text-sm max-w-sm mb-6">
          {filterMode === 'saved'
            ? "You don't have any bookmarked words in the current letter selection."
            : filterMode === 'unmastered'
            ? "Outstanding! You have mastered all terms in this deck."
            : "No words match your current filters."}
        </p>
        <button
          onClick={() => setFilterMode('all')}
          className="px-4 py-2 rounded-full bg-amber-400 text-black font-mono text-xs font-bold"
        >
          View All Flashcards
        </button>
      </div>
    );
  }

  const currentWord = deck[currentIndex] || deck[0];
  const isBookmarked = bookmarkedIds.includes(currentWord.id);
  const isMastered = masteredIds.includes(currentWord.id);

  const handleSpeakEnglish = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    speakWord(
      currentWord.word,
      () => setIsSpeakingEn(true),
      () => setIsSpeakingEn(false),
      () => setIsSpeakingEn(false)
    );
  };

  const toggleMastered = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic(25);
    setMasteredIds((prev) =>
      prev.includes(currentWord.id)
        ? prev.filter((id) => id !== currentWord.id)
        : [...prev, currentWord.id]
    );
  };

  return (
    <div 
      className="flex flex-col items-center justify-between min-h-[75vh] py-4 px-4 max-w-xl mx-auto w-full select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Deck Header & Filters */}
      <div className="w-full space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block">
              Active Recall Deck
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-mono text-amber-400 font-bold">
                {currentIndex + 1} / {deck.length}
              </span>
              {masteredIds.length > 0 && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>{masteredIds.length} Mastered</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-mono"
              title="Jump to Random Card (S)"
            >
              <Shuffle size={14} />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition-all"
              title="Reset to Card #1"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Deck Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800/80 text-xs font-mono">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
              filterMode === 'all'
                ? 'bg-amber-400 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({words.length})
          </button>
          <button
            onClick={() => setFilterMode('saved')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
              filterMode === 'saved'
                ? 'bg-amber-400 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Saved ({bookmarkedIds.length})
          </button>
          <button
            onClick={() => setFilterMode('unmastered')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
              filterMode === 'unmastered'
                ? 'bg-amber-400 text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Unmastered
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
          animate={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div className="w-full relative aspect-[4/5] sm:aspect-[16/11] perspective-1000 my-auto cursor-pointer">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, x: direction * 50, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 50, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            {/* 3D Rotating Inner Card */}
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              onClick={handleFlip}
              className="w-full h-full relative rounded-3xl"
            >
              {/* FRONT FACE */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)',
                  visibility: isFlipped ? 'hidden' : 'visible'
                }}
                className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl bg-[#121216] border border-zinc-800 text-zinc-100 transition-all duration-200 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
              >
                {/* Ambient Background Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Top Actions */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-mono text-purple-300 bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/20 uppercase tracking-widest">
                    {currentWord.pos}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMastered}
                      className={`p-2 rounded-full transition-all ${
                        isMastered
                          ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                          : 'bg-zinc-800/80 text-zinc-400 hover:text-emerald-400'
                      }`}
                      title={isMastered ? 'Marked as Mastered (M)' : 'Mark as Mastered (M)'}
                    >
                      <CheckCircle2 size={18} className={isMastered ? 'fill-emerald-400/20' : ''} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic();
                        onToggleBookmark(currentWord.id);
                      }}
                      className={`p-2 rounded-full transition-all ${
                        isBookmarked
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                          : 'bg-zinc-800/80 text-zinc-400 hover:text-amber-400'
                      }`}
                      title="Bookmark card"
                    >
                      <Bookmark size={18} className={isBookmarked ? 'fill-amber-400' : ''} />
                    </button>
                    <button
                      onClick={handleSpeakEnglish}
                      className={`p-2 rounded-full transition-all ${
                        isSpeakingEn ? 'bg-amber-400 text-black' : 'bg-amber-400/15 text-amber-400 hover:bg-amber-400/25'
                      }`}
                      title="Pronounce in English"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Front Side Body */}
                <div className="my-auto flex flex-col items-center text-center z-10 py-4">
                  <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-amber-400 mb-2 tracking-tight">
                    {currentWord.word}
                  </h2>
                  <p className="text-xl font-tamil text-amber-300 font-medium mb-3">
                    {currentWord.taWord}
                  </p>
                  <div className="w-12 h-0.5 bg-amber-400/40 rounded-full my-2" />
                  <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
                    Tap to reveal definition & context
                  </p>
                </div>

                {/* Front Footer */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-zinc-800/80 pt-3 z-10">
                  <span className="flex items-center gap-1 text-[11px] text-amber-400/90">
                    <Sparkles size={12} />
                    Tap card to Flip
                  </span>
                  <span className="text-[11px]">Swipe ← → or use keys</span>
                </div>
              </div>

              {/* BACK FACE */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  visibility: isFlipped ? 'visible' : 'hidden'
                }}
                className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl bg-[#181822] border border-amber-400/40 text-zinc-100 transition-all duration-200 ${
                  isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Ambient Background Glow */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Actions on Back */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 uppercase tracking-widest font-medium">
                    Answer & Context
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeakEnglish}
                      className="p-1.5 rounded-full bg-amber-400/15 text-amber-400 hover:bg-amber-400/25"
                      title="Pronounce in English"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Back Side Body */}
                <div className="my-auto flex flex-col z-10 space-y-3 py-2">
                  <div>
                    <h3 className="text-2xl font-serif text-amber-300 font-semibold">
                      {currentWord.word} <span className="text-sm font-tamil text-zinc-300 font-normal">({currentWord.taWord})</span>
                    </h3>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                      Definition
                    </span>
                    <p className="text-xs sm:text-sm font-sans text-zinc-100 leading-relaxed font-normal">
                      {currentWord.definition}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-0.5 font-medium">
                      Engineering Context
                    </span>
                    <p className="text-xs font-serif text-zinc-200">
                      "{currentWord.enExample}"
                    </p>
                    <p className="text-xs font-tamil text-zinc-300 mt-1">
                      "{currentWord.taExample}"
                    </p>
                  </div>
                </div>

                {/* Back Footer */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-zinc-800/80 pt-3 z-10">
                  <button
                    onClick={toggleMastered}
                    className={`flex items-center gap-1.5 text-xs font-mono ${
                      isMastered ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-emerald-400'
                    }`}
                  >
                    <CheckCircle2 size={14} className={isMastered ? 'fill-emerald-400/20' : ''} />
                    <span>{isMastered ? 'Mastered!' : 'Mark Mastered (M)'}</span>
                  </button>
                  <span className="text-[11px]">Tap to flip back</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next / Prev Touch Navigation Controls */}
      <div className="flex items-center justify-center gap-5 mt-6 w-full">
        <button
          onClick={handlePrev}
          className="w-13 h-13 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-400/50 active:scale-90 transition-all flex items-center justify-center shadow-lg"
          aria-label="Previous card"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleFlip}
          className="px-6 py-3.5 rounded-full bg-amber-400 text-black font-mono text-xs uppercase tracking-wider font-bold active:scale-95 transition-all shadow-lg shadow-amber-400/10 flex items-center gap-2"
        >
          <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
        </button>

        <button
          onClick={handleNext}
          className="w-13 h-13 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-400/50 active:scale-90 transition-all flex items-center justify-center shadow-lg"
          aria-label="Next card"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
