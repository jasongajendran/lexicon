import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, Copy, Check, Bookmark } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

interface WordRowProps {
  key?: number;
  word: LexiconWord; 
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSelectWord: (word: LexiconWord) => void;
  onWordSearch?: (word: string) => void;
}

export function WordRow({ 
  word, 
  index,
  isBookmarked,
  onToggleBookmark,
  onSelectWord,
  onWordSearch
}: WordRowProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply Intersection Observer for mobile/tablet where hover doesn't work well for scrolling
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

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    speakWord(
      word.word,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    navigator.clipboard.writeText(`${word.word} - ${word.definition}\nEN: ${word.enExample}\nTA: ${word.taExample}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  // Helper to highlight occurrences of the word within the text on hover or when centered
  const highlightMatch = (text: string, match: string) => {
    if (!match || typeof match !== 'string' || typeof text !== 'string') return text;
    // Handle multiple terms (e.g., "மாதிரி / சிந்தனை முறை")
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

  return (
    <motion.div 
      ref={rowRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onTouchStart={() => {}} 
      onClick={() => {
        triggerHaptic();
        onSelectWord(word);
      }}
      tabIndex={0}
      className={`group relative flex flex-col md:flex-row gap-6 md:gap-12 py-12 md:py-20 border-t border-zinc-800/50 transition-all duration-300 px-4 md:px-8 cursor-pointer focus:outline-none ${isCentered ? 'bg-zinc-900/40' : 'hover:bg-zinc-900/40 active:bg-zinc-900/60'}`}
    >
      {/* Index Number */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 text-xs font-mono text-zinc-600 tracking-widest flex items-center gap-2">
        <span>{index.toString().padStart(2, '0')}</span>
        {isBookmarked && <Bookmark size={12} className="text-amber-400 fill-amber-400" />}
      </div>

      {/* Top Right Actions */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleBookmark}
          className={`p-2 rounded-full bg-zinc-900/80 md:bg-transparent hover:bg-zinc-800 transition-colors ${isBookmarked ? 'text-amber-400' : 'text-zinc-400 hover:text-amber-400'}`}
          title="Toggle bookmark"
        >
          <Bookmark size={16} className={isBookmarked ? "fill-amber-400" : ""} />
        </button>
        <button 
          onClick={handleSpeak}
          className={`p-2 rounded-full bg-zinc-900/80 md:bg-transparent hover:bg-zinc-800 transition-colors ${
            isSpeaking ? 'text-amber-400' : 'text-zinc-400 hover:text-amber-400'
          }`}
          title="Pronounce word"
        >
          {isSpeaking ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
        </button>
        <button 
          onClick={handleCopy}
          className="p-2 rounded-full bg-zinc-900/80 md:bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>

      {/* Left Column: Word & Definition */}
      <div className="md:w-5/12 flex flex-col justify-center">
        <div className="flex items-baseline gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic tracking-tight text-amber-400">
            {word.word}
          </h2>
          <span className="text-sm font-mono text-purple-300 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">{word.pos}</span>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-zinc-400 font-sans text-sm md:text-base leading-relaxed tracking-wide">
            <span className="text-zinc-500 italic mr-2 text-xs">def.</span>
            {word.definition}
          </p>
          <p className="text-zinc-400 font-tamil text-sm md:text-base leading-relaxed tracking-wide">
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
                      <span 
                        key={i} 
                        onClick={(e) => handleSynAntClick(e, syn)}
                        className="text-xs text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 px-2 py-0.5 rounded border border-emerald-400/20 cursor-pointer transition-colors"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {word.antonyms && word.antonyms.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-rose-400/70 uppercase tracking-widest">Ant</span>
                  <div className="flex flex-wrap gap-1.5">
                    {word.antonyms.map((ant, i) => (
                      <span 
                        key={i} 
                        onClick={(e) => handleSynAntClick(e, ant)}
                        className="text-xs text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 px-2 py-0.5 rounded border border-rose-400/20 cursor-pointer transition-colors"
                      >
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Right Column: Examples */}
      <div className="md:w-7/12 flex flex-col justify-center gap-6 md:gap-8">
        {/* English Example */}
        <div className={`relative pl-6 md:pl-8 border-l transition-colors duration-500 ${isCentered ? 'border-amber-400/30' : 'border-zinc-800 group-hover:border-amber-400/30'}`}>
          <span className="absolute -left-3 top-0 text-xs font-mono text-blue-300 bg-[#0a0a0a] py-1 px-2 rounded-full border border-blue-400/20 shadow-sm shadow-blue-400/5">EN</span>
          <p className="text-lg md:text-xl font-serif text-zinc-300 leading-relaxed">
            "{highlightMatch(word.enExample, word.word)}"
          </p>
        </div>
        
        {/* Tamil Example */}
        <div className={`relative pl-6 md:pl-8 border-l transition-colors duration-500 ${isCentered ? 'border-amber-400/30' : 'border-zinc-800 group-hover:border-amber-400/30'}`}>
          <span className="absolute -left-3 top-0 text-xs font-mono text-indigo-300 bg-[#0a0a0a] py-1 px-2 rounded-full border border-indigo-400/20 shadow-sm shadow-indigo-400/5">TA</span>
          <p className="text-base md:text-lg font-tamil text-zinc-400 leading-relaxed font-light">
            "{highlightMatch(word.taExample, word.taWord)}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
