import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Copy, Check, Bookmark, BookOpen, Sparkles, ChevronLeft, ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

interface WordDetailModalProps {
  word: LexiconWord | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSelectWord?: (word: LexiconWord) => void;
  onWordSearch?: (term: string) => void;
  onPrevWord?: () => void;
  onNextWord?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function WordDetailModal({
  word,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectWord,
  onWordSearch,
  onPrevWord,
  onNextWord,
  hasPrev = false,
  hasNext = false,
}: WordDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'thesaurus' | 'examples'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrevWord && hasPrev) {
        onPrevWord();
      } else if (e.key === 'ArrowRight' && onNextWord && hasNext) {
        onNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrevWord, onNextWord, hasPrev, hasNext, onClose]);

  // Reset tab on word change
  useEffect(() => {
    setActiveTab('all');
  }, [word?.id]);

  if (!word || !isOpen) return null;

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    speakWord(
      word.word,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleCopy = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    const textToCopy = `📖 ${word.word.toUpperCase()} (${word.taWord})
POS: ${word.pos}
Definition: ${word.definition}

🔹 Primary Example 1:
EN: "${word.enExample}"
TA: "${word.taExample}"

🔸 Secondary Example 2:
EN: "${word.enExample2 || word.enExample}"
TA: "${word.taExample2 || word.taExample}"

📚 Thesaurus:
Synonyms: ${word.synonyms?.join(', ') || 'N/A'}
Antonyms: ${word.antonyms?.join(', ') || 'N/A'}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThesaurusClick = (term: string) => {
    triggerHaptic();
    if (onWordSearch) {
      onWordSearch(term);
      onClose();
    }
  };

  const hasSynonyms = Boolean(word.synonyms && word.synonyms.length > 0);
  const hasAntonyms = Boolean(word.antonyms && word.antonyms.length > 0);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-[#0f0f10] border border-zinc-800/90 rounded-3xl shadow-2xl shadow-amber-500/10 flex flex-col overflow-hidden text-zinc-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-zinc-400 bg-zinc-800/90 px-2.5 py-1 rounded-full border border-zinc-700/60 font-semibold">
                #{word.id.toString().padStart(3, '0')}
              </span>
              <span className="text-xs font-mono text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-full border border-purple-400/30 uppercase tracking-wider font-semibold">
                {word.pos}
              </span>
              {isBookmarked && (
                <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/25 flex items-center gap-1">
                  <Bookmark size={11} className="fill-amber-400" />
                  <span>Saved</span>
                </span>
              )}
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center gap-1.5">
              {/* Prev / Next navigation */}
              {onPrevWord && (
                <button
                  onClick={onPrevWord}
                  disabled={!hasPrev}
                  className={`p-2 rounded-xl border transition-all ${
                    hasPrev 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 active:scale-95' 
                      : 'bg-zinc-900/40 border-zinc-800/40 text-zinc-600 opacity-40 cursor-not-allowed'
                  }`}
                  title="Previous word (Left arrow)"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              {onNextWord && (
                <button
                  onClick={onNextWord}
                  disabled={!hasNext}
                  className={`p-2 rounded-xl border transition-all ${
                    hasNext 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 active:scale-95' 
                      : 'bg-zinc-900/40 border-zinc-800/40 text-zinc-600 opacity-40 cursor-not-allowed'
                  }`}
                  title="Next word (Right arrow)"
                >
                  <ChevronRight size={16} />
                </button>
              )}

              <button
                onClick={handleSpeak}
                className={`p-2 rounded-xl border transition-all ${
                  isSpeaking
                    ? 'bg-amber-400 border-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
                }`}
                title="Pronounce word"
              >
                {isSpeaking ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl border bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40 transition-all"
                title="Copy all details to clipboard"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>

              <button
                onClick={() => {
                  triggerHaptic();
                  onToggleBookmark();
                }}
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark word'}
              >
                <Bookmark size={16} className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all ml-1"
                title="Close modal (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Body Scroll Area */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
            {/* Word Heading */}
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <button
                  onClick={handleSpeak}
                  className="text-left group flex items-baseline gap-2.5 focus:outline-none cursor-pointer"
                  title="Click to pronounce"
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-amber-400 font-bold tracking-tight group-hover:text-amber-300 transition-colors">
                    {word.word}
                  </h2>
                  <Volume2 size={20} className="text-zinc-600 group-hover:text-amber-400 transition-colors opacity-60" />
                </button>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-base sm:text-lg font-tamil text-amber-300/90 font-medium">
                  {word.taWord}
                </span>
              </div>

              {/* Definition Box */}
              <div className="mt-4 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                  <BookOpen size={13} className="text-amber-400" />
                  <span>Definition & Meaning</span>
                </div>
                <p className="text-zinc-200 text-sm sm:text-base font-sans leading-relaxed">
                  {word.definition}
                </p>
              </div>
            </div>

            {/* Quick Segment Filter Pills */}
            <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  activeTab === 'all'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                Full Overview
              </button>
              <button
                onClick={() => setActiveTab('examples')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  activeTab === 'examples'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                2 Context Examples
              </button>
              <button
                onClick={() => setActiveTab('thesaurus')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  activeTab === 'thesaurus'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                Thesaurus ({(word.synonyms?.length || 0) + (word.antonyms?.length || 0)})
              </button>
            </div>

            {/* Tab: Examples / Full View */}
            {(activeTab === 'all' || activeTab === 'examples') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 font-bold">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Real-World Context Examples (Dual Pairs)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-500">2 English & Tamil Pairs</span>
                </div>

                {/* Example 1 (Primary) */}
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300 font-semibold">
                      Primary Context 1 • முதன்மை உதாரணம்
                    </span>
                  </div>

                  <div className="pl-3 border-l-2 border-blue-400/40 space-y-2">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">English Sentence</span>
                      <p className="text-sm sm:text-base font-serif italic text-zinc-100 leading-relaxed">
                        "{word.enExample}"
                      </p>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">Tamil Translation</span>
                      <p className="text-xs sm:text-sm font-tamil text-zinc-300 leading-relaxed font-light">
                        "{word.taExample}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Example 2 (Secondary - Newly Added) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900/60 to-zinc-900/80 border border-amber-500/30 space-y-3 shadow-lg shadow-amber-500/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-400" />
                      <span>Secondary Context 2 • கூடுதல் உதாரணம்</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/80">Alternative Usage</span>
                  </div>

                  <div className="pl-3 border-l-2 border-amber-400/60 space-y-2">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400/70 block uppercase">Secondary English Example</span>
                      <p className="text-sm sm:text-base font-serif italic text-zinc-100 leading-relaxed">
                        "{word.enExample2 || word.enExample}"
                      </p>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-mono text-amber-400/70 block uppercase">Secondary Tamil Context</span>
                      <p className="text-xs sm:text-sm font-tamil text-zinc-300 leading-relaxed font-light">
                        "{word.taExample2 || word.taExample}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Thesaurus / Full View */}
            {(activeTab === 'all' || activeTab === 'thesaurus') && (
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 font-bold">
                    <Layers size={14} className="text-amber-400" />
                    <span>Thesaurus (Synonyms & Antonyms)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-500">Click any term to explore</span>
                </div>

                {/* Synonyms */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-wider">
                      Synonyms ({word.synonyms?.length || 0})
                    </span>
                  </div>

                  {hasSynonyms ? (
                    <div className="flex flex-wrap gap-2">
                      {word.synonyms?.map((syn, i) => (
                        <button
                          key={i}
                          onClick={() => handleThesaurusClick(syn)}
                          className="text-xs font-mono text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/25 px-3 py-1.5 rounded-xl border border-emerald-400/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 group cursor-pointer"
                          title={`Search for "${syn}" in dictionary`}
                        >
                          <span>{syn}</span>
                          <ArrowRight size={11} className="text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-zinc-500 italic">No direct synonyms listed.</p>
                  )}
                </div>

                {/* Antonyms */}
                <div className="pt-2 border-t border-zinc-800/60">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20 uppercase tracking-wider">
                      Antonyms ({word.antonyms?.length || 0})
                    </span>
                  </div>

                  {hasAntonyms ? (
                    <div className="flex flex-wrap gap-2">
                      {word.antonyms?.map((ant, i) => (
                        <button
                          key={i}
                          onClick={() => handleThesaurusClick(ant)}
                          className="text-xs font-mono text-rose-300 bg-rose-400/10 hover:bg-rose-400/25 px-3 py-1.5 rounded-xl border border-rose-400/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 group cursor-pointer"
                          title={`Search for "${ant}" in dictionary`}
                        >
                          <span>{ant}</span>
                          <ArrowRight size={11} className="text-rose-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-zinc-500 italic">No direct antonyms listed.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-300 border border-zinc-700">ESC</kbd>
              <span>to close</span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="hidden sm:inline">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-300 border border-zinc-700 mr-1">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-300 border border-zinc-700 mr-1">→</kbd>
                to navigate
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copied Details' : 'Copy All'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
