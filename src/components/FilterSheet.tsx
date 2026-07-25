import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Check, Bookmark, Filter, Sparkles } from 'lucide-react';

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
  setShowOnlyBookmarks
}: FilterSheetProps) {
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
          className="relative w-full max-w-2xl max-h-[85vh] bg-[#121215] border-t border-zinc-800 rounded-t-3xl p-6 shadow-2xl z-10 overflow-y-auto no-scrollbar"
        >
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mb-6 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search English or Tamil terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl py-3.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Saved Terms Quick Toggle */}
          <div className="mb-6">
            <button
              onClick={() => {
                triggerHaptic();
                setShowOnlyBookmarks(!showOnlyBookmarks);
              }}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                showOnlyBookmarks
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark size={18} className={showOnlyBookmarks ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'} />
                <div className="text-left">
                  <span className="text-sm font-medium block">Filter Saved / Bookmarked Terms</span>
                  <span className="text-xs text-zinc-500 font-mono">{bookmarkedCount} terms saved in offline cache</span>
                </div>
              </div>
              {showOnlyBookmarks && <Check size={18} className="text-amber-400" />}
            </button>
          </div>

          {/* Part of Speech Filters */}
          <div className="mb-6">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">Part of Speech</h4>
            <div className="grid grid-cols-4 gap-2">
              {posTypes.map((pos) => (
                <button
                  key={pos}
                  onClick={() => {
                    triggerHaptic();
                    setActivePos(pos);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono tracking-wider transition-all border text-center ${
                    activePos === pos
                      ? 'bg-amber-400 text-black border-amber-400 font-bold'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {pos.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet Letter Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Alphabetical Index</h4>
              <span className="text-xs font-mono text-amber-400">A to Z Complete</span>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
              <button
                onClick={() => {
                  triggerHaptic();
                  setActiveLetter('all');
                }}
                className={`h-11 flex items-center justify-center rounded-xl text-xs font-serif italic transition-all border ${
                  activeLetter === 'all'
                    ? 'bg-amber-400 text-black border-amber-400 font-bold'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800'
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
                    className={`h-11 flex items-center justify-center rounded-xl text-xs font-serif italic transition-all border ${
                      activeLetter === letter
                        ? 'bg-amber-400 text-black border-amber-400 font-bold'
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

          {/* Apply Button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-amber-400 text-black font-mono text-xs uppercase tracking-wider font-bold shadow-lg active:scale-98 transition-all"
          >
            Apply Filters & View ({totalTerms} Terms)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
