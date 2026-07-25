import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2, ArrowUpRight, Bookmark, Check } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

interface WordOfTheDayCardProps {
  word: LexiconWord;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSelectWord: (word: LexiconWord) => void;
}

export function WordOfTheDayCard({
  word,
  isBookmarked,
  onToggleBookmark,
  onSelectWord,
}: WordOfTheDayCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSpeaking(true);
    speakWord(
      word.word,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => onSelectWord(word)}
      className="relative group cursor-pointer overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950 border border-amber-500/25 shadow-2xl shadow-amber-500/5 hover:border-amber-400/50 transition-all duration-300 mb-8"
    >
      {/* Background Ambient Halo Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-500" />

      {/* Top Header Badge & Actions */}
      <div className="flex items-center justify-between mb-4 z-10 relative">
        <div className="flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full text-amber-300 text-xs font-mono font-medium">
          <Sparkles size={13} className="text-amber-400 animate-pulse" />
          <span>Spotlight Term of the Day</span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-xl border transition-all ${
              isSpeaking
                ? 'bg-amber-400 border-amber-400 text-black shadow-lg shadow-amber-400/30'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
            }`}
            title="Listen to pronunciation"
          >
            {isSpeaking ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark term'}
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''} />
          </button>
        </div>
      </div>

      {/* Main Term */}
      <div className="mb-4 z-10 relative">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-amber-400 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
            {word.word}
          </h3>
          <span className="text-xs font-mono text-purple-300 bg-purple-400/10 px-2.5 py-0.5 rounded-full border border-purple-400/20">
            {word.pos}
          </span>
          <span className="text-sm font-tamil text-amber-300/90 font-medium">
            ({word.taWord})
          </span>
        </div>
      </div>

      {/* Definition */}
      <p className="text-zinc-300 text-sm md:text-base font-sans font-normal leading-relaxed mb-4 z-10 relative line-clamp-2">
        {word.definition}
      </p>

      {/* Footer Callout */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-4 border-t border-zinc-800/60 z-10 relative">
        <span className="italic text-zinc-400 group-hover:text-zinc-300 transition-colors">
          "{word.enExample}"
        </span>
        <div className="flex items-center gap-1 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0 font-sans font-medium">
          <span>Explore term</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}
