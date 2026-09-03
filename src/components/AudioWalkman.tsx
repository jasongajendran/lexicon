import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Shuffle,
  Bookmark,
  Headphones,
  List,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord, stopSpeaking } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';

interface AudioWalkmanProps {
  words: LexiconWord[];
  bookmarkedIds: number[];
  onToggleBookmark: (id: number) => void;
  onSelectWordModal?: (word: LexiconWord) => void;
  onSelectWord?: (word: LexiconWord) => void;
  onExit?: () => void;
}

export function AudioWalkman({
  words,
  bookmarkedIds,
  onToggleBookmark,
  onSelectWordModal,
  onSelectWord,
  onExit
}: AudioWalkmanProps) {
  const handleWordSelect = onSelectWord || onSelectWordModal;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffleMode, setIsShuffleMode] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.92);
  const [pauseDuration, setPauseDuration] = useState<number>(3000); // 3 seconds between words
  const [speakMode, setSpeakMode] = useState<'word-def-ex' | 'read-all'>('read-all');
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);

  const playlist = words;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  const isShuffleModeRef = useRef<boolean>(false);
  isShuffleModeRef.current = isShuffleMode;

  const speakModeRef = useRef<'word-def-ex' | 'read-all'>(speakMode);
  speakModeRef.current = speakMode;

  const speechSpeedRef = useRef(speechSpeed);
  speechSpeedRef.current = speechSpeed;

  const pauseDurationRef = useRef(pauseDuration);
  pauseDurationRef.current = pauseDuration;

  // Track session ID to prevent race conditions and rapid auto-skipping loops
  const playbackSessionRef = useRef<number>(0);
  // Navigation history to allow back-stepping even in shuffle mode
  const historyStackRef = useRef<number[]>([0]);

  const currentWord = playlist[currentIndex] || playlist[0];

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  const stopAllAudio = useCallback(() => {
    playbackSessionRef.current += 1;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopSpeaking();
    setIsSpeakingNow(false);
  }, []);

  const getNextIndex = useCallback((fromIndex: number): number => {
    if (!playlist || playlist.length <= 1) return 0;
    if (isShuffleModeRef.current) {
      let rand = Math.floor(Math.random() * playlist.length);
      // Avoid picking the exact same word immediately
      if (rand === fromIndex) {
        rand = (rand + 1) % playlist.length;
      }
      return rand;
    }
    return (fromIndex + 1) % playlist.length;
  }, [playlist]);

  const playWordAtIndex = useCallback((index: number) => {
    if (!playlist || playlist.length === 0) return;
    const target = playlist[index];
    if (!target) return;

    // Increment session ID to invalidate any previous pending callbacks
    const currentSession = ++playbackSessionRef.current;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopSpeaking();

    const mode = speakModeRef.current;
    const speed = speechSpeedRef.current;

    setIsSpeakingNow(true);

    // Stage 1: Pronounce the headword first
    speakWord(
      target.word,
      () => {
        if (playbackSessionRef.current === currentSession) {
          setIsSpeakingNow(true);
        }
      },
      () => {
        // Headword speaking completed
        if (playbackSessionRef.current !== currentSession) return;

        // Distinct pause between word and definition
        timerRef.current = setTimeout(() => {
          if (playbackSessionRef.current !== currentSession) return;
          if (!isPlayingRef.current) {
            setIsSpeakingNow(false);
            return;
          }

          // Stage 2: Speak definition, example, and synonyms (if in read-all mode)
          let detailsText = target.definition;
          if (target.enExample) {
            detailsText += `. For example: ${target.enExample}`;
          }
          if (mode === 'read-all' && target.synonyms && target.synonyms.length > 0) {
            detailsText += `. Synonyms: ${target.synonyms.join(', ')}.`;
          }

          speakWord(
            detailsText,
            () => {
              if (playbackSessionRef.current === currentSession) {
                setIsSpeakingNow(true);
              }
            },
            () => {
              // Details finished speaking
              if (playbackSessionRef.current !== currentSession) return;
              setIsSpeakingNow(false);

              if (isPlayingRef.current) {
                timerRef.current = setTimeout(() => {
                  if (playbackSessionRef.current !== currentSession) return;
                  if (!isPlayingRef.current) return;

                  setCurrentIndex(prev => {
                    const next = getNextIndex(prev);
                    historyStackRef.current.push(next);
                    if (historyStackRef.current.length > 100) {
                      historyStackRef.current.shift();
                    }
                    playWordAtIndex(next);
                    return next;
                  });
                }, pauseDurationRef.current);
              }
            },
            () => {
              // Details speech error fallback
              if (playbackSessionRef.current !== currentSession) return;
              setIsSpeakingNow(false);

              if (isPlayingRef.current) {
                timerRef.current = setTimeout(() => {
                  if (playbackSessionRef.current !== currentSession) return;
                  if (!isPlayingRef.current) return;

                  setCurrentIndex(prev => {
                    const next = getNextIndex(prev);
                    historyStackRef.current.push(next);
                    playWordAtIndex(next);
                    return next;
                  });
                }, Math.max(pauseDurationRef.current, 2000));
              }
            },
            speed
          );
        }, 750); // Pause between the word and definition
      },
      () => {
        // Headword speech error fallback
        if (playbackSessionRef.current !== currentSession) return;
        setIsSpeakingNow(false);

        if (isPlayingRef.current) {
          timerRef.current = setTimeout(() => {
            if (playbackSessionRef.current !== currentSession) return;
            if (!isPlayingRef.current) return;

            setCurrentIndex(prev => {
              const next = getNextIndex(prev);
              historyStackRef.current.push(next);
              playWordAtIndex(next);
              return next;
            });
          }, Math.max(pauseDurationRef.current, 2000));
        }
      },
      speed
    );
  }, [playlist, getNextIndex]);

  const togglePlayPause = () => {
    triggerHaptic();
    if (isPlaying) {
      setIsPlaying(false);
      stopAllAudio();
    } else {
      setIsPlaying(true);
      playWordAtIndex(currentIndex);
    }
  };

  const handleNextWord = () => {
    triggerHaptic();
    stopAllAudio();
    const next = getNextIndex(currentIndex);
    historyStackRef.current.push(next);
    if (historyStackRef.current.length > 100) {
      historyStackRef.current.shift();
    }
    setCurrentIndex(next);
    if (isPlaying) {
      playWordAtIndex(next);
    }
  };

  const handlePrevWord = () => {
    triggerHaptic();
    stopAllAudio();

    let prev = 0;
    if (historyStackRef.current.length > 1) {
      // Pop current
      historyStackRef.current.pop();
      // Peek previous
      prev = historyStackRef.current[historyStackRef.current.length - 1] ?? 0;
    } else {
      prev = (currentIndex - 1 + playlist.length) % playlist.length;
      historyStackRef.current = [prev];
    }

    setCurrentIndex(prev);
    if (isPlaying) {
      playWordAtIndex(prev);
    }
  };

  const toggleShuffleMode = () => {
    triggerHaptic();
    setIsShuffleMode(prev => !prev);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  if (!currentWord) {
    return null;
  }

  const isBookmarked = bookmarkedIds.includes(currentWord.id);

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 space-y-4">
      {/* Main Walkman Player Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl bg-[#111113] border border-zinc-800/90 p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6"
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-72 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Bar: Walkman branding, track counter & quick actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Headphones size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                  Audio Walkman
                </span>
                {isShuffleMode && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-semibold">
                    Shuffle ON
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                Word {currentIndex + 1} of {playlist.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(currentWord.id)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 active:scale-95 transition-all"
              title="Bookmark word"
            >
              <Bookmark
                size={16}
                className={isBookmarked ? 'fill-amber-400 text-amber-400' : ''}
              />
            </button>

            {/* View Full Word Details modal button */}
            <button
              onClick={() => {
                triggerHaptic();
                handleWordSelect?.(currentWord);
              }}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 active:scale-95 transition-all"
              title="View full word details modal"
            >
              <Layers size={16} />
            </button>

            {/* Queue Toggle */}
            <button
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                isQueueOpen
                  ? 'bg-amber-400 text-black border-amber-400 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Toggle Playlist Queue"
            >
              <List size={16} />
              <span className="hidden sm:inline">Queue</span>
            </button>
          </div>
        </div>

        {/* Word Presentation Section (No ID numbers, cleanly displaying Word, Tamil, Definition & Example) */}
        <div className="text-center py-2 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 rounded-full font-semibold">
              {currentWord.pos}
            </span>
          </div>

          <div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-zinc-100 tracking-tight">
              {currentWord.word}
            </h2>
            <p className="text-base sm:text-lg font-tamil text-amber-300 mt-1">
              {currentWord.taWord}
            </p>
          </div>

          {/* Definition and Contextual Example Blocks */}
          <div className="space-y-3 max-w-xl mx-auto text-left pt-1">
            {/* Definition Box */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1">
                  <BookOpen size={11} />
                  Definition
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentWord.definition, undefined, undefined, undefined, speechSpeed);
                  }}
                  className="text-zinc-500 hover:text-cyan-400 transition-colors p-1 rounded-md"
                  title="Listen to definition"
                >
                  <Volume2 size={13} />
                </button>
              </div>
              <p className="text-sm font-sans text-zinc-200 leading-relaxed">
                {currentWord.definition}
              </p>
            </div>

            {/* Example Box */}
            {currentWord.enExample && (
              <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles size={11} />
                    Contextual Example
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(currentWord.enExample, undefined, undefined, undefined, speechSpeed);
                    }}
                    className="text-zinc-500 hover:text-amber-400 transition-colors p-1 rounded-md"
                    title="Listen to example"
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-sans text-zinc-300 italic leading-relaxed">
                  "{currentWord.enExample}"
                </p>
                {currentWord.taExample && (
                  <p className="text-xs font-tamil text-zinc-400 pt-2 border-t border-zinc-800/60 mt-2">
                    {currentWord.taExample}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Explicit View Details Link Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                handleWordSelect?.(currentWord);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-all active:scale-95"
              title="Open full dictionary modal for this word"
            >
              <Layers size={13} />
              <span>View Full Word Details</span>
            </button>
          </div>
        </div>

        {/* Audio Equalizer & Status Indicator */}
        <div className="flex items-center justify-center gap-3 py-1">
          {isSpeakingNow ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
              <AudioEqualizer isPlaying={true} color="cyan" />
              <span>Speaking audio ({speechSpeed}x)...</span>
            </div>
          ) : isPlaying ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Next word in {pauseDuration / 1000}s</span>
            </div>
          ) : (
            <div className="text-xs font-mono text-zinc-500">
              Press Play to start hands-free learning walkman
            </div>
          )}
        </div>

        {/* Playback Controls (Shuffle Mode Toggle, Previous, Play/Pause, Next, Word Details) */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 pt-2">
          {/* Shuffle Mode Toggle */}
          <button
            onClick={toggleShuffleMode}
            className={`p-3 rounded-full border transition-all active:scale-95 flex items-center justify-center ${
              isShuffleMode
                ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20 font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={isShuffleMode ? 'Shuffle Mode: ON (Click to turn OFF)' : 'Shuffle Mode: OFF (Click to turn ON)'}
          >
            <Shuffle size={18} />
          </button>

          {/* Skip Back */}
          <button
            onClick={handlePrevWord}
            className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition-all"
            title="Previous Word"
          >
            <SkipBack size={20} />
          </button>

          {/* Master Play / Pause */}
          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shadow-xl shadow-amber-400/25 active:scale-90 transition-all font-bold"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={28} className="fill-black" /> : <Play size={28} className="fill-black ml-1" />}
          </button>

          {/* Skip Forward */}
          <button
            onClick={handleNextWord}
            className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition-all"
            title="Next Word"
          >
            <SkipForward size={20} />
          </button>

          {/* View Full Word Details */}
          <button
            onClick={() => {
              triggerHaptic();
              handleWordSelect?.(currentWord);
            }}
            className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 active:scale-95 transition-all"
            title="View Full Word Details"
          >
            <Layers size={18} />
          </button>
        </div>

        {/* Quick Settings: Audio Content Mode & Speech Speed */}
        <div className="pt-4 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500">Mode:</span>
            {[
              { id: 'word-def-ex', label: 'Word + Def + Example' },
              { id: 'read-all', label: 'Read All (+ Synonyms)' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => {
                  triggerHaptic();
                  setSpeakMode(m.id as 'word-def-ex' | 'read-all');
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  speakMode === m.id
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 font-bold shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">Speed:</span>
            {[0.8, 0.92, 1.15].map(speed => (
              <button
                key={speed}
                onClick={() => {
                  triggerHaptic();
                  setSpeechSpeed(speed);
                }}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  speechSpeed === speed
                    ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300 font-bold'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {speed === 0.92 ? '1.0x' : `${speed}x`}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Playlist Queue Drawer */}
      <AnimatePresence>
        {isQueueOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-3xl bg-[#111113] border border-zinc-800/80 p-5 shadow-2xl space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-zinc-200">
                Audio Playlist ({playlist.length} Terms)
              </span>
              <span className="text-zinc-500">Click word to play</span>
            </div>

            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1 pr-1">
              {playlist.slice(0, 100).map((w, idx) => {
                const isSelected = idx === currentIndex;
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      triggerHaptic();
                      stopAllAudio();
                      setCurrentIndex(idx);
                      historyStackRef.current.push(idx);
                      if (isPlaying) {
                        playWordAtIndex(idx);
                      }
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 font-bold'
                        : 'bg-zinc-900/40 border-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-zinc-600 w-6">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="font-serif text-sm">{w.word}</span>
                      <span className="text-[10px] font-mono uppercase text-zinc-500">{w.pos}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-tamil text-zinc-400 text-[11px] hidden sm:inline">
                        {w.taWord}
                      </span>
                      {isSelected && isSpeakingNow && (
                        <AudioEqualizer isPlaying={true} color="amber" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
