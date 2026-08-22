import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2, Bookmark, Copy, Check } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

interface WordOfTheDayCardProps {
  word: LexiconWord;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onWordSearch?: (wordText: string) => void;
  onSelectWord?: (word: LexiconWord) => void;
}

export function WordOfTheDayCard({
  word,
  isBookmarked,
  onToggleBookmark,
  onWordSearch,
  onSelectWord
}: WordOfTheDayCardProps) {
  const [speakingTarget, setSpeakingTarget] = useState<'word' | 'def' | null>(null);
  const [copied, setCopied] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleCardClick = () => {
    if (onSelectWord) {
      triggerHaptic();
      onSelectWord(word);
    }
  };

  const handleSpeakText = (text: string, target: 'word' | 'def', e?: React.MouseEvent) => {
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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    navigator.clipboard.writeText(`${word.word} (${word.taWord})\nPOS: ${word.pos}\nDefinition: ${word.definition}\nEN: ${word.enExample}\nTA: ${word.taExample}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSynAntClick = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    triggerHaptic();
    if (onWordSearch) {
      onWordSearch(term);
    }
  };

  const hasSynonyms = Boolean(word.synonyms && word.synonyms.length > 0);
  const hasAntonyms = Boolean(word.antonyms && word.antonyms.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950 border border-amber-500/25 shadow-2xl shadow-amber-500/5 mb-8"
    >
      {/* Background Ambient Halo Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge & Actions */}
      <div className="flex items-center justify-between mb-4 z-10 relative">
        <div className="flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full text-amber-300 text-xs font-mono font-medium">
          <Sparkles size={13} className="text-amber-400 animate-pulse" />
          <span>Spotlight Term of the Day</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-xl border transition-all ${
              speakingTarget === 'word'
                ? 'bg-amber-400/10 border-amber-400/60 text-amber-400 ring-1 ring-amber-400/30 shadow-lg shadow-amber-400/10'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
            }`}
            title="Listen to pronunciation"
          >
            {speakingTarget === 'word' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl border bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40 transition-all"
            title="Copy term"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic();
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
          <button
            onClick={handleSpeak}
            className="text-left group/title flex items-baseline gap-2 focus:outline-none"
            title="Click to pronounce"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-amber-400 tracking-tight group-hover/title:text-amber-300 transition-colors">
              {word.word}
            </h3>
          </button>
          <span className="text-xs font-mono text-purple-300 bg-purple-400/10 px-2.5 py-0.5 rounded-full border border-purple-400/20">
            {word.pos}
          </span>
          <span className="text-base font-tamil text-amber-300/90 font-medium">
            ({word.taWord})
          </span>
        </div>
      </div>

      {/* Definition with Sound Icon */}
      <div className="flex items-start justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 mb-4 z-10 relative">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider block">
            Definition
          </span>
          <p className="text-zinc-200 text-sm md:text-base font-sans font-normal leading-relaxed">
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

      {/* Synonyms & Antonyms */}
      {(hasSynonyms || hasAntonyms) && (
        <div className="mb-4 pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center gap-3 z-10 relative text-xs font-mono">
          {hasSynonyms && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold">Synonyms:</span>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms?.map((syn, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleSynAntClick(e, syn)}
                    className="text-[11px] text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 px-2.5 py-0.5 rounded-md border border-emerald-400/25 transition-all hover:scale-105 active:scale-95"
                    title={`Search "${syn}"`}
                  >
                    {syn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasAntonyms && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest text-rose-400/80 font-bold">Antonyms:</span>
              <div className="flex flex-wrap gap-1.5">
                {word.antonyms?.map((ant, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleSynAntClick(e, ant)}
                    className="text-[11px] text-rose-300 bg-rose-400/10 hover:bg-rose-400/20 px-2.5 py-0.5 rounded-md border border-rose-400/25 transition-all hover:scale-105 active:scale-95"
                    title={`Search "${ant}"`}
                  >
                    {ant}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Context Examples */}
      <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 space-y-2 z-10 relative">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-bold">
            Ex 1
          </span>
          <span className="text-[10px] font-mono text-zinc-500">EN · TA</span>
        </div>
        <p className="text-xs sm:text-sm font-serif text-zinc-200 italic leading-relaxed pl-2 border-l-2 border-amber-400/80">
          "{word.enExample}"
        </p>
        <p className="text-xs sm:text-sm font-tamil text-amber-300/90 leading-relaxed pl-2 border-l-2 border-indigo-400/80 pt-1 border-t border-zinc-800/50">
          "{word.taExample}"
        </p>
      </div>

      {/* View Details Button */}
      {onSelectWord && (
        <div className="pt-3 flex justify-end z-10 relative">
          <button
            onClick={handleCardClick}
            className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/25 transition-all cursor-pointer"
          >
            <span>Explore Details</span>
            <span>→</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
