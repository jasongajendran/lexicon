import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Search, Bookmark, LayoutGrid, List, Layers, Shuffle, Sparkles, Filter, X, Keyboard, ArrowUp, CheckCircle, RotateCcw } from 'lucide-react';
import { wordsData } from './data';
import { WordRow } from './components/WordRow';
import { WordCard } from './components/WordCard';
import { WordDetailModal } from './components/WordDetailModal';
import { FlashcardView } from './components/FlashcardView';
import { FilterSheet } from './components/FilterSheet';
import { BottomNav } from './components/BottomNav';
import { WordOfTheDayCard } from './components/WordOfTheDayCard';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { LexiconWord } from './types';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ADDRESSED_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const POS_TYPES = ["all", "noun", "verb", "adj.", "phrase", "slang", "idiom"];

const INITIAL_PAGE_SIZE = 40;
const PAGE_INCREMENT = 40;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('all');
  const [activePos, setActivePos] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // Progressive rendering limit for ultra-smooth 60fps scrolling
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  // Mobile & View State
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentTab, setCurrentTab] = useState<'feed' | 'study'>('feed');
  const [selectedWord, setSelectedWord] = useState<LexiconWord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const letterScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll();

  // Deterministic Spotlight Word of the Day based on day of year
  const spotlightWord = useMemo(() => {
    if (wordsData.length === 0) return null;
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    return wordsData[dayOfYear % wordsData.length];
  }, []);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track scroll position for Back-to-Top floating button
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowBackToTop(latest > 400);
    });
  }, [scrollY]);

  // Load Bookmarks
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

  // Persist Bookmarks
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
    const cleanWord = wordText.trim().toLowerCase();
    const foundWord = wordsData.find(w => w.word.toLowerCase() === cleanWord);
    if (foundWord) {
      setSelectedWord(foundWord);
      setIsDetailOpen(true);
    } else {
      // Search for the term
      setSearchQuery(wordText);
      setActiveLetter('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (e.key === 'Escape') {
        setIsDetailOpen(false);
        setIsKeyboardHelpOpen(false);
        setIsFilterSheetOpen(false);
        return;
      }

      if (isInputFocused) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsKeyboardHelpOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleSelectRandomWord();
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setShowOnlyBookmarks(prev => !prev);
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setCurrentTab(prev => (prev === 'study' ? 'feed' : 'study'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Computation with deep search (Word, Definition, Tamil, Synonyms, Antonyms, POS, Examples)
  const filteredWords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return wordsData.filter((w) => {
      const matchesLetter = activeLetter === 'all' || w.word.toUpperCase().startsWith(activeLetter);
      const matchesPos = activePos === 'all' || w.pos.toLowerCase() === activePos.toLowerCase();
      const matchesBookmark = !showOnlyBookmarks || bookmarkedIds.includes(w.id);

      if (!matchesLetter || !matchesPos || !matchesBookmark) return false;
      if (!query) return true;

      const inWord = w.word.toLowerCase().includes(query);
      const inDef = w.definition.toLowerCase().includes(query);
      const inTaWord = w.taWord.toLowerCase().includes(query);
      const inPos = w.pos.toLowerCase().includes(query);
      const inEnExample = w.enExample?.toLowerCase().includes(query);
      const inTaExample = w.taExample?.toLowerCase().includes(query);
      const inSynonyms = w.synonyms?.some(s => s.toLowerCase().includes(query));
      const inAntonyms = w.antonyms?.some(a => a.toLowerCase().includes(query));

      return inWord || inDef || inTaWord || inPos || inEnExample || inTaExample || inSynonyms || inAntonyms;
    });
  }, [searchQuery, activeLetter, activePos, showOnlyBookmarks, bookmarkedIds]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [searchQuery, activeLetter, activePos, showOnlyBookmarks]);

  // Infinite Scroll Sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_INCREMENT, filteredWords.length));
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filteredWords.length]);

  const visibleWords = useMemo(() => {
    return filteredWords.slice(0, visibleCount);
  }, [filteredWords, visibleCount]);

  const hasActiveFilters = searchQuery !== '' || activeLetter !== 'all' || activePos !== 'all' || showOnlyBookmarks;

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveLetter('all');
    setActivePos('all');
    setShowOnlyBookmarks(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 flex flex-col lg:flex-row overflow-x-hidden selection:bg-amber-400 selection:text-black pb-24 lg:pb-0">
      
      {/* Top Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-amber-400 origin-left z-50 shadow-[0_0_10px_#fbbf24]" 
        style={{ scaleX }} 
      />

      {/* Background Dynamic Letter Accent */}
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
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-black font-serif italic font-bold shadow-md shadow-amber-400/20">L</div>
              <div>
                <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase block font-semibold">Pragmatic Lexicon</span>
                <span className="text-[10px] font-mono text-amber-400/90 block">Engineer Edition • {wordsData.length} Terms</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsKeyboardHelpOpen(true)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 active:scale-95 transition-all text-xs font-mono flex items-center gap-1.5"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard size={14} />
                <span className="hidden sm:inline">Keys</span>
              </button>

              <button
                onClick={handleSelectRandomWord}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 active:scale-95 transition-all text-xs font-mono flex items-center gap-1.5"
                title="Random Word (R)"
              >
                <Shuffle size={14} />
                <span className="hidden sm:inline">Random</span>
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.08] mb-4 tracking-tight">
            The <br/> Engineer's <br/> <span className="italic text-amber-400">Vocabulary.</span>
          </h1>
          
          <p className="text-zinc-400 text-sm md:text-base font-sans font-light leading-relaxed mb-6 max-w-sm">
            Curated engineering terminology, Gen Z dev slang, agile ceremonies, and system architecture terms with dual English & Tamil contexts.
          </p>

          {/* Search Bar */}
          <div className="relative group mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search terms, synonyms, Tamil (⌘K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800/80 text-zinc-100 rounded-2xl py-3 pl-11 pr-10 focus:outline-none focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all placeholder:text-zinc-600 font-sans text-sm"
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
          <div className="mb-6">
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-xs font-mono ${
                showOnlyBookmarks
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark size={15} className={showOnlyBookmarks ? 'fill-amber-400 text-amber-400' : ''} />
                <span>Show Saved Terms</span>
              </div>
              <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-[10px] text-amber-400 font-bold">
                {bookmarkedIds.length}
              </span>
            </button>
          </div>

          {/* POS Filters */}
          <div className="mb-6">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2.5">Category / Part of Speech</h3>
            <div className="flex flex-wrap gap-1.5">
              {POS_TYPES.map(pos => (
                <button
                  key={pos}
                  onClick={() => setActivePos(pos)}
                  className={`px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all border ${
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
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">A–Z Index</h3>
              <span className="text-[10px] font-mono text-amber-400/90 font-medium">A–Z (26 Letters)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => {
                  setActiveLetter('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-7 h-7 flex items-center justify-center text-xs font-serif italic transition-all rounded-lg ${
                  activeLetter === 'all' 
                    ? 'bg-amber-400 text-black font-bold' 
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
                    onClick={() => {
                      if (isAddressed) {
                        setActiveLetter(letter);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={!isAddressed}
                    className={`w-7 h-7 flex items-center justify-center text-xs font-serif italic transition-all rounded-lg 
                      ${activeLetter === letter ? 'bg-amber-400 text-black font-bold' : 
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
        <div className="hidden lg:block mt-8 pt-4 border-t border-zinc-800/50 text-xs font-mono text-zinc-600 uppercase tracking-widest">
          <div className="flex items-center justify-between">
            <span>Volume I • Complete</span>
            <span>{filteredWords.length} / {wordsData.length} Shown</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="lg:w-[65%] xl:w-[70%] min-h-screen relative flex flex-col">
        {/* Sticky Mobile & Desktop Top Bar */}
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-zinc-800/80">
          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Brand Logo for Mobile */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-black font-serif italic font-bold text-xs shadow-sm">L</div>
                <span className="font-serif italic font-bold text-amber-400 text-sm">Lexicon</span>
              </div>

              {/* Filter Drawer Trigger for Mobile */}
              <button
                onClick={() => setIsFilterSheetOpen(true)}
                className="lg:hidden py-1.5 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-amber-400 transition-all flex items-center gap-1.5"
                title="Search and Filters"
              >
                <Filter size={13} className="text-amber-400" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>

              {/* Desktop Word Counter */}
              <span className="hidden lg:inline text-xs font-mono text-zinc-500 uppercase tracking-wider">
                {currentTab === 'study' ? 'Active Recall Study Deck' : `${filteredWords.length} Terms Matched`}
              </span>
            </div>

            {/* View Mode Switcher (List vs Grid vs Flashcard) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentTab(currentTab === 'study' ? 'feed' : 'study');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`py-1.5 px-3 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-all ${
                  currentTab === 'study'
                    ? 'bg-amber-400 text-black border-amber-400 font-bold'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Layers size={14} />
                <span>{currentTab === 'study' ? 'Back to Feed' : 'Flashcards'}</span>
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

          {/* Mobile Horizontal Alphabet Scroller Bar */}
          {currentTab === 'feed' && (
            <div 
              ref={letterScrollRef}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2 overflow-x-auto no-scrollbar border-t border-zinc-800/40 bg-zinc-950/60"
            >
              <button
                onClick={() => {
                  setActiveLetter('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-all ${
                  activeLetter === 'all'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800'
                }`}
              >
                ALL ({wordsData.length})
              </button>
              {ALPHABET.map((letter) => {
                const isSelected = activeLetter === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => {
                      setActiveLetter(letter);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-7 h-7 rounded-full text-xs font-serif italic shrink-0 transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-400 text-black font-bold shadow-sm ring-2 ring-amber-400/30'
                        : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 active:scale-95'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Filter Indicators & Reset Bar */}
        {hasActiveFilters && currentTab === 'feed' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-4 w-full">
            <div className="flex items-center gap-2 flex-wrap p-2.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
              <span className="text-zinc-500 pl-1">Filtered by:</span>
              
              {searchQuery && (
                <span className="flex items-center gap-1 bg-zinc-800 text-zinc-200 px-2.5 py-0.5 rounded-full border border-zinc-700">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-amber-400"><X size={12} /></button>
                </span>
              )}

              {activeLetter !== 'all' && (
                <span className="flex items-center gap-1 bg-zinc-800 text-zinc-200 px-2.5 py-0.5 rounded-full border border-zinc-700">
                  <span>Letter: {activeLetter}</span>
                  <button onClick={() => setActiveLetter('all')} className="hover:text-amber-400"><X size={12} /></button>
                </span>
              )}

              {activePos !== 'all' && (
                <span className="flex items-center gap-1 bg-zinc-800 text-zinc-200 px-2.5 py-0.5 rounded-full border border-zinc-700">
                  <span>POS: {activePos}</span>
                  <button onClick={() => setActivePos('all')} className="hover:text-amber-400"><X size={12} /></button>
                </span>
              )}

              {showOnlyBookmarks && (
                <span className="flex items-center gap-1 bg-zinc-800 text-zinc-200 px-2.5 py-0.5 rounded-full border border-zinc-700">
                  <span>Saved Only</span>
                  <button onClick={() => setShowOnlyBookmarks(false)} className="hover:text-amber-400"><X size={12} /></button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="ml-auto text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] underline"
              >
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        )}

        {/* Content View */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 flex-grow w-full">
          {/* Spotlight Term of the Day (Shown on default feed) */}
          {currentTab === 'feed' && !hasActiveFilters && spotlightWord && (
            <WordOfTheDayCard
              word={spotlightWord}
              isBookmarked={bookmarkedIds.includes(spotlightWord.id)}
              onToggleBookmark={() => toggleBookmark(spotlightWord.id)}
              onSelectWord={(w) => {
                setSelectedWord(w);
                setIsDetailOpen(true);
              }}
            />
          )}

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
                /* Progressive List View */
                <motion.div key="list-view" className="flex flex-col">
                  {visibleWords.map((word, index) => (
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
                /* Progressive Bento Grid View */
                <motion.div
                  key="grid-view"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 py-4"
                >
                  {visibleWords.map((word, index) => (
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
                className="flex flex-col items-center justify-center min-h-[50vh] text-center px-8"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 text-amber-400">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif italic text-zinc-300 mb-2">No entries matched</h3>
                <p className="text-zinc-500 font-sans text-sm max-w-sm mb-6">
                  {showOnlyBookmarks 
                    ? "You haven't bookmarked any terms matching your current filters."
                    : "No words match your search criteria. Try a broader search term or letter index."}
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 rounded-full bg-amber-400 text-black text-xs font-mono font-bold hover:bg-amber-300 transition-all"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progressive Loading Sentinel / Indicator */}
          {currentTab === 'feed' && visibleCount < filteredWords.length && (
            <div ref={sentinelRef} className="py-8 flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-mono text-zinc-500">
                Showing {visibleCount} of {filteredWords.length} terms...
              </span>
              <button
                onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_INCREMENT, filteredWords.length))}
                className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono hover:text-amber-400 hover:border-amber-400/40 transition-all"
              >
                Load Next {Math.min(PAGE_INCREMENT, filteredWords.length - visibleCount)} Terms
              </button>
            </div>
          )}

          {/* Footer */}
          {filteredWords.length > 0 && currentTab === 'feed' && visibleCount >= filteredWords.length && (
            <footer className="py-16 text-center border-t border-zinc-800/50 mt-12">
              <p className="text-zinc-500 font-serif italic text-lg mb-2">End of Lexicon Feed</p>
              <p className="text-zinc-600 font-mono text-xs">Total {filteredWords.length} terms loaded</p>
              <div className="w-12 h-[1px] bg-zinc-800 mx-auto mt-4" />
            </footer>
          )}
        </div>
      </main>

      {/* Floating Back To Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-20 lg:bottom-8 right-6 z-40 p-3 rounded-full bg-amber-400 text-black shadow-2xl hover:bg-amber-300 active:scale-90 transition-all"
            title="Scroll to Top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Word Detail Modal / Bottom Sheet */}
      <WordDetailModal
        word={selectedWord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isBookmarked={selectedWord ? bookmarkedIds.includes(selectedWord.id) : false}
        onToggleBookmark={() => selectedWord && toggleBookmark(selectedWord.id)}
        onWordSearch={handleWordLinkClick}
      />

      {/* Keyboard Shortcuts Guide Modal */}
      <KeyboardShortcutsModal
        isOpen={isKeyboardHelpOpen}
        onClose={() => setIsKeyboardHelpOpen(false)}
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
