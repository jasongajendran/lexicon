import React, { useState, useEffect } from 'react';
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
  const [deck, setDeck] = useState<LexiconWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  useEffect(() => {
    setDeck(words);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [words]);

  if (!deck || deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-amber-400">
          <HelpCircle size={28} />
        </div>
        <h3 className="text-2xl font-serif italic text-zinc-200 mb-2">No Flashcards Available</h3>
        <p className="text-zinc-500 font-sans text-sm max-w-sm">
          Select a different letter or filter to populate the flashcard study deck.
        </p>
      </div>
    );
  }

  const currentWord = deck[currentIndex] || deck[0];
  const isBookmarked = bookmarkedIds.includes(currentWord.id);
  const isMastered = masteredIds.includes(currentWord.id);

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
    triggerHaptic();
    setIsFlipped(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
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
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    speakWord(currentWord.word);
  };

  const toggleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(25);
    setMasteredIds((prev) =>
      prev.includes(currentWord.id)
        ? prev.filter((id) => id !== currentWord.id)
        : [...prev, currentWord.id]
    );
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[75vh] py-6 px-4 max-w-xl mx-auto w-full">
      {/* Deck Header & Controls */}
      <div className="w-full flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
            Interactive Deck
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-mono text-amber-400 font-medium">
              {currentIndex + 1} / {deck.length}
            </span>
            {masteredIds.length > 0 && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                {masteredIds.length} Mastered
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-amber-400 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Shuffle Deck"
          >
            <Shuffle size={15} />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition-all"
            title="Reset to First"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-amber-400"
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            {/* 3D Rotating Inner Card */}
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
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
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800/90 px-3 py-1 rounded-full border border-zinc-700/60 uppercase tracking-widest">
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
                      title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
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
                    >
                      <Bookmark size={18} className={isBookmarked ? 'fill-amber-400' : ''} />
                    </button>
                    <button
                      onClick={handleSpeak}
                      className="p-2 rounded-full bg-amber-400/15 text-amber-400 hover:bg-amber-400/25 active:scale-95 transition-all"
                      title="Pronounce"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Front Side Body */}
                <div className="my-auto flex flex-col items-center text-center z-10 py-6">
                  <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-zinc-50 mb-3 tracking-tight">
                    {currentWord.word}
                  </h2>
                  <p className="text-lg font-tamil text-amber-400 font-medium mb-3">
                    {currentWord.taWord}
                  </p>
                  <div className="w-12 h-0.5 bg-amber-400/50 rounded-full my-3" />
                  <p className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
                    Tap card to reveal definition
                  </p>
                </div>

                {/* Front Footer */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-zinc-800/80 pt-4 z-10">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Sparkles size={12} className="text-amber-400" />
                    Tap to Flip
                  </span>
                  <span className="text-[11px]">Swipe or use arrows</span>
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
                className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl bg-[#181822] border border-amber-400/50 text-zinc-100 transition-all duration-200 ${
                  isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Ambient Background Glow */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Actions on Back */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 uppercase tracking-widest font-medium">
                    Answer / Definition
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeak}
                      className="p-2 rounded-full bg-amber-400/15 text-amber-400 hover:bg-amber-400/25 active:scale-95 transition-all"
                      title="Pronounce"
                    >
                      <Volume2 size={18} />
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

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-0.5 font-medium">
                      Context Example
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
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-zinc-800/80 pt-4 z-10">
                  <span className="flex items-center gap-1 text-[11px] text-amber-400">
                    <Sparkles size={12} />
                    Answer Revealed
                  </span>
                  <span className="text-[11px]">Tap card to flip back</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next / Prev Touch Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-8 w-full">
        <button
          onClick={handlePrev}
          className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-400/50 active:scale-90 transition-all flex items-center justify-center shadow-lg"
          aria-label="Previous card"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleFlip}
          className="px-6 py-3.5 rounded-full bg-amber-400 text-black font-mono text-xs uppercase tracking-wider font-semibold active:scale-95 transition-all shadow-lg shadow-amber-400/10 flex items-center gap-2"
        >
          <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
        </button>

        <button
          onClick={handleNext}
          className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-400/50 active:scale-90 transition-all flex items-center justify-center shadow-lg"
          aria-label="Next card"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
