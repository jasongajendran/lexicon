import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowDown, ChevronRight, Hash, Compass, Sparkles } from 'lucide-react';
import { LexiconWord } from '../types';

interface VerticalWordScrubberProps {
  words: LexiconWord[];
  activeLetter: string;
  onNavigateToWord: (index: number, word: LexiconWord) => void;
  onSelectLetter?: (letter: string) => void;
}

export function VerticalWordScrubber({
  words,
  activeLetter,
  onNavigateToWord,
  onSelectLetter,
}: VerticalWordScrubberProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeWordIdx, setActiveWordIdx] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastVibratedIdxRef = useRef<number>(-1);

  // Grouping by letter or 2-letter prefix for quick navigation
  const isSpecificLetter = activeLetter !== 'all';

  // Compute prefix milestones or letter milestones
  const milestones = useMemo(() => {
    if (!words || words.length === 0) return [];

    if (isSpecificLetter) {
      // Group by first 2 letters (e.g. Ab, Ac, Ad, Ag, Al, An, Ap, Ar, As, At...)
      const prefixMap = new Map<string, { index: number; word: LexiconWord }>();
      words.forEach((w, idx) => {
        const cleanWord = w.word.trim().replace(/^[^a-zA-Z]+/, '');
        const prefix = cleanWord.slice(0, 2).toUpperCase();
        const displayPrefix = prefix.length >= 2 ? prefix[0] + prefix[1].toLowerCase() : prefix;
        if (!prefixMap.has(displayPrefix)) {
          prefixMap.set(displayPrefix, { index: idx, word: w });
        }
      });

      const entries = Array.from(prefixMap.entries()).map(([prefix, val]) => ({
        label: prefix,
        index: val.index,
        word: val.word,
      }));

      // If too many prefixes (e.g., > 14), sample them evenly while keeping first & last
      if (entries.length > 14) {
        const step = (entries.length - 1) / 11;
        const sampled = [entries[0]];
        for (let i = 1; i < 11; i++) {
          sampled.push(entries[Math.round(i * step)]);
        }
        sampled.push(entries[entries.length - 1]);
        // Deduplicate
        return Array.from(new Set(sampled));
      }

      return entries;
    } else {
      // 'all' mode: group by starting letter A-Z
      const letterMap = new Map<string, { index: number; word: LexiconWord }>();
      words.forEach((w, idx) => {
        const firstLetter = w.word.trim()[0]?.toUpperCase() || '#';
        if (!letterMap.has(firstLetter)) {
          letterMap.set(firstLetter, { index: idx, word: w });
        }
      });

      return Array.from(letterMap.entries()).map(([letter, val]) => ({
        label: letter,
        index: val.index,
        word: val.word,
      }));
    }
  }, [words, isSpecificLetter]);

  const triggerHaptic = (idx?: number) => {
    if (idx !== undefined && idx === lastVibratedIdxRef.current) return;
    if (idx !== undefined) lastVibratedIdxRef.current = idx;

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(6);
      } catch (e) {
        // ignore
      }
    }
  };

  // Calculate target word from Y coordinate on scrubber track
  const handleScrubAtY = useCallback(
    (clientY: number) => {
      if (!trackRef.current || words.length === 0) return;
      const rect = trackRef.current.getBoundingClientRect();
      const relativeY = Math.max(0, Math.min(clientY - rect.top, rect.height));
      const percentage = rect.height > 0 ? relativeY / rect.height : 0;
      const targetIdx = Math.min(
        Math.floor(percentage * words.length),
        words.length - 1
      );

      setActiveWordIdx(targetIdx);
      setHoveredIdx(targetIdx);
      triggerHaptic(targetIdx);

      const targetWord = words[targetIdx];
      if (targetWord) {
        onNavigateToWord(targetIdx, targetWord);
      }
    },
    [words, onNavigateToWord]
  );

  // Drag listeners
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();
      handleScrubAtY(e.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setTimeout(() => setHoveredIdx(null), 1000);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, handleScrubAtY]);

  // Window scroll sync: detect active word in viewport
  useEffect(() => {
    if (isDragging) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!words || words.length === 0) return;
          const scrollPos = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const scrollFraction = Math.max(0, Math.min(scrollPos / docHeight, 1));
            const calculatedIdx = Math.min(
              Math.floor(scrollFraction * words.length),
              words.length - 1
            );
            setActiveWordIdx(calculatedIdx);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [words, isDragging]);

  if (!words || words.length <= 1) return null;

  const currentPreviewWord =
    hoveredIdx !== null && words[hoveredIdx]
      ? words[hoveredIdx]
      : words[activeWordIdx] || words[0];

  const currentPercent =
    words.length > 1 ? (activeWordIdx / (words.length - 1)) * 100 : 0;

  return (
    <div
      className="fixed right-1 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-40 select-none flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isDragging) setHoveredIdx(null);
      }}
    >
      {/* Floating HUD Preview Card on hover/drag */}
      <AnimatePresence>
        {(isDragging || (isHovered && hoveredIdx !== null)) && currentPreviewWord && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-12 sm:right-14 pointer-events-none w-64 sm:w-72 p-3.5 rounded-2xl bg-zinc-950/95 border border-amber-400/40 shadow-2xl shadow-black/80 backdrop-blur-xl text-zinc-100"
          >
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                    {isSpecificLetter ? `Series ${activeLetter}` : 'Lexicon'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    #{(hoveredIdx !== null ? hoveredIdx + 1 : activeWordIdx + 1)
                      .toString()
                      .padStart(2, '0')}{' '}
                    / {words.length}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-400/10 px-1.5 py-0.5 rounded border border-purple-400/20 uppercase">
                  {currentPreviewWord.pos}
                </span>
              </div>

              <div>
                <h4 className="text-base font-serif italic font-bold text-amber-400 truncate leading-snug">
                  {currentPreviewWord.word}
                </h4>
                <p className="text-xs font-tamil text-zinc-300 truncate">
                  {currentPreviewWord.taWord}
                </p>
              </div>

              <p className="text-[11px] font-sans text-zinc-400 line-clamp-2 leading-relaxed">
                {currentPreviewWord.definition}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Scrubber Pillar Container */}
      <div className="relative flex flex-col items-center py-2 px-1 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/90 shadow-2xl shadow-black/80 transition-all hover:border-amber-400/50 hover:bg-zinc-900/95">
        {/* Top Header: Current Letter / Quick Jump to Top */}
        <button
          onClick={() => {
            triggerHaptic(0);
            onNavigateToWord(0, words[0]);
          }}
          className="p-1 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/80 transition-all mb-1"
          title="Scroll to first word (Top)"
        >
          <ArrowUp size={12} />
        </button>

        {/* Current Letter Badge */}
        <div className="w-6 h-6 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center mb-1.5 shadow-sm">
          {isSpecificLetter ? activeLetter : <Compass size={11} />}
        </div>

        {/* Vertical Track Area */}
        <div
          ref={trackRef}
          onPointerDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
            handleScrubAtY(e.clientY);
          }}
          className="relative flex flex-col items-center justify-between w-6 sm:w-7 h-[280px] sm:h-[340px] md:h-[380px] cursor-ns-resize py-1 touch-none group"
        >
          {/* Vertical Track Line */}
          <div className="absolute top-1 bottom-1 w-0.5 bg-zinc-800/90 rounded-full left-1/2 -translate-x-1/2 group-hover:bg-zinc-700/80 transition-colors" />

          {/* Active progress fill */}
          <div
            className="absolute top-1 w-0.5 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full left-1/2 -translate-x-1/2 transition-all duration-75"
            style={{ height: `${currentPercent}%` }}
          />

          {/* Dynamic Draggable Thumb Handle */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 -ml-0.5 rounded-full bg-amber-400 border-2 border-zinc-950 shadow-md shadow-amber-400/40 pointer-events-none transition-all duration-75 flex items-center justify-center"
            style={{ top: `calc(${currentPercent}% - 8px)` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
          </div>

          {/* Milestones / Prefix Nodes along the track */}
          {milestones.map((m, idx) => {
            const isNodeActive =
              activeWordIdx >= m.index &&
              (idx === milestones.length - 1 || activeWordIdx < milestones[idx + 1].index);

            return (
              <button
                key={`${m.label}-${idx}`}
                type="button"
                onMouseEnter={() => {
                  setHoveredIdx(m.index);
                  triggerHaptic(m.index);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic(m.index);
                  onNavigateToWord(m.index, m.word);
                }}
                className={`relative z-10 flex items-center justify-center transition-all duration-150 ${
                  isNodeActive
                    ? 'text-amber-300 font-bold scale-110'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
                title={`Jump to ${m.label} (${m.word.word})`}
              >
                {isSpecificLetter ? (
                  /* 2-Letter Prefix text or dot */
                  <span
                    className={`text-[9px] font-mono tracking-tighter leading-none px-0.5 rounded ${
                      isNodeActive
                        ? 'bg-amber-400/25 text-amber-300 font-bold border border-amber-400/40'
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    {m.label}
                  </span>
                ) : (
                  /* Letter badge */
                  <span
                    className={`text-[10px] font-mono leading-none ${
                      isNodeActive ? 'text-amber-400 font-bold' : ''
                    }`}
                  >
                    {m.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Total count badge */}
        <div className="mt-1.5 pt-1 border-t border-zinc-800/80 text-[8px] font-mono text-zinc-500 text-center">
          {words.length}w
        </div>

        {/* Bottom Navigation Button: Scroll to End of series */}
        <button
          onClick={() => {
            const lastIdx = words.length - 1;
            triggerHaptic(lastIdx);
            onNavigateToWord(lastIdx, words[lastIdx]);
          }}
          className="p-1 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/80 transition-all mt-1"
          title="Scroll to last word (Bottom)"
        >
          <ArrowDown size={12} />
        </button>
      </div>
    </div>
  );
}
