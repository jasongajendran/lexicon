import { motion } from 'motion/react';
import { BookOpen, Search, Layers, Bookmark, Trophy, Headphones, LayoutGrid } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'feed' | 'study' | 'quiz' | 'walkman';
  setCurrentTab: (tab: 'feed' | 'study' | 'quiz' | 'walkman') => void;
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
    <div className="fixed bottom-2 left-0 right-0 z-40 lg:hidden px-3 pb-2 pt-1 pointer-events-none">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-dock max-w-sm mx-auto rounded-full p-1.5 flex items-center justify-around pointer-events-auto border border-white/10 shadow-2xl shadow-black/80 backdrop-blur-xl bg-zinc-950/90"
      >
        {/* Tab 1: Feed (Dictionary) */}
        <button
          onClick={() => {
            triggerHaptic();
            if (currentTab !== 'feed') {
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
          title={currentTab === 'feed' ? `Switch to ${viewMode === 'list' ? 'Grid' : 'List'} View` : 'Vocabulary Feed'}
          aria-label="Vocabulary Feed"
        >
          {currentTab === 'feed' && !showOnlyBookmarks && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/20 border border-amber-400/40 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          {viewMode === 'list' ? <BookOpen size={18} /> : <LayoutGrid size={18} />}
        </button>

        {/* Tab 2: Flashcards (Study) */}
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
          <Layers size={18} />
        </button>

        {/* Tab 3: Quiz Arena */}
        <button
          onClick={() => {
            triggerHaptic();
            setCurrentTab('quiz');
            setShowOnlyBookmarks(false);
          }}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            currentTab === 'quiz'
              ? 'text-amber-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Quiz Challenge Arena"
          aria-label="Quiz Challenge Arena"
        >
          {currentTab === 'quiz' && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/20 border border-amber-400/40 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          <Trophy size={18} />
        </button>

        {/* Tab 4: Audio Walkman */}
        <button
          onClick={() => {
            triggerHaptic();
            setCurrentTab('walkman');
            setShowOnlyBookmarks(false);
          }}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            currentTab === 'walkman'
              ? 'text-cyan-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Audio Walkman (Hands-Free Listening)"
          aria-label="Audio Walkman"
        >
          {currentTab === 'walkman' && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-cyan-400/20 border border-cyan-400/40 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          <Headphones size={18} />
        </button>

        {/* Tab 5: Filter & Search Drawer */}
        <button
          onClick={() => {
            triggerHaptic();
            onOpenFilterSheet();
          }}
          className="relative p-2.5 rounded-full text-zinc-400 hover:text-zinc-200 transition-all flex items-center justify-center"
          title="Open Filter & Search"
          aria-label="Open Filter & Search"
        >
          <Search size={18} />
        </button>

        {/* Tab 6: Bookmarks / Saved Terms */}
        <button
          onClick={() => {
            triggerHaptic();
            setCurrentTab('feed');
            setShowOnlyBookmarks(!showOnlyBookmarks);
          }}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            showOnlyBookmarks && currentTab === 'feed'
              ? 'text-amber-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Saved Bookmarks"
          aria-label="Saved Bookmarks"
        >
          {showOnlyBookmarks && currentTab === 'feed' && (
            <motion.div
              layoutId="bottomNavBubble"
              className="absolute inset-0 bg-amber-400/20 border border-amber-400/40 rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          <div className="relative">
            <Bookmark size={18} className={showOnlyBookmarks && currentTab === 'feed' ? 'fill-amber-400' : ''} />
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-black font-bold font-mono text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                {bookmarkedCount}
              </span>
            )}
          </div>
        </button>
      </motion.div>
    </div>
  );
}
