import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Bookmark, BookOpen, Sparkles, ChevronLeft, ChevronRight, Layers, ArrowRight, Eye, EyeOff, Headphones, Square } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord, stopSpeaking } from '../utils/speech';
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
  variant: 'amber' | 'cyan' = 'amber',
  isCloze = false,
  isRevealed = false,
  onReveal?: () => void
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
      if (isCloze && !isRevealed) {
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onReveal?.();
            }}
            className="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-800 border border-dashed border-amber-400/80 text-amber-300 font-mono text-xs hover:bg-zinc-700 transition-all cursor-pointer shadow-sm mx-1"
            title="Click to reveal target word"
          >
            [ ? tap to reveal ]
          </button>
        );
      }

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

type SpeechSection = 'word' | 'def' | 'ex1' | 'ex2' | 'synonyms' | 'antonyms' | null;

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
  const [speakingTarget, setSpeakingTarget] = useState<SpeechSection>(null);
  const [isReadingAll, setIsReadingAll] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'thesaurus' | 'examples'>('all');
  const [isClozeMode, setIsClozeMode] = useState<boolean>(false);
  const [revealedEx1, setRevealedEx1] = useState<boolean>(false);
  const [revealedEx2, setRevealedEx2] = useState<boolean>(false);

  const isReadingAllRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch (e) {
        // ignore
      }
    }
  };

  const stopAllAudio = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isReadingAllRef.current = false;
    setIsReadingAll(false);
    setSpeakingTarget(null);
    stopSpeaking();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        stopAllAudio();
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrevWord && hasPrev) {
        stopAllAudio();
        onPrevWord();
      } else if (e.key === 'ArrowRight' && onNextWord && hasNext) {
        stopAllAudio();
        onNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrevWord, onNextWord, hasPrev, hasNext, onClose, stopAllAudio]);

  // Reset tab, cloze reveals, and speech state on word change or close
  useEffect(() => {
    stopAllAudio();
    setActiveTab('all');
    setRevealedEx1(false);
    setRevealedEx2(false);
  }, [word?.id, isOpen, stopAllAudio]);

  if (!word || !isOpen) return null;

  const handleSpeakText = (text: string, target: SpeechSection, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();

    if (isReadingAllRef.current || speakingTarget === target) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    setSpeakingTarget(target);

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

  const handlePronounceTerm = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    stopAllAudio();
    speakWord(term);
  };

  const handleToggleReadAll = () => {
    triggerHaptic();
    if (isReadingAllRef.current) {
      stopAllAudio();
      return;
    }

    if (!word) return;

    stopAllAudio();
    isReadingAllRef.current = true;
    setIsReadingAll(true);

    const steps: { id: SpeechSection; text: string }[] = [];

    // Step 1: Word
    steps.push({ id: 'word', text: `${word.word}.` });

    // Step 2: Definition
    if (word.definition) {
      steps.push({ id: 'def', text: `Definition: ${word.definition}.` });
    }

    // Step 3: Example 1
    if (word.enExample) {
      steps.push({ id: 'ex1', text: `Example: ${word.enExample}.` });
    }

    // Step 4: Example 2
    if (word.enExample2) {
      steps.push({ id: 'ex2', text: `Second example: ${word.enExample2}.` });
    }

    // Step 5: Synonyms
    if (word.synonyms && word.synonyms.length > 0) {
      steps.push({ id: 'synonyms', text: `Synonyms: ${word.synonyms.join(', ')}.` });
    }

    // Step 6: Antonyms
    if (word.antonyms && word.antonyms.length > 0) {
      steps.push({ id: 'antonyms', text: `Antonyms: ${word.antonyms.join(', ')}.` });
    }

    const playStep = (index: number) => {
      if (!isReadingAllRef.current || index >= steps.length) {
        stopAllAudio();
        return;
      }

      const current = steps[index];
      setSpeakingTarget(current.id);

      speakWord(
        current.text,
        () => {
          if (isReadingAllRef.current) {
            setSpeakingTarget(current.id);
          }
        },
        () => {
          if (!isReadingAllRef.current) return;
          if (index + 1 < steps.length) {
            timeoutRef.current = setTimeout(() => {
              if (isReadingAllRef.current) {
                playStep(index + 1);
              }
            }, 350);
          } else {
            stopAllAudio();
          }
        },
        () => {
          stopAllAudio();
        }
      );
    };

    playStep(0);
  };

  const handleThesaurusClick = (term: string) => {
    triggerHaptic();
    stopAllAudio();
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
        onClick={() => {
          stopAllAudio();
          onClose();
        }}
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

          {/* Modal Header with Dedicated Read All Narration Button */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2 flex-wrap">
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
            <div className="flex items-center gap-2">
              {/* Dedicated "Read All" Continuous Narration Button */}
              <button
                type="button"
                onClick={handleToggleReadAll}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm ${
                  isReadingAll
                    ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-amber-400/25 ring-2 ring-amber-400/60 animate-pulse'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:text-amber-400 hover:border-amber-400/50 hover:bg-zinc-800/90'
                }`}
                title={
                  isReadingAll
                    ? 'Stop continuous narration'
                    : 'Read All: Continuous narration of word, definition, examples & thesaurus'
                }
              >
                {isReadingAll ? (
                  <>
                    <AudioEqualizer isPlaying={true} />
                    <span className="font-bold">Reading All...</span>
                    <Square size={11} className="fill-black ml-0.5" />
                  </>
                ) : (
                  <>
                    <Headphones size={14} className="text-amber-400" />
                    <span>Read All</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  triggerHaptic();
                  onToggleBookmark();
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  isBookmarked
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark word'}
              >
                <Bookmark size={16} className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''} />
              </button>

              <button
                onClick={() => {
                  stopAllAudio();
                  onClose();
                }}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer active:scale-95"
                title="Close modal (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Body Scroll Area */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
            {/* Word Heading Row with Interactive Tap-to-Speak Trigger */}
            <div 
              onClick={handleSpeak}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between gap-4 ${
                speakingTarget === 'word'
                  ? 'bg-amber-400/15 border-amber-400/70 ring-2 ring-amber-400/30 shadow-lg shadow-amber-400/10'
                  : 'bg-zinc-950/40 border-zinc-800/50 hover:border-amber-400/40 hover:bg-zinc-900/40'
              }`}
              title="Tap anywhere to hear word pronunciation"
            >
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-amber-400 font-bold tracking-tight group-hover:text-amber-300 transition-colors">
                    {word.word}
                  </h2>
                </div>

                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-tamil text-amber-300/90 font-medium">
                    {word.taWord}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    • Tap to pronounce
                  </span>
                </div>
              </div>

              {/* Main Word Audio Button on Right */}
              <button
                type="button"
                onClick={handleSpeak}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all shrink-0 cursor-pointer shadow-md active:scale-95 ${
                  speakingTarget === 'word'
                    ? 'bg-amber-400 text-black border-amber-400 ring-2 ring-amber-400/40 shadow-amber-400/20'
                    : 'bg-zinc-800/90 border-zinc-700 text-zinc-300 group-hover:text-amber-400 group-hover:border-amber-400/50 group-hover:bg-zinc-700'
                }`}
                title="Pronounce word"
              >
                {speakingTarget === 'word' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={22} />}
              </button>
            </div>

            {/* Definition Box with Direct Tap-to-Speak Trigger */}
            <div 
              onClick={() => handleSpeakText(`Definition: ${word.definition}`, 'def')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group shadow-inner ${
                speakingTarget === 'def'
                  ? 'bg-amber-400/15 border-amber-400/80 ring-2 ring-amber-400/30 shadow-md shadow-amber-400/10'
                  : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
              title="Tap anywhere on definition to listen"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400/90 uppercase tracking-wider block">
                  Definition
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeakText(`Definition: ${word.definition}`, 'def');
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    speakingTarget === 'def'
                      ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-sm'
                      : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 group-hover:text-amber-300 group-hover:border-amber-400/40'
                  }`}
                  title="Listen to definition"
                >
                  {speakingTarget === 'def' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={12} />}
                  <span>{speakingTarget === 'def' ? 'Reading...' : 'Tap to read'}</span>
                </button>
              </div>
              <p className="text-sm sm:text-base text-zinc-100 font-sans leading-relaxed">
                {word.definition}
              </p>
            </div>

            {/* Quick Segment Filter Pills & Cloze Challenge Mode Button */}
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-amber-400 text-black font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'examples'
                      ? 'bg-amber-400 text-black font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  Examples
                </button>
                <button
                  onClick={() => setActiveTab('thesaurus')}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'thesaurus'
                      ? 'bg-amber-400 text-black font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  Thesaurus ({(word.synonyms?.length || 0) + (word.antonyms?.length || 0)})
                </button>
              </div>

              {/* Challenge / Cloze Blank Practice Toggle */}
              <button
                onClick={() => {
                  triggerHaptic();
                  setIsClozeMode(prev => !prev);
                  setRevealedEx1(false);
                  setRevealedEx2(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all border cursor-pointer ${
                  isClozeMode
                    ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-300'
                }`}
                title={isClozeMode ? 'Blank sentence mode active (Click to restore full word)' : 'Test yourself by blanking the target word in sentences'}
              >
                {isClozeMode ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{isClozeMode ? 'Practice: Blanks' : 'Test Recall'}</span>
              </button>
            </div>

            {/* Tab: Examples / Full View */}
            {(activeTab === 'all' || activeTab === 'examples') && (
              <div className="space-y-3">
                {/* Example 1 - Interactive Tap-to-Speak */}
                <div 
                  onClick={() => handleSpeakText(word.enExample, 'ex1')}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group space-y-2.5 shadow-md ${
                    speakingTarget === 'ex1'
                      ? 'bg-gradient-to-br from-amber-500/25 via-zinc-900/95 to-amber-950/35 border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/10'
                      : 'bg-gradient-to-br from-amber-500/15 via-zinc-900/90 to-amber-950/25 border-amber-500/35 hover:border-amber-400/60'
                  }`}
                  title="Tap to listen to Example 1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={10} className="text-amber-400" />
                        <span>Ex 1</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800">
                        EN · TA
                      </span>
                      {isClozeMode && (
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/20">
                          {revealedEx1 ? 'Revealed' : 'Tap blank to solve'}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleSpeakText(word.enExample, 'ex1', e)}
                      className={`p-1.5 px-2.5 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 text-[11px] font-mono font-medium cursor-pointer ${
                        speakingTarget === 'ex1'
                          ? 'bg-amber-400 text-black border-amber-400 font-bold ring-1 ring-amber-400/40'
                          : 'bg-amber-400/10 border-amber-400/30 text-amber-300 hover:bg-amber-400/20 group-hover:border-amber-400/60'
                      }`}
                      title="Listen to example 1"
                    >
                      {speakingTarget === 'ex1' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={13} />}
                      <span>{speakingTarget === 'ex1' ? 'Reading...' : 'Tap to read'}</span>
                    </button>
                  </div>

                  <div className="pl-3 border-l-3 border-amber-400 space-y-2">
                    <p className="text-base sm:text-lg md:text-xl font-serif italic text-amber-50 leading-relaxed">
                      "{highlightTargetWord(word.enExample, word.word, 'amber', isClozeMode, revealedEx1, () => setRevealedEx1(true))}"
                    </p>
                    <p className="text-sm sm:text-base font-tamil text-amber-300/95 leading-relaxed pt-1 border-t border-amber-500/20">
                      "{highlightTamilWord(word.taExample, word.taWord, 'amber')}"
                    </p>
                  </div>
                </div>

                {/* Example 2 - Interactive Tap-to-Speak */}
                {(word.enExample2 || word.taExample2) && (
                  <div 
                    onClick={() => handleSpeakText(word.enExample2 || word.enExample, 'ex2')}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group space-y-2.5 shadow-md ${
                      speakingTarget === 'ex2'
                        ? 'bg-gradient-to-br from-cyan-500/25 via-zinc-900/95 to-blue-950/35 border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-500/10'
                        : 'bg-gradient-to-br from-cyan-500/15 via-zinc-900/90 to-blue-950/25 border-cyan-500/35 hover:border-cyan-400/60'
                    }`}
                    title="Tap to listen to Example 2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-400/20 px-2 py-0.5 rounded-full border border-cyan-400/30 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen size={10} className="text-cyan-400" />
                          <span>Ex 2</span>
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800">
                          EN · TA
                        </span>
                        {isClozeMode && (
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-400/15 px-2 py-0.5 rounded border border-cyan-400/20">
                            {revealedEx2 ? 'Revealed' : 'Tap blank to solve'}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleSpeakText(word.enExample2 || word.enExample, 'ex2', e)}
                        className={`p-1.5 px-2.5 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 text-[11px] font-mono font-medium cursor-pointer ${
                          speakingTarget === 'ex2'
                            ? 'bg-cyan-400 text-black border-cyan-400 font-bold ring-1 ring-cyan-400/40'
                            : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 group-hover:border-cyan-400/60'
                        }`}
                        title="Listen to example 2"
                      >
                        {speakingTarget === 'ex2' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={13} />}
                        <span>{speakingTarget === 'ex2' ? 'Reading...' : 'Tap to read'}</span>
                      </button>
                    </div>

                    <div className="pl-3 border-l-3 border-cyan-400 space-y-2">
                      <p className="text-base sm:text-lg md:text-xl font-serif italic text-cyan-50 leading-relaxed">
                        "{highlightTargetWord(word.enExample2 || word.enExample, word.word, 'cyan', isClozeMode, revealedEx2, () => setRevealedEx2(true))}"
                      </p>
                      <p className="text-sm sm:text-base font-tamil text-cyan-300/95 leading-relaxed pt-1 border-t border-cyan-500/20">
                        "{highlightTamilWord(word.taExample2 || word.taExample, word.taWord, 'cyan')}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Thesaurus / Full View with Tap-to-Speak */}
            {(activeTab === 'all' || activeTab === 'thesaurus') && (
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 font-bold">
                    <Layers size={14} className="text-amber-400" />
                    <span>Thesaurus</span>
                  </h4>
                </div>

                {/* Synonyms with Section Audio Trigger */}
                <div className={`p-3 rounded-xl border transition-all ${
                  speakingTarget === 'synonyms'
                    ? 'bg-emerald-400/10 border-emerald-400/60 ring-1 ring-emerald-400/30'
                    : 'border-transparent'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-wider">
                      Synonyms ({word.synonyms?.length || 0})
                    </span>

                    {hasSynonyms && (
                      <button
                        type="button"
                        onClick={(e) =>
                          handleSpeakText(`Synonyms: ${word.synonyms?.join(', ')}`, 'synonyms', e)
                        }
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                          speakingTarget === 'synonyms'
                            ? 'bg-emerald-400 text-black border-emerald-400 font-bold'
                            : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-emerald-300 hover:border-emerald-400/40'
                        }`}
                        title="Listen to all synonyms"
                      >
                        {speakingTarget === 'synonyms' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={11} />}
                        <span>{speakingTarget === 'synonyms' ? 'Reading...' : 'Read All'}</span>
                      </button>
                    )}
                  </div>

                  {hasSynonyms ? (
                    <div className="flex flex-wrap gap-2">
                      {word.synonyms?.map((syn, i) => (
                        <div
                          key={i}
                          onClick={() => handleThesaurusClick(syn)}
                          className="text-xs font-mono text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/25 px-2.5 py-1.5 rounded-xl border border-emerald-400/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 group cursor-pointer"
                          title={`Click to search "${syn}", or tap speaker to pronounce`}
                        >
                          <span>{syn}</span>
                          <button
                            type="button"
                            onClick={(e) => handlePronounceTerm(syn, e)}
                            className="p-0.5 rounded hover:bg-emerald-400/30 text-emerald-400 transition-colors"
                            title={`Pronounce "${syn}"`}
                          >
                            <Volume2 size={11} />
                          </button>
                          <ArrowRight size={10} className="text-emerald-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-zinc-500 italic">No direct synonyms listed.</p>
                  )}
                </div>

                {/* Antonyms with Section Audio Trigger */}
                <div className={`p-3 rounded-xl border transition-all pt-2 border-t border-zinc-800/60 ${
                  speakingTarget === 'antonyms'
                    ? 'bg-rose-400/10 border-rose-400/60 ring-1 ring-rose-400/30'
                    : 'border-transparent'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20 uppercase tracking-wider">
                      Antonyms ({word.antonyms?.length || 0})
                    </span>

                    {hasAntonyms && (
                      <button
                        type="button"
                        onClick={(e) =>
                          handleSpeakText(`Antonyms: ${word.antonyms?.join(', ')}`, 'antonyms', e)
                        }
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                          speakingTarget === 'antonyms'
                            ? 'bg-rose-400 text-black border-rose-400 font-bold'
                            : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-rose-300 hover:border-rose-400/40'
                        }`}
                        title="Listen to all antonyms"
                      >
                        {speakingTarget === 'antonyms' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={11} />}
                        <span>{speakingTarget === 'antonyms' ? 'Reading...' : 'Read All'}</span>
                      </button>
                    )}
                  </div>

                  {hasAntonyms ? (
                    <div className="flex flex-wrap gap-2">
                      {word.antonyms?.map((ant, i) => (
                        <div
                          key={i}
                          onClick={() => handleThesaurusClick(ant)}
                          className="text-xs font-mono text-rose-300 bg-rose-400/10 hover:bg-rose-400/25 px-2.5 py-1.5 rounded-xl border border-rose-400/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 group cursor-pointer"
                          title={`Click to search "${ant}", or tap speaker to pronounce`}
                        >
                          <span>{ant}</span>
                          <button
                            type="button"
                            onClick={(e) => handlePronounceTerm(ant, e)}
                            className="p-0.5 rounded hover:bg-rose-400/30 text-rose-400 transition-colors"
                            title={`Pronounce "${ant}"`}
                          >
                            <Volume2 size={11} />
                          </button>
                          <ArrowRight size={10} className="text-rose-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-zinc-500 italic">No direct antonyms listed.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer - Centered Close Button with Right Bottom Navigation Controls */}
          <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between gap-3 relative">
            {/* Left Hint */}
            <div className="hidden sm:flex items-center gap-1.5 text-zinc-500 text-[11px]">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">Esc</kbd>
              <span>to close</span>
            </div>

            {/* Prominent Center Close Button */}
            <button
              onClick={() => {
                stopAllAudio();
                onClose();
              }}
              className="px-8 py-2.5 sm:py-3 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-black font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-amber-500/15 transition-all border border-amber-300 cursor-pointer mx-auto"
              title="Close modal (Esc)"
            >
              <X size={18} strokeWidth={2.5} />
              <span>CLOSE</span>
            </button>

            {/* Right Bottom Navigation Controls (← / → Nav) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic();
                  stopAllAudio();
                  if (onPrevWord) onPrevWord();
                }}
                disabled={!hasPrev}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl border font-mono text-xs transition-all ${
                  hasPrev
                    ? 'bg-zinc-800/90 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-400/50 active:scale-95 cursor-pointer shadow-sm'
                    : 'bg-zinc-900/40 border-zinc-800/40 text-zinc-600 opacity-40 cursor-not-allowed'
                }`}
                title="Previous word (Left arrow)"
              >
                <ChevronLeft size={16} />
                <span className="font-semibold hidden xs:inline">Prev</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic();
                  stopAllAudio();
                  if (onNextWord) onNextWord();
                }}
                disabled={!hasNext}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl border font-mono text-xs transition-all ${
                  hasNext
                    ? 'bg-zinc-800/90 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-400/50 active:scale-95 cursor-pointer shadow-sm'
                    : 'bg-zinc-900/40 border-zinc-800/40 text-zinc-600 opacity-40 cursor-not-allowed'
                }`}
                title="Next word (Right arrow)"
              >
                <span className="font-semibold hidden xs:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

