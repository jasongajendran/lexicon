import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, Bookmark } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

interface WordRowProps {
  key?: number;
  word: LexiconWord; 
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onWordSearch?: (word: string) => void;
  onSelectWord?: (word: LexiconWord) => void;
}

export function WordRow({ 
  word, 
  index, 
  isBookmarked, 
  onToggleBookmark,
  onWordSearch,
  onSelectWord
}: WordRowProps) {
  const [speakingTarget, setSpeakingTarget] = useState<'word' | 'def' | 'ex' | null>(null);
  const [isCentered, setIsCentered] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply Intersection Observer for mobile/tablet where hover doesn't work well for scrolling
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsCentered(entry.isIntersecting);
        },
        {
          rootMargin: '-40% 0px -40% 0px',
          threshold: 0
        }
      );

      if (rowRef.current) {
        observer.observe(rowRef.current);
      }

      return () => {
        if (rowRef.current) observer.unobserve(rowRef.current);
      };
    }
  }, []);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSpeakText = (text: string, target: 'word' | 'def' | 'ex', e?: React.MouseEvent) => {
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

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    onToggleBookmark();
  };

  const handleSynAntClick = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (onWordSearch) {
      onWordSearch(text);
    }
  };

  // Helper to highlight occurrences of the word within the text
  const highlightMatch = (text: string, match: string) => {
    if (!match || typeof match !== 'string' || typeof text !== 'string') return text;
    const matchTerms = match.split('/').map(t => t.trim()).filter(Boolean);
    const safeMatches = matchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const parts = text.split(new RegExp(`(${safeMatches.join('|')})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => {
          const isMatch = matchTerms.some(t => part.toLowerCase() === t.toLowerCase());
          return isMatch ? (
            <span key={i} className="rounded-sm px-0.5 -mx-0.5 font-medium text-amber-400 bg-amber-400/10">{part}</span>
          ) : (
            part
          );
        })}
      </>
    );
  };

  const handleRowClick = () => {
    if (onSelectWord) {
      triggerHaptic();
      onSelectWord(word);
    }
  };

  return (
    <div 
      id={`word-entry-${word.id}`}
      ref={rowRef}
      onClick={handleRowClick}
      className={`group relative flex flex-col md:flex-row gap-6 md:gap-12 py-12 md:py-16 border-t border-zinc-800/50 transition-all duration-300 px-4 md:px-8 cursor-pointer ${isCentered ? 'bg-zinc-900/40' : 'hover:bg-zinc-900/30'}`}
    >
      {/* Index Number & Detail Hint */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 text-xs font-mono text-zinc-600 tracking-widest flex items-center gap-2">
        <span>{index.toString().padStart(2, '0')}</span>
        {isBookmarked && <Bookmark size={12} className="text-amber-400 fill-amber-400" />}
        <span className="hidden sm:inline text-[10px] text-zinc-600 group-hover:text-amber-400/80 transition-colors font-mono ml-2 opacity-0 group-hover:opacity-100">
          • Click for 2 examples & thesaurus
        </span>
      </div>

      {/* Top Right Actions (Bookmark on left, Sound on far right for thumb access) */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button 
          onClick={handleBookmark}
          className={`p-2 rounded-xl border transition-all ${
            isBookmarked 
              ? 'bg-amber-400/20 border-amber-400/50 text-amber-300' 
              : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
          }`}
          title={isBookmarked ? "Remove bookmark" : "Bookmark word"}
        >
          <Bookmark size={16} className={isBookmarked ? "fill-amber-400 text-amber-400" : ""} />
        </button>
        <button 
          onClick={handleSpeak}
          className={`p-2 rounded-xl border transition-all shrink-0 ${
            speakingTarget === 'word' 
              ? 'bg-amber-400/10 border-amber-400/60 text-amber-400 ring-1 ring-amber-400/30' 
              : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
          }`}
          title="Pronounce word in English"
        >
          {speakingTarget === 'word' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Left Column: Word & Definition */}
      <div className="md:w-5/12 flex flex-col justify-center">
        <div className="flex items-baseline gap-4 flex-wrap">
          <div className="text-left group/title flex items-baseline gap-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic tracking-tight text-amber-400 group-hover/title:text-amber-300 transition-colors">
              {word.word}
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">{word.pos}</span>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40">
            <p className="text-zinc-300 font-sans text-sm md:text-base leading-relaxed tracking-wide">
              <span className="text-amber-400/80 font-mono font-bold mr-2 text-xs">DEF</span>
              {word.definition}
            </p>
            <button
              onClick={(e) => handleSpeakText(word.definition, 'def', e)}
              className={`p-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                speakingTarget === 'def'
                  ? 'bg-amber-400/10 border-amber-400/60 text-amber-400 ring-1 ring-amber-400/30'
                  : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-amber-400'
              }`}
              title="Listen to English definition"
            >
              {speakingTarget === 'def' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={13} />}
            </button>
          </div>
          <p className="text-zinc-300 font-tamil text-sm md:text-base leading-relaxed tracking-wide">
            <span className="text-zinc-500 font-mono mr-2 text-xs">ta.</span>
            <span className="font-medium text-amber-400">
              {word.taWord}
            </span>
          </p>
          
          {/* Synonyms & Antonyms */}
          {(word.synonyms?.length || word.antonyms?.length) ? (
            <div className="mt-2 flex flex-col gap-2">
              {word.synonyms && word.synonyms.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-emerald-400/70 uppercase tracking-widest">Syn</span>
                  <div className="flex flex-wrap gap-1.5">
                    {word.synonyms.map((syn, i) => (
                      <button 
                        key={i} 
                        onClick={(e) => handleSynAntClick(e, syn)}
                        className="text-xs text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 px-2 py-0.5 rounded border border-emerald-400/20 cursor-pointer transition-colors"
                      >
                        {syn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {word.antonyms && word.antonyms.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-rose-400/70 uppercase tracking-widest">Ant</span>
                  <div className="flex flex-wrap gap-1.5">
                    {word.antonyms.map((ant, i) => (
                      <button 
                        key={i} 
                        onClick={(e) => handleSynAntClick(e, ant)}
                        className="text-xs text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 px-2 py-0.5 rounded border border-rose-400/20 cursor-pointer transition-colors"
                      >
                        {ant}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Right Column: Examples */}
      <div className="md:w-7/12 flex flex-col justify-center gap-5 md:gap-6">
        {/* English Example */}
        <div className={`relative pl-6 md:pl-8 border-l transition-colors duration-500 flex items-start justify-between gap-3 ${isCentered ? 'border-amber-400/30' : 'border-zinc-800 group-hover:border-amber-400/30'}`}>
          <span className="absolute -left-3 top-0 text-xs font-mono text-blue-300 bg-[#0a0a0a] py-1 px-2 rounded-full border border-blue-400/20 shadow-sm shadow-blue-400/5">EN</span>
          <p className="text-base md:text-lg font-serif text-zinc-200 leading-relaxed">
            "{highlightMatch(word.enExample, word.word)}"
          </p>
          <button
            onClick={(e) => handleSpeakText(word.enExample, 'ex', e)}
            className={`p-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              speakingTarget === 'ex'
                ? 'bg-amber-400/10 border-amber-400/60 text-amber-400 ring-1 ring-amber-400/30'
                : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
            }`}
            title="Listen to English example"
          >
            {speakingTarget === 'ex' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={13} />}
          </button>
        </div>
        
        {/* Tamil Example */}
        <div className={`relative pl-6 md:pl-8 border-l transition-colors duration-500 ${isCentered ? 'border-amber-400/30' : 'border-zinc-800 group-hover:border-amber-400/30'}`}>
          <span className="absolute -left-3 top-0 text-xs font-mono text-indigo-300 bg-[#0a0a0a] py-1 px-2 rounded-full border border-indigo-400/20 shadow-sm shadow-indigo-400/5">TA</span>
          <p className="text-sm md:text-base font-tamil text-zinc-300 leading-relaxed font-light">
            "{highlightMatch(word.taExample, word.taWord)}"
          </p>
        </div>
      </div>
    </div>
  );
}
