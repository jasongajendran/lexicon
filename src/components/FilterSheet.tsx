import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Check, Bookmark, Filter, ChevronDown, BookOpen, Layers, Shuffle, RotateCcw } from 'lucide-react';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeLetter: string;
  setActiveLetter: (letter: string) => void;
  activePos: string;
  setActivePos: (pos: string) => void;
  alphabet: string[];
  posTypes: string[];
  addressedLetters: string[];
  totalTerms: number;
  bookmarkedCount: number;
  showOnlyBookmarks: boolean;
  setShowOnlyBookmarks: (v: boolean) => void;
  isShuffled: boolean;
  onToggleShuffle: () => void;
}

export function FilterSheet({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  activeLetter,
  setActiveLetter,
  activePos,
  setActivePos,
  alphabet,
  posTypes,
  addressedLetters,
  totalTerms,
  bookmarkedCount,
  showOnlyBookmarks,
  setShowOnlyBookmarks,
  isShuffled,
  onToggleShuffle
}: FilterSheetProps) {
  // All accordion sections collapsed by default on initial load
  const [openSection, setOpenSection] = useState<'alphabet' | 'category' | 'saved' | null>(null);

  if (!isOpen) return null;

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch (e) {
        // ignore
      }
    }
  };

  const toggleSection = (section: 'alphabet' | 'category' | 'saved') => {
    triggerHaptic();
    setOpenSection(prev => prev === section ? null : section);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Bottom Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-[#121215] border-t border-zinc-800 rounded-t-3xl p-5 sm:p-6 shadow-2xl z-10 overflow-y-auto no-scrollbar flex flex-col"
        >
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mb-4 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-amber-400" />
              <h3 className="text-lg font-serif italic text-zinc-100">Index & Search Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-800/60 text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Compact Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search English or Tamil terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Accordion Filter Groups (1 Open by Default, others Collapsed) */}
          <div className="space-y-3 mb-5">
            {/* Section 1: A–Z Alphabetical Index (Open on initial load) */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection('alphabet')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-serif italic text-sm">
                    A
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 block">
                      A–Z Alphabet Index
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {activeLetter === 'all' ? 'Showing All Letters' : `Filtered by '${activeLetter}'`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    activeLetter !== 'all' ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {activeLetter.toUpperCase()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 transition-transform duration-200 ${
                      openSection === 'alphabet' ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'alphabet' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 pt-1 border-t border-zinc-800/50">
                      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            triggerHaptic();
                            setActiveLetter('all');
                          }}
                          className={`h-9 flex items-center justify-center rounded-xl text-xs font-serif italic transition-all border ${
                            activeLetter === 'all'
                              ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-sm'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          ALL
                        </button>
                        {alphabet.map((letter) => {
                          const isAddressed = addressedLetters.includes(letter);
                          return (
                            <button
                              key={letter}
                              disabled={!isAddressed}
                              onClick={() => {
                                triggerHaptic();
                                if (isAddressed) setActiveLetter(letter);
                              }}
                              className={`h-9 flex items-center justify-center rounded-xl text-xs font-serif italic transition-all border ${
                                activeLetter === letter
                                  ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-sm'
                                  : isAddressed
                                  ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-amber-400/40'
                                  : 'bg-zinc-950 text-zinc-700 border-zinc-900 opacity-40 cursor-not-allowed'
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 2: Category / Part of Speech (Collapsed on initial load) */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection('category')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                    <Layers size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 block">
                      Category / Part of Speech
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {activePos === 'all' ? 'All Grammatical Types' : `Selected: ${activePos}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    activePos !== 'all' ? 'bg-cyan-400 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {activePos.toUpperCase()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 transition-transform duration-200 ${
                      openSection === 'category' ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'category' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 pt-1 border-t border-zinc-800/50">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 pt-1">
                        {posTypes.map((pos) => (
                          <button
                            key={pos}
                            onClick={() => {
                              triggerHaptic();
                              setActivePos(pos);
                            }}
                            className={`py-2 px-2.5 rounded-xl text-xs font-mono tracking-wider transition-all border text-center ${
                              activePos === pos
                                ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-sm'
                                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            {pos.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 3: Saved Items / Bookmarks (Collapsed on initial load) */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection('saved')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <Bookmark size={14} className={showOnlyBookmarks ? 'fill-amber-400' : ''} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 block">
                      Saved & Bookmarked Items
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {bookmarkedCount} saved in offline storage
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    showOnlyBookmarks ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {showOnlyBookmarks ? 'ACTIVE' : `${bookmarkedCount} SAVED`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 transition-transform duration-200 ${
                      openSection === 'saved' ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'saved' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 pt-1 border-t border-zinc-800/50">
                      <button
                        onClick={() => {
                          triggerHaptic();
                          setShowOnlyBookmarks(!showOnlyBookmarks);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                          showOnlyBookmarks
                            ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs font-mono">
                          <Bookmark size={15} className={showOnlyBookmarks ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'} />
                          <span>Show Only Saved Words</span>
                        </div>
                        {showOnlyBookmarks && <Check size={16} className="text-amber-400" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 4: Shuffle Toggle */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isShuffled ? 'bg-amber-400 text-black font-bold' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                }`}>
                  <Shuffle size={14} />
                </div>
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 block">
                    Shuffle Word Order
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {isShuffled ? 'Random order within selection' : 'Alphabetical order'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic();
                  onToggleShuffle();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                  isShuffled
                    ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <span>{isShuffled ? 'SHUFFLED' : 'ORDERED'}</span>
              </button>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-amber-400 text-black font-mono text-xs uppercase tracking-wider font-bold shadow-lg active:scale-98 transition-all"
          >
            Apply Filters ({totalTerms} Terms)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
