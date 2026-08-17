import { motion } from 'motion/react';
import { BookOpen, Search, Layers, Bookmark, Shuffle, LayoutGrid, List } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'feed' | 'study';
  setCurrentTab: (tab: 'feed' | 'study') => void;
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  onOpenFilterSheet: () => void;
  showOnlyBookmarks: boolean;
  setShowOnlyBookmarks: (val: boolean) => void;
  bookmarkedCount: number;
  onSelectRandomWord: () => void;
}

export function BottomNav({
  currentTab,
  setCurrentTab,
  viewMode,
  setViewMode,
  onOpenFilterSheet,
  showOnlyBookmarks,
  setShowOnlyBookmarks,
  bookmarkedCount,
  onSelectRandomWord
}: BottomNavProps) {
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
    <div className="fixed bottom-2 left-0 right-0 z-40 lg:hidden px-4 pb-2 pt-1 pointer-events-none">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-dock max-w-xs mx-auto rounded-full p-1.5 flex items-center justify-around pointer-events-auto border border-white/10 shadow-2xl shadow-black/80 backdrop-blur-xl bg-zinc-950/85"
      >
        {/* Tab 1: Feed / Main List View Mode Switcher */}
        <button
          onClick={() => {
            triggerHaptic();
            if (currentTab === 'study') {
              setCurrentTab('feed');
            } else {
              setViewMode(viewMode === 'list' ? 'grid' : 'list');
            }
          }}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            currentTab === 'feed' && !showOnlyBookmarks
              ? 'text-amber-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={currentTab === 'study' ? 'Switch to Feed' : `Switch to ${viewMode === 'list' ? 'Grid' : 'List'} View`}
          aria-label={currentTab === 'study' ? 'Switch to Feed' : `Switch to ${viewMode === 'list' ? 'Grid' : 'List'} View`}
        >
          {currentTab === 'feed' && !showOnlyBookmarks && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/20 border border-amber-400/40 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          {viewMode === 'list' ? <BookOpen size={19} /> : <LayoutGrid size={19} />}
        </button>

        {/* Tab 2: Filter Drawer */}
        <button
          onClick={() => {
            triggerHaptic();
            onOpenFilterSheet();
          }}
          className="relative p-2.5 rounded-full text-zinc-400 hover:text-zinc-200 transition-all flex items-center justify-center"
          title="Open Filter & Search"
          aria-label="Open Filter & Search"
        >
          <Search size={19} />
        </button>

        {/* Tab 3: Interactive Study / Flashcard Mode */}
        <button
          onClick={() => {
            triggerHaptic();
            setCurrentTab('study');
            setShowOnlyBookmarks(false);
          }}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            currentTab === 'study'
              ? 'text-amber-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Interactive Flashcards"
          aria-label="Interactive Flashcards"
        >
          {currentTab === 'study' && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/20 border border-amber-400/40 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          <Layers size={19} />
        </button>

        {/* Tab 4: Bookmarks / Saved Terms */}
        <button
          onClick={() => {
            triggerHaptic();
            setCurrentTab('feed');
            setShowOnlyBookmarks(!showOnlyBookmarks);
          }}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            showOnlyBookmarks
              ? 'text-amber-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Saved Bookmarks"
          aria-label="Saved Bookmarks"
        >
          {showOnlyBookmarks && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/20 border border-amber-400/40 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          <div className="relative">
            <Bookmark size={19} className={showOnlyBookmarks ? 'fill-amber-400' : ''} />
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-black font-bold font-mono text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                {bookmarkedCount}
              </span>
            )}
          </div>
        </button>

        {/* Tab 5: Random / Word of the Day */}
        <button
          onClick={() => {
            triggerHaptic();
            onSelectRandomWord();
          }}
          className="relative p-2.5 rounded-full text-zinc-400 hover:text-amber-400 active:scale-90 transition-all flex items-center justify-center"
          title="Random Word"
          aria-label="Random Word"
        >
          <Shuffle size={19} />
        </button>
      </motion.div>
    </div>
  );
}
