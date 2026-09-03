import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '⌘ K  /  Ctrl K', label: 'Quick Focus Search' },
  { key: 'D', label: 'Toggle Distraction-Free Mode' },
  { key: 'Z', label: 'Toggle Random Shuffle Order' },
  { key: 'R', label: 'Surprise / Random Term' },
  { key: 'Space', label: 'Flip Card (In Study Flashcard Mode)' },
  { key: 'S', label: 'Toggle Feed / Study Mode' },
  { key: 'B', label: 'Toggle Bookmarked Filter' },
  { key: 'Esc', label: 'Close Modals' },
  { key: '?', label: 'Open Keyboard Shortcuts' },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl text-zinc-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                <Keyboard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-serif italic text-zinc-100">Keyboard Shortcuts</h3>
                <p className="text-xs font-mono text-zinc-400">Power-user navigation controls</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* List of Shortcuts */}
          <div className="space-y-3">
            {SHORTCUTS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 text-sm font-sans"
              >
                <span className="text-zinc-300">{item.label}</span>
                <kbd className="px-2.5 py-1 text-xs font-mono bg-zinc-800 border border-zinc-700/80 rounded-lg text-amber-400 font-semibold shadow-inner">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>

          {/* Footer Close Button - Centered */}
          <div className="mt-6 pt-4 border-t border-zinc-800/60 flex flex-col items-center gap-3">
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <X size={16} strokeWidth={2.5} />
              <span>CLOSE</span>
            </button>
            <p className="text-[11px] font-mono text-zinc-500">
              Press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-amber-400 font-semibold">?</kbd> anytime to open this guide.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
