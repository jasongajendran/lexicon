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
  onSelectWord?: (word: LexiconWord) => void;
}

export function WordCard({
  word,
  index,
  isBookmarked,
  onToggleBookmark,
  onWordSearch,
  onSelectWord
}: WordCardProps) {
  const [copied, setCopied] = useState(false);
  const [speakingTarget, setSpeakingTarget] = useState<'word' | 'def' | 'ex' | null>(null);

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
    <div
      id={`word-entry-${word.id}`}
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-400/40 transition-all duration-300 shadow-lg overflow-hidden backdrop-blur-md cursor-pointer active:scale-[0.99]"
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
                speakingTarget === 'word' ? 'text-amber-400 bg-amber-400/10 ring-1 ring-amber-400/30 border border-amber-400/40' : ''
              }`}
              title="Pronounce English"
            >
              {speakingTarget === 'word' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={16} />}
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
        <div className="flex items-start justify-between gap-2 mb-4 p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40">
          <p className="text-xs md:text-sm text-zinc-300 font-sans leading-relaxed">
            {word.definition}
          </p>
          <button
            onClick={(e) => handleSpeakText(word.definition, 'def', e)}
            className={`p-1 rounded-lg border transition-all shrink-0 ${
              speakingTarget === 'def'
                ? 'bg-amber-400/10 border-amber-400/60 text-amber-400 ring-1 ring-amber-400/30'
                : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
            }`}
            title="Listen to English definition"
          >
            {speakingTarget === 'def' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={13} />}
          </button>
        </div>

        {/* Context Examples */}
        <div className="space-y-2 mb-4">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-blue-300 block font-medium">EN CONTEXT</span>
              <button
                onClick={(e) => handleSpeakText(word.enExample, 'ex', e)}
                className={`p-1 rounded-lg border transition-all ${
                  speakingTarget === 'ex'
                    ? 'bg-amber-400/10 border-amber-400/60 text-amber-400 ring-1 ring-amber-400/30'
                    : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
                }`}
                title="Listen to English example"
              >
                {speakingTarget === 'ex' ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={12} />}
              </button>
            </div>
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
    </div>
  );
}
