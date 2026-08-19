import React from 'react';
import { motion } from 'motion/react';

interface AudioEqualizerProps {
  isPlaying: boolean;
  className?: string;
}

export function AudioEqualizer({ isPlaying, className = '' }: AudioEqualizerProps) {
  if (!isPlaying) return null;

  return (
    <div className={`flex items-end gap-0.5 h-3.5 px-0.5 ${className}`}>
      <motion.span
        animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
        className="w-0.5 bg-current rounded-full"
      />
      <motion.span
        animate={{ height: ['60%', '20%', '100%', '30%', '60%'] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
        className="w-0.5 bg-current rounded-full"
      />
      <motion.span
        animate={{ height: ['30%', '80%', '20%', '100%', '30%'] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut', delay: 0.2 }}
        className="w-0.5 bg-current rounded-full"
      />
      <motion.span
        animate={{ height: ['80%', '30%', '70%', '10%', '80%'] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut', delay: 0.15 }}
        className="w-0.5 bg-current rounded-full"
      />
    </div>
  );
}
