import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Copy, Check, Bookmark, Sparkles } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

export interface WordCardProps {
  key?: number;
  word: LexiconWord;
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onWordSearch?: (word: string) => void;
}

export function WordCard({
  word,
  index,
  isBookmarked,
  onToggleBookmark,
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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    navigator.clipboard.writeText(`${word.word} (${word.taWord})\nPOS: ${word.pos}\nDefinition: ${word.definition}\nEN: ${word.enExample}\nTA: ${word.taExample}`);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-400/30 transition-all duration-300 shadow-lg overflow-hidden backdrop-blur-md"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/10 transition-all duration-500" />

      <div>
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
                isSpeaking ? 'text-amber-400 bg-amber-400/10 ring-1 ring-amber-400/30' : ''
              }`}
              title="Pronounce English"
            >
              {isSpeaking ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
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
        <div className="mb-3">
          <button
            onClick={handleSpeak}
            className="text-left group/title flex items-baseline gap-2 focus:outline-none"
            title="Click to pronounce"
          >
            <h3 className="text-2xl md:text-3xl font-serif italic text-amber-400 group-hover/title:text-amber-300 transition-colors">
              {word.word}
            </h3>
          </button>
          <p className="text-sm font-tamil text-amber-300/90 font-medium mt-0.5">
            {word.taWord}
          </p>
        </div>

        {/* Definition */}
        <p className="text-xs md:text-sm text-zinc-300 font-sans leading-relaxed mb-4">
          {word.definition}
        </p>

        {/* Context Examples */}
        <div className="space-y-2 mb-4">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] font-mono text-blue-300 block mb-0.5 font-medium">EN CONTEXT</span>
            <p className="text-xs font-serif text-zinc-300 italic">
              "{word.enExample}"
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] font-mono text-indigo-300 block mb-0.5 font-medium">TA USAGE</span>
            <p className="text-xs font-tamil text-zinc-300">
              "{word.taExample}"
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Synonyms / Antonyms */}
      {((word.synonyms && word.synonyms.length > 0) || (word.antonyms && word.antonyms.length > 0)) && (
        <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5 text-xs font-mono">
          {word.synonyms?.map((syn, i) => (
            <button
              key={i}
              onClick={(e) => handleSynAntClick(e, syn)}
              className="text-[11px] text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 px-2 py-0.5 rounded border border-emerald-400/20 transition-colors"
            >
              {syn}
            </button>
          ))}
          {word.antonyms?.map((ant, i) => (
            <button
              key={i}
              onClick={(e) => handleSynAntClick(e, ant)}
              className="text-[11px] text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 px-2 py-0.5 rounded border border-rose-400/20 transition-colors"
            >
              {ant}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
