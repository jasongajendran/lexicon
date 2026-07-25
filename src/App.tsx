import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Search, Bookmark, LayoutGrid, List, Layers, Shuffle, Sparkles, Filter, X } from 'lucide-react';
import { wordsData } from './data';
import { WordRow } from './components/WordRow';
import { WordCard } from './components/WordCard';
import { WordDetailModal } from './components/WordDetailModal';
import { FlashcardView } from './components/FlashcardView';
import { FilterSheet } from './components/FilterSheet';
import { BottomNav } from './components/BottomNav';
import { LexiconWord } from './types';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ADDRESSED_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const POS_TYPES = ["all", "noun", "verb", "adj."];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('all');
  const [activePos, setActivePos] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // New Tablet & Mobile State Features
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentTab, setCurrentTab] = useState<'feed' | 'study'>('feed');
  const [selectedWord, setSelectedWord] = useState<LexiconWord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('lexicon-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lexicon-bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const toggleBookmark = (id: number) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const handleSelectRandomWord = () => {
    if (wordsData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * wordsData.length);
    setSelectedWord(wordsData[randomIndex]);
    setIsDetailOpen(true);
  };

  const handleWordLinkClick = (wordText: string) => {
    const foundWord = wordsData.find(w => w.word.toLowerCase() === wordText.toLowerCase());
    if (foundWord) {
      setSelectedWord(foundWord);
      if (!isDetailOpen) setIsDetailOpen(true);
    } else {
      // Do nothing silently or we can alert
      // We will just do a console log for now since not all words might be there
      console.log(`Word not found in lexicon: ${wordText}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredWords = wordsData.filter((w) => {
    const matchesSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.taWord.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter = activeLetter === 'all' || w.word.toUpperCase().startsWith(activeLetter);
    const matchesPos = activePos === 'all' || w.pos === activePos;
    const matchesBookmark = !showOnlyBookmarks || bookmarkedIds.includes(w.id);
    
    return matchesSearch && matchesLetter && matchesPos && matchesBookmark;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 flex flex-col lg:flex-row overflow-x-hidden selection:bg-amber-400 selection:text-black pb-24 lg:pb-0">
      
      {/* Top Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-amber-400 origin-left z-50 shadow-[0_0_10px_#fbbf24]" 
        style={{ scaleX }} 
      />

      {/* Subtle Noise Overlay for Editorial feel */}
      <div 
        className="fixed inset-0 opacity-[0.025] pointer-events-none mix-blend-screen z-50" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Background Dynamic Letter */}
      <div className="fixed right-[-10vw] top-[-5vh] text-[40vw] font-serif italic text-zinc-900/20 select-none pointer-events-none -z-10 transition-all duration-700">
        {activeLetter !== 'all' ? activeLetter : 'L'}
      </div>

      {/* Left Sidebar (Desktop & Wide Screen) */}
      <motion.aside 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="lg:w-[35%] xl:w-[30%] lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl z-10 flex flex-col p-6 md:p-10 lg:p-12 overflow-y-auto no-scrollbar"
      >
        <div className="flex-grow">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-black font-serif italic font-bold shadow-md shadow-amber-400/20">L</div>
              <div>
                <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase block font-semibold">Lexicon</span>
                <span className="text-[10px] font-mono text-amber-400/80 block">Engineer Edition</span>
              </div>
            </div>

            <button
              onClick={handleSelectRandomWord}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 active:scale-95 transition-all text-xs font-mono flex items-center gap-1.5"
              title="Surprise Word"
            >
              <Shuffle size={14} />
              <span className="hidden sm:inline">Random</span>
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.08] mb-6 tracking-tight">
            The <br/> Engineer's <br/> <span className="italic text-amber-400">Vocabulary.</span>
          </h1>
          
          <p className="text-zinc-400 text-sm md:text-base font-sans font-light leading-relaxed mb-8 max-w-sm">
            Advanced, pragmatic terms essential for the modern software engineer. Curated for clarity in English and Tamil.
          </p>

          {/* Search Bar */}
          <div className="relative group mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search terms or Tamil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800/80 text-zinc-100 rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all placeholder:text-zinc-600 font-sans text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Bookmarks Filter Toggle */}
          <div className="mb-8">
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-xs font-mono ${
                showOnlyBookmarks
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark size={15} className={showOnlyBookmarks ? 'fill-amber-400 text-amber-400' : ''} />
                <span>Show Bookmarked Terms</span>
              </div>
              <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-[10px]">
                {bookmarkedIds.length}
              </span>
            </button>
          </div>

          {/* POS Filters */}
          <div className="mb-8">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">Part of Speech</h3>
            <div className="flex flex-wrap gap-2">
              {POS_TYPES.map(pos => (
                <button
                  key={pos}
                  onClick={() => setActivePos(pos)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all border ${
                    activePos === pos 
                      ? 'bg-amber-400 text-black border-amber-400 font-bold' 
                      : 'bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-zinc-100'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet Index */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Index</h3>
              <span className="text-[10px] font-mono text-amber-400/90">Complete (A–Z)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => setActiveLetter('all')}
                className={`w-7 h-7 flex items-center justify-center text-xs font-serif italic transition-all rounded-lg ${
                  activeLetter === 'all' 
                    ? 'bg-amber-400 text-black font-medium' 
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                All
              </button>
              {ALPHABET.map(letter => {
                const isAddressed = ADDRESSED_LETTERS.includes(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => isAddressed && setActiveLetter(letter)}
                    disabled={!isAddressed}
                    className={`w-7 h-7 flex items-center justify-center text-xs font-serif italic transition-all rounded-lg 
                      ${activeLetter === letter ? 'bg-amber-400 text-black font-medium' : 
                        isAddressed ? 'text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer' : 
                        'text-zinc-700 opacity-30 cursor-not-allowed'}`}
                    title={`View ${letter} words`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="hidden lg:block mt-8 pt-6 border-t border-zinc-800/50 text-xs font-mono text-zinc-600 uppercase tracking-widest">
          <div className="flex items-center justify-between">
            <span>Volume I • A–Z Complete</span>
            <span>{filteredWords.length} Terms</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Area */}
      <main className="lg:w-[65%] xl:w-[70%] min-h-screen relative">
        {/* Mobile & Tablet Header Controls */}
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterSheetOpen(true)}
              className="lg:hidden flex items-center gap-2 py-1.5 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-amber-400 transition-all"
            >
              <Filter size={14} className="text-amber-400" />
              <span>Index ({activeLetter.toUpperCase()})</span>
            </button>

            {/* Mode Indicator */}
            <span className="hidden sm:inline text-xs font-mono text-zinc-500 uppercase tracking-wider">
              {currentTab === 'study' ? 'Study Mode' : `${filteredWords.length} Terms`}
            </span>
          </div>

          {/* View Mode Switcher (List vs Grid vs Study) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab(currentTab === 'study' ? 'feed' : 'study')}
              className={`py-1.5 px-3 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-all ${
                currentTab === 'study'
                  ? 'bg-amber-400 text-black border-amber-400 font-medium'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Layers size={14} />
              <span className="hidden sm:inline">Flashcards</span>
            </button>

            {currentTab === 'feed' && (
              <div className="flex items-center p-1 bg-zinc-900 rounded-full border border-zinc-800">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === 'list' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <List size={15} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === 'grid' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Grid Bento View"
                >
                  <LayoutGrid size={15} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Mobile Alphabet Scroll Bar */}
        {currentTab === 'feed' && (
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-zinc-950/80 border-b border-zinc-900 no-scrollbar">
            <button 
              onClick={() => { setActiveLetter('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`shrink-0 px-3 py-1 text-[11px] font-serif italic transition-all rounded-md ${activeLetter === 'all' ? 'bg-amber-400 text-black font-medium' : 'text-zinc-400 bg-zinc-900/60'}`}
            >
              All
            </button>
            {ALPHABET.map(letter => {
              const isAddressed = ADDRESSED_LETTERS.includes(letter);
              return isAddressed ? (
                <button
                  key={letter}
                  onClick={() => { setActiveLetter(letter); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`shrink-0 w-8 h-6 flex items-center justify-center text-[11px] font-serif italic transition-all rounded-md 
                    ${activeLetter === letter ? 'bg-amber-400 text-black font-medium' : 'text-zinc-400 bg-zinc-900/60'}`}
                >
                  {letter}
                </button>
              ) : null;
            })}
          </div>
        )}

        {/* Content View Switching */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <AnimatePresence mode="wait">
            {currentTab === 'study' ? (
              <motion.div
                key="study-mode"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <FlashcardView
                  words={filteredWords}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={toggleBookmark}
                />
              </motion.div>
            ) : filteredWords.length > 0 ? (
              viewMode === 'list' ? (
                /* List View */
                <motion.div key="list-view" className="flex flex-col">
                  {filteredWords.map((word, index) => (
                    <WordRow 
                      key={word.id} 
                      word={word} 
                      index={index + 1} 
                      isBookmarked={bookmarkedIds.includes(word.id)}
                      onToggleBookmark={() => toggleBookmark(word.id)}
                      onSelectWord={(w) => {
                        setSelectedWord(w);
                        setIsDetailOpen(true);
                      }}
                      onWordSearch={handleWordLinkClick}
                    />
                  ))}
                </motion.div>
              ) : (
                /* Bento Grid View for Tablet & Desktop */
                <motion.div
                  key="grid-view"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 py-6"
                >
                  {filteredWords.map((word, index) => (
                    <WordCard
                      key={word.id}
                      word={word}
                      index={index + 1}
                      isBookmarked={bookmarkedIds.includes(word.id)}
                      onToggleBookmark={() => toggleBookmark(word.id)}
                      onSelectWord={(w) => {
                        setSelectedWord(w);
                        setIsDetailOpen(true);
                      }}
                      onWordSearch={handleWordLinkClick}
                    />
                  ))}
                </motion.div>
              )
            ) : (
              /* Empty State */
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[50vh] text-center px-8"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-zinc-600" />
                </div>
                <h3 className="text-2xl font-serif italic text-zinc-300 mb-2">No entries found</h3>
                <p className="text-zinc-500 font-sans text-sm">
                  {showOnlyBookmarks 
                    ? "You haven't bookmarked any terms matching these filters."
                    : "Try adjusting your search terms or filters."}
                </p>
                {showOnlyBookmarks && (
                  <button
                    onClick={() => setShowOnlyBookmarks(false)}
                    className="mt-4 px-4 py-2 rounded-full bg-amber-400 text-black text-xs font-mono font-medium"
                  >
                    Show All Terms
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {filteredWords.length > 0 && currentTab === 'feed' && (
            <footer className="py-20 text-center border-t border-zinc-800/50 mt-12">
              <p className="text-zinc-600 font-serif italic text-xl mb-4">End of Lexicon</p>
              <div className="w-12 h-[1px] bg-zinc-800 mx-auto" />
            </footer>
          )}
        </div>
      </main>

      {/* Expanded Word Detail Modal / Bottom Sheet */}
      <WordDetailModal
        word={selectedWord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isBookmarked={selectedWord ? bookmarkedIds.includes(selectedWord.id) : false}
        onToggleBookmark={() => selectedWord && toggleBookmark(selectedWord.id)}
        onWordSearch={handleWordLinkClick}
      />

      {/* Mobile Bottom Filter Sheet */}
      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeLetter={activeLetter}
        setActiveLetter={setActiveLetter}
        activePos={activePos}
        setActivePos={setActivePos}
        alphabet={ALPHABET}
        posTypes={POS_TYPES}
        addressedLetters={ADDRESSED_LETTERS}
        totalTerms={filteredWords.length}
        bookmarkedCount={bookmarkedIds.length}
        showOnlyBookmarks={showOnlyBookmarks}
        setShowOnlyBookmarks={setShowOnlyBookmarks}
      />

      {/* Mobile Floating Bottom Navigation Dock */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
        showOnlyBookmarks={showOnlyBookmarks}
        setShowOnlyBookmarks={setShowOnlyBookmarks}
        bookmarkedCount={bookmarkedIds.length}
        onSelectRandomWord={handleSelectRandomWord}
      />
    </div>
  );
}
