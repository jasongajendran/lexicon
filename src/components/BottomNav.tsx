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
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-3 pb-4 pt-2 pointer-events-none">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-dock max-w-lg mx-auto rounded-full p-1.5 flex items-center justify-around pointer-events-auto border border-white/10 shadow-2xl"
      >
        {/* Tab 1: Feed / Main List */}
        <button
          onClick={() => {
            triggerHaptic();
            if (currentTab === 'study') {
              setCurrentTab('feed');
            } else {
              // Toggle list vs grid mode
              setViewMode(viewMode === 'list' ? 'grid' : 'list');
            }
          }}
          className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all ${
            currentTab === 'feed' && !showOnlyBookmarks
              ? 'text-amber-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {currentTab === 'feed' && !showOnlyBookmarks && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/15 border border-amber-400/30 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          {viewMode === 'list' ? <BookOpen size={18} /> : <LayoutGrid size={18} />}
          <span className="text-[10px] font-mono tracking-tight mt-0.5">
            {currentTab === 'study' ? 'Feed' : viewMode === 'list' ? 'List' : 'Grid'}
          </span>
        </button>

        {/* Tab 2: Filter Drawer */}
        <button
          onClick={() => {
            triggerHaptic();
            onOpenFilterSheet();
          }}
          className="relative flex flex-col items-center justify-center py-2 px-3 rounded-full text-zinc-400 hover:text-zinc-200 transition-all"
        >
          <Search size={18} />
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Filter</span>
        </button>

        {/* Tab 3: Interactive Study / Flashcard Mode */}
        <button
          onClick={() => {
            triggerHaptic();
            setCurrentTab('study');
            setShowOnlyBookmarks(false);
          }}
          className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all ${
            currentTab === 'study'
              ? 'text-amber-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {currentTab === 'study' && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/15 border border-amber-400/30 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          <Layers size={18} />
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Cards</span>
        </button>

        {/* Tab 4: Bookmarks / Saved Terms */}
        <button
          onClick={() => {
            triggerHaptic();
            setCurrentTab('feed');
            setShowOnlyBookmarks(!showOnlyBookmarks);
          }}
          className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all ${
            showOnlyBookmarks
              ? 'text-amber-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {showOnlyBookmarks && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/15 border border-amber-400/30 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          <div className="relative">
            <Bookmark size={18} className={showOnlyBookmarks ? 'fill-amber-400' : ''} />
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-400 text-black font-bold font-mono text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {bookmarkedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Saved</span>
        </button>

        {/* Tab 5: Random / Word of the Day */}
        <button
          onClick={() => {
            triggerHaptic();
            onSelectRandomWord();
          }}
          className="relative flex flex-col items-center justify-center py-2 px-3 rounded-full text-zinc-400 hover:text-amber-400 active:scale-95 transition-all"
          title="Surprise Random Term"
        >
          <Shuffle size={18} />
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Random</span>
        </button>
      </motion.div>
    </div>
  );
}
