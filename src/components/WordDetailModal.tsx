import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Copy, Check, Bookmark, X, Share2, Sparkles, BookOpen, Globe } from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord, speakTamilWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

interface WordDetailModalProps {
  word: LexiconWord | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onWordSearch?: (word: string) => void;
}

export function WordDetailModal({
  word,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onWordSearch
}: WordDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeakingEn, setIsSpeakingEn] = useState(false);
  const [isSpeakingTa, setIsSpeakingTa] = useState(false);
  const [shared, setShared] = useState(false);

  if (!word) return null;

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(15);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSpeakEnglish = () => {
    triggerHaptic();
    speakWord(
      word.word,
      () => setIsSpeakingEn(true),
      () => setIsSpeakingEn(false),
      () => setIsSpeakingEn(false)
    );
  };

  const handleSpeakTamil = () => {
    triggerHaptic();
    speakTamilWord(
      word.taWord,
      () => setIsSpeakingTa(true),
      () => setIsSpeakingTa(false),
      () => setIsSpeakingTa(false)
    );
  };

  const handleCopy = () => {
    triggerHaptic();
    navigator.clipboard.writeText(`${word.word} (${word.taWord})\nPOS: ${word.pos}\nDefinition: ${word.definition}\nEnglish Example: "${word.enExample}"\nTamil Context: "${word.taExample}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    triggerHaptic();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Engineer Lexicon: ${word.word}`,
          text: `${word.word} (${word.taWord}) - ${word.definition}`,
          url: window.location.href,
        });
      } catch (e) {
        // fallback
      }
    } else {
      handleCopy();
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleSynAntClick = (text: string) => {
    if (onWordSearch) {
      onWordSearch(text);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#121215] border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col no-scrollbar"
          >
            {/* Drag Handle for Mobile */}
            <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mb-6 sm:hidden shrink-0" />

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-300 uppercase tracking-widest bg-purple-400/10 px-2.5 py-1 rounded-full border border-purple-400/20">
                  {word.pos}
                </span>
                <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  Lexicon Word #{word.id}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Word Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-serif italic text-amber-400 tracking-tight">
                    {word.word}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xl font-tamil text-amber-300 font-medium">
                      {word.taWord}
                    </p>
                    <button
                      onClick={handleSpeakTamil}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border transition-all flex items-center gap-1 ${
                        isSpeakingTa
                          ? 'bg-amber-400 text-black border-amber-400 font-bold'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-amber-300 hover:border-amber-400/40'
                      }`}
                      title="Speak Tamil pronunciation"
                    >
                      <Volume2 size={12} />
                      <span>TA Audio</span>
                    </button>
                  </div>
                </div>

                {/* English Pronounce Action */}
                <button
                  onClick={handleSpeakEnglish}
                  className={`p-3.5 rounded-full bg-amber-400 text-black hover:bg-amber-300 active:scale-95 transition-all shadow-lg flex items-center justify-center shrink-0 ${
                    isSpeakingEn ? 'ring-4 ring-amber-400/40 animate-pulse' : ''
                  }`}
                  title="Listen English Pronunciation"
                >
                  {isSpeakingEn ? <AudioEqualizer isPlaying={true} /> : <Volume2 size={20} />}
                </button>
              </div>

              {/* Sound Wave Animation when speaking English */}
              {isSpeakingEn && (
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-xs font-mono text-amber-400 mr-2">Pronouncing in British English...</span>
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: ['4px', '16px', '4px'] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1 bg-amber-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Dock */}
            <div className="grid grid-cols-3 gap-3 mb-8 bg-zinc-900/60 p-2 rounded-2xl border border-zinc-800/80">
              <button
                onClick={() => {
                  triggerHaptic();
                  onToggleBookmark();
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all text-xs font-mono gap-1.5 ${
                  isBookmarked
                    ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Bookmark size={18} className={isBookmarked ? 'fill-amber-400' : ''} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800/50 gap-1.5"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800/50 gap-1.5"
              >
                {shared ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
                <span>{shared ? 'Shared!' : 'Share'}</span>
              </button>
            </div>

            {/* Core Definition */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={15} className="text-amber-400" />
                  <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Definition</h4>
                </div>
                <p className="text-zinc-200 font-sans text-base leading-relaxed">
                  {word.definition}
                </p>
              </div>

              {/* Examples */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={15} className="text-blue-300" />
                    <h4 className="text-xs font-mono text-blue-300 uppercase tracking-widest">Engineering Context</h4>
                  </div>
                  <p className="text-zinc-300 font-serif italic text-base sm:text-lg leading-relaxed">
                    "{word.enExample}"
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-indigo-300">TA</span>
                    <h4 className="text-xs font-mono text-indigo-300 uppercase tracking-widest">Tamil Context & Usage</h4>
                  </div>
                  <p className="text-zinc-300 font-tamil text-base leading-relaxed">
                    "{word.taExample}"
                  </p>
                </div>
              </div>

              {/* Synonyms & Antonyms */}
              {((word.synonyms && word.synonyms.length > 0) || (word.antonyms && word.antonyms.length > 0)) && (
                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 space-y-4">
                  {word.synonyms && word.synonyms.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles size={13} className="text-emerald-400/80" />
                        <span className="text-xs font-mono text-emerald-400/80 uppercase tracking-widest">Synonyms</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {word.synonyms.map((syn, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleSynAntClick(syn)}
                            className="text-xs font-mono text-emerald-300 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 cursor-pointer hover:bg-emerald-400/20 transition-colors"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {word.antonyms && word.antonyms.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-rose-400/80 uppercase tracking-widest block mb-2">Antonyms</span>
                      <div className="flex flex-wrap gap-2">
                        {word.antonyms.map((ant, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleSynAntClick(ant)}
                            className="text-xs font-mono text-rose-300 bg-rose-400/10 px-3 py-1 rounded-full border border-rose-400/20 cursor-pointer hover:bg-rose-400/20 transition-colors"
                          >
                            {ant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

