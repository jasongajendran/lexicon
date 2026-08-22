import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Bookmark, BookOpen, Sparkles, ChevronLeft, ChevronRight, Layers, ArrowRight } from 'lucide-react';
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

function highlightTargetWord(
  sentence: string,
  targetWord: string,
  variant: 'amber' | 'cyan' = 'amber'
): React.ReactNode {
  if (!sentence || !targetWord) return sentence;

  const cleanWord = targetWord.trim();
  if (!cleanWord) return sentence;

  const escaped = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let regex: RegExp;
  try {
    regex = new RegExp(`(\\b${escaped}[a-zA-Z]*|${escaped})`, 'gi');
  } catch (e) {
    regex = new RegExp(`(${escaped})`, 'gi');
  }

  const parts = sentence.split(regex);
  if (parts.length <= 1) {
    return sentence;
  }

  return parts.map((part, index) => {
    const isMatch =
      part.toLowerCase().startsWith(cleanWord.toLowerCase()) ||
      (cleanWord.toLowerCase().startsWith(part.toLowerCase()) && part.length >= 3);

    if (isMatch) {
      return (
        <span
          key={index}
          className={`font-semibold underline decoration-2 underline-offset-4 inline-block ${
            variant === 'amber'
              ? 'text-amber-300 decoration-amber-400 font-bold bg-amber-400/20 px-1 py-0.5 rounded shadow-sm'
              : 'text-cyan-300 decoration-cyan-400 font-bold bg-cyan-400/20 px-1 py-0.5 rounded shadow-sm'
          }`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

function highlightTamilWord(
  sentence: string,
  taWord: string,
  variant: 'amber' | 'cyan' = 'amber'
): React.ReactNode {
  if (!sentence || !taWord) return sentence;
  const clean = taWord.trim();
  if (!clean) return sentence;

  const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'g');
  const parts = sentence.split(regex);
  if (parts.length <= 1) return sentence;

  return parts.map((part, index) => {
    if (part === clean) {
      return (
        <span
          key={index}
          className={`font-semibold underline decoration-2 underline-offset-4 inline-block ${
            variant === 'amber'
              ? 'text-amber-200 decoration-amber-400 bg-amber-400/20 px-1 py-0.5 rounded shadow-sm'
              : 'text-cyan-200 decoration-cyan-400 bg-cyan-400/20 px-1 py-0.5 rounded shadow-sm'
          }`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
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
  const [speakingTarget, setSpeakingTarget] = useState<'word' | 'def' | 'ex1' | 'ex2' | null>(null);
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
    setSpeakingTarget(null);
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

  const handleSpeakText = (text: string, target: 'word' | 'def' | 'ex1' | 'ex2', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();

    if (speakingTarget === target) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingTarget(null);
      return;
    }

    speakWord(
      text,
      () => setSpeakingTarget(target),
      () => setSpeakingTarget(null),
      () => setSpeakingTarget(null)
    );
  };

  const handleSpeak = (e?: React.MouseEvent) => {
    handleSpeakText(word.word, 'word', e);
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
                  speakingTarget === 'word'
                    ? 'bg-amber-400/10 border-amber-400/60 text-amber-400 ring-1 ring-amber-400/30 shadow-md shadow-amber-400/10'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
                }`}
                title="Pronounce word"
              >
                {speakingTarget === 'word' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
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
            <div className="pb-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <button
                  onClick={handleSpeak}
                  className="text-left group flex items-baseline gap-2.5 focus:outline-none cursor-pointer"
                  title="Click to pronounce"
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-amber-400 font-bold tracking-tight group-hover:text-amber-300 transition-colors">
                    {word.word}
                  </h2>
                  <Volume2 size={22} className="text-zinc-500 group-hover:text-amber-400 transition-colors" />
                </button>
              </div>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-lg sm:text-xl font-tamil text-amber-300/90 font-medium">
                  {word.taWord}
                </span>
              </div>

              {/* Definition Box with Audio Sound Icon */}
              <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-start justify-between gap-3 shadow-inner">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider block">
                    Definition
                  </span>
                  <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
                    {word.definition}
                  </p>
                </div>
                <button
                  onClick={(e) => handleSpeakText(word.definition, 'def', e)}
                  className={`p-2 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 text-xs font-mono font-medium cursor-pointer ${
                    speakingTarget === 'def'
                      ? 'bg-amber-400/30 border-amber-400 text-amber-300 ring-1 ring-amber-400/40 shadow-md shadow-amber-400/10'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-400/40'
                  }`}
                  title="Listen to English definition"
                >
                  {speakingTarget === 'def' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={15} />}
                  <span className="hidden sm:inline">Listen</span>
                </button>
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
                Overview
              </button>
              <button
                onClick={() => setActiveTab('examples')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  activeTab === 'examples'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                Examples
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
              <div className="space-y-3">
                {/* Example 1 - Compact Amber Tag */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-zinc-900/90 to-amber-950/25 border border-amber-500/35 shadow-md shadow-amber-500/5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={10} className="text-amber-400" />
                        <span>Ex 1</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800">
                        EN · TA
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleSpeakText(word.enExample, 'ex1', e)}
                      className={`p-1.5 px-2.5 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 text-[11px] font-mono font-medium ${
                        speakingTarget === 'ex1'
                          ? 'bg-amber-400/30 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                          : 'bg-amber-400/10 border-amber-400/30 text-amber-300 hover:bg-amber-400/20'
                      }`}
                      title="Listen to example 1"
                    >
                      {speakingTarget === 'ex1' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={13} />}
                      <span className="hidden sm:inline">Listen</span>
                    </button>
                  </div>

                  <div className="pl-3 border-l-3 border-amber-400 space-y-2">
                    <p className="text-base sm:text-lg md:text-xl font-serif italic text-amber-50 leading-relaxed">
                      "{highlightTargetWord(word.enExample, word.word, 'amber')}"
                    </p>
                    <p className="text-sm sm:text-base font-tamil text-amber-300/95 leading-relaxed pt-1 border-t border-amber-500/20">
                      "{highlightTamilWord(word.taExample, word.taWord, 'amber')}"
                    </p>
                  </div>
                </div>

                {/* Example 2 - Compact Cyan Tag */}
                {(word.enExample2 || word.taExample2) && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-zinc-900/90 to-blue-950/25 border border-cyan-500/35 shadow-md shadow-cyan-500/5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-400/20 px-2 py-0.5 rounded-full border border-cyan-400/30 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen size={10} className="text-cyan-400" />
                          <span>Ex 2</span>
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800">
                          EN · TA
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleSpeakText(word.enExample2 || word.enExample, 'ex2', e)}
                        className={`p-1.5 px-2.5 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 text-[11px] font-mono font-medium ${
                          speakingTarget === 'ex2'
                            ? 'bg-cyan-400/30 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40'
                            : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20'
                        }`}
                        title="Listen to example 2"
                      >
                        {speakingTarget === 'ex2' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={13} />}
                        <span className="hidden sm:inline">Listen</span>
                      </button>
                    </div>

                    <div className="pl-3 border-l-3 border-cyan-400 space-y-2">
                      <p className="text-base sm:text-lg md:text-xl font-serif italic text-cyan-50 leading-relaxed">
                        "{highlightTargetWord(word.enExample2 || word.enExample, word.word, 'cyan')}"
                      </p>
                      <p className="text-sm sm:text-base font-tamil text-cyan-300/95 leading-relaxed pt-1 border-t border-cyan-500/20">
                        "{highlightTamilWord(word.taExample2 || word.taExample, word.taWord, 'cyan')}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Thesaurus / Full View */}
            {(activeTab === 'all' || activeTab === 'thesaurus') && (
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 font-bold">
                    <Layers size={14} className="text-amber-400" />
                    <span>Thesaurus</span>
                  </h4>
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

          {/* Modal Footer - Centered Ergonomic Close Button */}
          <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-900/80 flex items-center justify-center relative">
            <div className="hidden sm:flex items-center gap-1.5 text-zinc-500 text-[11px] absolute left-5">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">←</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">→</kbd>
              <span>Nav</span>
            </div>

            {/* Prominent Center Close Button - Easily reachable by both thumbs */}
            <button
              onClick={onClose}
              className="px-8 py-2.5 sm:py-3 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-black font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-amber-500/15 transition-all border border-amber-300 cursor-pointer"
              title="Close modal (Esc)"
            >
              <X size={18} strokeWidth={2.5} />
              <span>CLOSE</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
