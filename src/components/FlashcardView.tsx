import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  Bookmark,
  Shuffle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

interface FlashcardViewProps {
  words: LexiconWord[];
  bookmarkedIds: number[];
  onToggleBookmark: (id: number) => void;
}

// Helpers for dynamic vibrant styling based on Part of Speech
function getPosTheme(pos: string) {
  const p = (pos || '').toLowerCase();
  if (p.includes('verb')) {
    return {
      tag: 'Verb / Action',
      badgeClass: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/30',
      frontGradient: 'from-cyan-950/80 via-zinc-900/90 to-blue-950/90',
      backGradient: 'from-blue-950/90 via-zinc-900/95 to-cyan-950/90',
      borderClass: 'border-cyan-500/30 hover:border-cyan-400/50',
      activeBorderClass: 'border-cyan-400/60 shadow-cyan-500/20',
      glowColor: 'bg-cyan-500/15',
      headingColor: 'text-cyan-400',
      tamilColor: 'text-cyan-200',
      accentBg: 'bg-cyan-400',
      accentText: 'text-cyan-300',
      speakerActive: 'bg-cyan-400 text-black',
      speakerInactive: 'bg-cyan-400/15 text-cyan-400 hover:bg-cyan-400/25',
      pulseBar: 'bg-cyan-400',
      buttonTheme: 'from-cyan-500 to-blue-600 shadow-cyan-500/25'
    };
  }
  if (p.includes('adj') || p.includes('adv')) {
    return {
      tag: 'Modifier / Attribute',
      badgeClass: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/30',
      frontGradient: 'from-emerald-950/80 via-zinc-900/90 to-teal-950/90',
      backGradient: 'from-teal-950/90 via-zinc-900/95 to-emerald-950/90',
      borderClass: 'border-emerald-500/30 hover:border-emerald-400/50',
      activeBorderClass: 'border-emerald-400/60 shadow-emerald-500/20',
      glowColor: 'bg-emerald-500/15',
      headingColor: 'text-emerald-400',
      tamilColor: 'text-emerald-200',
      accentBg: 'bg-emerald-400',
      accentText: 'text-emerald-300',
      speakerActive: 'bg-emerald-400 text-black',
      speakerInactive: 'bg-emerald-400/15 text-emerald-400 hover:bg-emerald-400/25',
      pulseBar: 'bg-emerald-400',
      buttonTheme: 'from-emerald-500 to-teal-600 shadow-emerald-500/25'
    };
  }
  if (p.includes('idiom') || p.includes('slang') || p.includes('phrase')) {
    return {
      tag: 'Idiom & Slang',
      badgeClass: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-400/30',
      frontGradient: 'from-fuchsia-950/80 via-zinc-900/90 to-purple-950/90',
      backGradient: 'from-purple-950/90 via-zinc-900/95 to-fuchsia-950/90',
      borderClass: 'border-fuchsia-500/30 hover:border-fuchsia-400/50',
      activeBorderClass: 'border-fuchsia-400/60 shadow-fuchsia-500/20',
      glowColor: 'bg-fuchsia-500/15',
      headingColor: 'text-fuchsia-300',
      tamilColor: 'text-fuchsia-200',
      accentBg: 'bg-fuchsia-400',
      accentText: 'text-fuchsia-300',
      speakerActive: 'bg-fuchsia-400 text-black',
      speakerInactive: 'bg-fuchsia-400/15 text-fuchsia-400 hover:bg-fuchsia-400/25',
      pulseBar: 'bg-fuchsia-400',
      buttonTheme: 'from-fuchsia-500 to-purple-600 shadow-fuchsia-500/25'
    };
  }
  // Default Noun / Architecture / Tech entity
  return {
    tag: 'Noun / Concept',
    badgeClass: 'text-amber-300 bg-amber-500/15 border-amber-400/30',
    frontGradient: 'from-amber-950/80 via-zinc-900/90 to-orange-950/90',
    backGradient: 'from-orange-950/90 via-zinc-900/95 to-amber-950/90',
    borderClass: 'border-amber-500/30 hover:border-amber-400/50',
    activeBorderClass: 'border-amber-400/60 shadow-amber-500/20',
    glowColor: 'bg-amber-500/15',
    headingColor: 'text-amber-400',
    tamilColor: 'text-amber-200',
    accentBg: 'bg-amber-400',
    accentText: 'text-amber-300',
    speakerActive: 'bg-amber-400 text-black',
    speakerInactive: 'bg-amber-400/15 text-amber-400 hover:bg-amber-400/25',
    pulseBar: 'bg-amber-400',
    buttonTheme: 'from-amber-500 to-orange-600 shadow-amber-500/25'
  };
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

  // Persistent Shuffle Mode & History Stack
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const [shuffleHistory, setShuffleHistory] = useState<number[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const [exampleTab, setExampleTab] = useState<1 | 2>(1);

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
    setExampleTab(1);
    setShuffleHistory([0]);
    setHistoryPointer(0);
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
    setExampleTab(1);
    setDirection(1);

    if (isShuffleEnabled) {
      // If we are browsing back in history and now clicking next
      if (historyPointer < shuffleHistory.length - 1) {
        const nextPtr = historyPointer + 1;
        setHistoryPointer(nextPtr);
        setCurrentIndex(shuffleHistory[nextPtr]);
      } else {
        // Pick a new random card (different from current if deck > 1)
        let nextIdx = Math.floor(Math.random() * deck.length);
        if (deck.length > 1 && nextIdx === currentIndex) {
          nextIdx = (nextIdx + 1 + Math.floor(Math.random() * (deck.length - 1))) % deck.length;
        }
        setShuffleHistory(prev => [...prev, nextIdx]);
        setHistoryPointer(prev => prev + 1);
        setCurrentIndex(nextIdx);
      }
    } else {
      // Linear sequential next
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }
  };

  const handlePrev = () => {
    if (deck.length === 0) return;
    triggerHaptic();
    setIsFlipped(false);
    setExampleTab(1);
    setDirection(-1);

    if (isShuffleEnabled) {
      if (historyPointer > 0) {
        const prevPtr = historyPointer - 1;
        setHistoryPointer(prevPtr);
        setCurrentIndex(shuffleHistory[prevPtr]);
      } else {
        // At start of history, pick another random card or loop
        let randIdx = Math.floor(Math.random() * deck.length);
        if (deck.length > 1 && randIdx === currentIndex) {
          randIdx = (randIdx + 1) % deck.length;
        }
        setShuffleHistory(prev => [randIdx, ...prev]);
        setCurrentIndex(randIdx);
      }
    } else {
      // Linear sequential prev
      setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }
  };

  const handleFlip = () => {
    triggerHaptic(15);
    setIsFlipped(!isFlipped);
  };

  const toggleShuffle = () => {
    triggerHaptic(20);
    setIsShuffleEnabled(prev => {
      const nextState = !prev;
      if (nextState) {
        // Initialize shuffle history starting with current index
        setShuffleHistory([currentIndex]);
        setHistoryPointer(0);
      }
      return nextState;
    });
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
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleShuffle();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (deck[currentIndex]) {
          toggleMastered();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck, currentIndex, isFlipped, isShuffleEnabled, historyPointer, shuffleHistory]);

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
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-black font-mono text-xs font-bold shadow-lg shadow-amber-400/20"
        >
          View All Flashcards
        </button>
      </div>
    );
  }

  const currentWord = deck[currentIndex] || deck[0];
  const isBookmarked = bookmarkedIds.includes(currentWord.id);
  const isMastered = masteredIds.includes(currentWord.id);
  const theme = getPosTheme(currentWord.pos);

  const handleSpeakEnglish = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    setIsSpeakingEn(true);
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

  const hasSynonyms = Boolean(currentWord.synonyms && currentWord.synonyms.length > 0);
  const hasAntonyms = Boolean(currentWord.antonyms && currentWord.antonyms.length > 0);

  return (
    <div 
      className="flex flex-col items-center justify-between min-h-[75vh] py-3 px-3 sm:px-4 max-w-xl mx-auto w-full select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Deck Header & Controls */}
      <div className="w-full space-y-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-medium">
                Active Recall Deck
              </span>
              {isShuffleEnabled && (
                <span className="text-[10px] font-mono text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.2 rounded-full animate-pulse flex items-center gap-1 font-semibold">
                  <Shuffle size={10} />
                  Shuffle ON
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-mono text-white font-bold">
                {currentIndex + 1} <span className="text-zinc-500 font-normal">/ {deck.length}</span>
              </span>
              {masteredIds.length > 0 && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 flex items-center gap-1">
                  <CheckCircle2 size={12} className="fill-emerald-400/20" />
                  <span>{masteredIds.length} Mastered</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Persistent Shuffle Toggle Button */}
            <button
              onClick={toggleShuffle}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono font-medium ${
                isShuffleEnabled
                  ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-lg shadow-amber-400/25 scale-105'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-zinc-700 active:scale-95'
              }`}
              title={isShuffleEnabled ? 'Shuffle Mode Active (Click to Turn OFF)' : 'Turn ON Persistent Shuffle Mode (S)'}
            >
              <Shuffle size={14} className={isShuffleEnabled ? 'animate-spin-slow' : ''} />
              <span className="hidden sm:inline">{isShuffleEnabled ? 'Random ON' : 'Shuffle'}</span>
            </button>

            {/* Reset to Card #1 */}
            <button
              onClick={() => {
                triggerHaptic();
                setCurrentIndex(0);
                setIsFlipped(false);
                setShuffleHistory([0]);
                setHistoryPointer(0);
              }}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all"
              title="Reset to Card #1"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Deck Mode Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900/90 rounded-2xl border border-zinc-800/90 text-xs font-mono">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all ${
              filterMode === 'all'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-md shadow-amber-400/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({words.length})
          </button>
          <button
            onClick={() => setFilterMode('saved')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all ${
              filterMode === 'saved'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-md shadow-amber-400/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Saved ({bookmarkedIds.length})
          </button>
          <button
            onClick={() => setFilterMode('unmastered')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all ${
              filterMode === 'unmastered'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-md shadow-amber-400/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Unmastered ({deck.length - masteredIds.length})
          </button>
        </div>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden mb-4">
        <motion.div
          className={`h-full ${theme.accentBg} shadow-sm`}
          animate={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div className="w-full relative aspect-[4/5] sm:aspect-[16/11] perspective-1000 my-auto cursor-pointer">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, x: direction * 45, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 45, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            {/* 3D Rotating Inner Card */}
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              onClick={handleFlip}
              className="w-full h-full relative rounded-3xl"
            >
              {/* ================= FRONT FACE ================= */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)',
                  visibility: isFlipped ? 'hidden' : 'visible'
                }}
                className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl bg-gradient-to-br ${theme.frontGradient} border ${theme.borderClass} text-zinc-100 transition-all duration-300 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
              >
                {/* Dynamic Multi-Color Ambient Glow Spheres */}
                <div className={`absolute -top-16 -right-16 w-48 h-48 ${theme.glowColor} rounded-full blur-3xl pointer-events-none`} />
                <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Action Ribbon */}
                <div className="flex items-center justify-between z-10 relative">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono px-3 py-1 rounded-full border uppercase tracking-wider font-semibold ${theme.badgeClass}`}>
                      {currentWord.pos}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-800 hidden sm:inline">
                      {theme.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMastered}
                      className={`p-2 rounded-xl transition-all border ${
                        isMastered
                          ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40 shadow-lg shadow-emerald-400/15'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-emerald-400'
                      }`}
                      title={isMastered ? 'Marked as Mastered (M)' : 'Mark as Mastered (M)'}
                    >
                      <CheckCircle2 size={16} className={isMastered ? 'fill-emerald-400/20' : ''} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic();
                        onToggleBookmark(currentWord.id);
                      }}
                      className={`p-2 rounded-xl transition-all border ${
                        isBookmarked
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-lg shadow-amber-400/15'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-amber-400'
                      }`}
                      title="Bookmark card"
                    >
                      <Bookmark size={16} className={isBookmarked ? 'fill-amber-400' : ''} />
                    </button>

                    <button
                      onClick={handleSpeakEnglish}
                      className={`p-2 rounded-xl transition-all border border-transparent ${
                        isSpeakingEn ? theme.speakerActive : theme.speakerInactive
                      }`}
                      title="Pronounce in English"
                    >
                      {isSpeakingEn ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                </div>

                {/* Front Side Hero Body */}
                <div className="my-auto flex flex-col items-center text-center z-10 py-2">
                  <h2 className={`text-4xl sm:text-5xl md:text-6xl font-serif font-bold ${theme.headingColor} mb-3 tracking-tight drop-shadow-md`}>
                    {currentWord.word}
                  </h2>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 shadow-inner mb-4">
                    <span className={`text-lg sm:text-xl font-tamil ${theme.tamilColor} font-semibold`}>
                      {currentWord.taWord}
                    </span>
                  </div>

                  {/* Peek Feature Chips */}
                  <div className="flex items-center gap-2 flex-wrap justify-center mt-2">
                    {hasSynonyms && (
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        {currentWord.synonyms?.length} Synonyms
                      </span>
                    )}
                    {hasAntonyms && (
                      <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                        {currentWord.antonyms?.length} Antonyms
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                      Engineering Context
                    </span>
                  </div>
                </div>

                {/* Front Footer Tap Prompt */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800/70 pt-3 z-10">
                  <span className={`flex items-center gap-1.5 text-[11px] ${theme.accentText} font-medium`}>
                    <Sparkles size={13} className="animate-pulse" />
                    Tap card to Flip & Reveal
                  </span>
                  <span className="text-[10px] text-zinc-500 hidden sm:inline">
                    Keys: Space (Flip), ← / → (Nav), S (Shuffle)
                  </span>
                </div>
              </div>

              {/* ================= BACK FACE ================= */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  visibility: isFlipped ? 'visible' : 'hidden'
                }}
                className={`absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-2xl bg-gradient-to-br ${theme.backGradient} border ${theme.activeBorderClass} text-zinc-100 transition-all duration-300 ${
                  isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Dynamic Ambient Background Glow */}
                <div className={`absolute -bottom-16 -left-16 w-48 h-48 ${theme.glowColor} rounded-full blur-3xl pointer-events-none`} />
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Header on Back */}
                <div className="flex items-center justify-between z-10 relative pb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono ${theme.badgeClass} px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider`}>
                      Answer & Details
                    </span>
                    <span className={`text-base font-serif font-bold ${theme.headingColor}`}>
                      {currentWord.word}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleSpeakEnglish}
                      className={`p-1.5 rounded-xl border border-transparent ${
                        isSpeakingEn ? theme.speakerActive : theme.speakerInactive
                      }`}
                      title="Pronounce in English"
                    >
                      {isSpeakingEn ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={15} />}
                    </button>
                  </div>
                </div>

                {/* Back Side Scrollable / Structured Content */}
                <div className="my-auto flex flex-col z-10 space-y-2.5 py-1 overflow-y-auto max-h-[72%] pr-1">
                  {/* Definition Box */}
                  <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 shadow-sm">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1 font-semibold flex items-center gap-1">
                      <BookOpen size={11} className={theme.accentText} />
                      Definition
                    </span>
                    <p className="text-xs sm:text-sm font-sans text-zinc-100 leading-relaxed font-normal">
                      {currentWord.definition}
                    </p>
                  </div>

                  {/* Context Cards with Dual Example Switcher */}
                  <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono ${theme.accentText} uppercase tracking-widest block font-semibold`}>
                        {exampleTab === 1 ? 'Context 1' : 'Context 2'}
                      </span>
                      {currentWord.enExample2 && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic();
                              setExampleTab(1);
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                              exampleTab === 1
                                ? 'bg-amber-400 text-black font-bold'
                                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                            }`}
                          >
                            Ex 1
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic();
                              setExampleTab(2);
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                              exampleTab === 2
                                ? 'bg-amber-400 text-black font-bold'
                                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                            }`}
                          >
                            Ex 2
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-serif text-zinc-200 italic leading-relaxed">
                        "{exampleTab === 2 && currentWord.enExample2 ? currentWord.enExample2 : currentWord.enExample}"
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-zinc-800/50">
                      <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest block mb-0.5 font-medium">
                        Tamil Usage ({currentWord.taWord})
                      </span>
                      <p className="text-xs font-tamil text-zinc-300 leading-relaxed">
                        "{exampleTab === 2 && currentWord.taExample2 ? currentWord.taExample2 : currentWord.taExample}"
                      </p>
                    </div>
                  </div>

                  {/* Synonyms & Antonyms Chips */}
                  {(hasSynonyms || hasAntonyms) && (
                    <div className="flex flex-col gap-1.5 pt-0.5 text-xs font-mono">
                      {hasSynonyms && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold">Syn:</span>
                          <div className="flex flex-wrap gap-1">
                            {currentWord.synonyms?.map((syn, i) => (
                              <span
                                key={i}
                                className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md"
                              >
                                {syn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {hasAntonyms && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider text-rose-400/80 font-bold">Ant:</span>
                          <div className="flex flex-wrap gap-1">
                            {currentWord.antonyms?.map((ant, i) => (
                              <span
                                key={i}
                                className="text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md"
                              >
                                {ant}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Back Footer */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-zinc-800/70 pt-2.5 z-10">
                  <button
                    onClick={toggleMastered}
                    className={`flex items-center gap-1.5 text-xs font-mono transition-all ${
                      isMastered ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-emerald-400'
                    }`}
                  >
                    <CheckCircle2 size={15} className={isMastered ? 'fill-emerald-400/20' : ''} />
                    <span>{isMastered ? 'Mastered!' : 'Mark Mastered (M)'}</span>
                  </button>
                  <span className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
                    Tap to flip back
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-5 w-full">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 active:scale-90 transition-all flex items-center justify-center shadow-lg"
          aria-label="Previous card"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleFlip}
          className={`px-7 py-3.5 rounded-2xl bg-gradient-to-r ${theme.buttonTheme} text-black font-mono text-xs uppercase tracking-wider font-bold active:scale-95 transition-all shadow-xl flex items-center gap-2`}
        >
          <Layers size={14} />
          <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
        </button>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 active:scale-90 transition-all flex items-center justify-center shadow-lg"
          aria-label="Next card"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
