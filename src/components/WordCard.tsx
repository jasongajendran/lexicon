import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Copy, Check, Bookmark, Sparkles, ExternalLink } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';

export interface WordCardProps {
  key?: number;
  word: LexiconWord;
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSelectWord: (word: LexiconWord) => void;
  onWordSearch?: (word: string) => void;
}

export function WordCard({
  word,
  index,
  isBookmarked,
  onToggleBookmark,
  onSelectWord,
  onWordSearch
}: WordCardProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        triggerHaptic();
        onSelectWord(word);
      }}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-400/40 active:border-amber-400/60 hover:bg-zinc-900/90 transition-all duration-300 shadow-lg cursor-pointer overflow-hidden backdrop-blur-md"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/10 transition-all duration-500" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
            #{index.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] font-mono text-purple-300 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20 uppercase tracking-wider font-medium">
            {word.pos}
          </span>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/80 active:bg-amber-400/20 transition-all ${
              isSpeaking ? 'text-amber-400 bg-amber-400/10 ring-1 ring-amber-400/30 animate-pulse' : ''
            }`}
            title="Pronounce"
          >
            <Volume2 size={16} />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/80 active:bg-amber-400/20 transition-all"
            title="Copy"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl transition-all ${
              isBookmarked
                ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30'
                : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/80'
            }`}
            title="Bookmark"
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-amber-400' : ''} />
          </button>
        </div>
      </div>

      {/* Word & Tamil Title */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-2xl md:text-3xl font-serif italic text-zinc-100 group-hover:text-amber-400 transition-colors duration-300">
            {word.word}
          </h3>
          <ExternalLink size={14} className="text-zinc-600 group-hover:text-amber-400/60 transition-colors shrink-0" />
        </div>
        <p className="text-sm font-tamil text-amber-400/90 font-medium mt-1">
          {word.taWord}
        </p>
      </div>

      {/* Definition */}
      <p className="text-xs md:text-sm text-zinc-400 font-sans line-clamp-3 leading-relaxed mb-6">
        {word.definition}
      </p>

      {/* Footer: Synonyms & Tap indicator */}
      <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80%]">
          {word.synonyms && word.synonyms.length > 0 ? (
            <>
              <Sparkles size={11} className="text-emerald-400/70 shrink-0" />
              <span className="text-[11px] text-zinc-400 truncate">
                {word.synonyms.slice(0, 2).join(', ')}
              </span>
            </>
          ) : (
            <span className="text-[10px] text-zinc-600">Technical Term</span>
          )}
        </div>
        <span className="text-[10px] text-zinc-500 group-hover:text-amber-400 transition-colors">
          View &rarr;
        </span>
      </div>
    </motion.div>
  );
}
