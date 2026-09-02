import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Zap,
  Flame,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Bookmark,
  Shuffle,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import { LexiconWord } from '../types';
import { speakWord } from '../utils/speech';
import { AudioEqualizer } from './AudioEqualizer';
import { recordQuizCompletion } from '../utils/learningStats';

export type QuizType = 'definition' | 'tamil' | 'cloze' | 'synonym';

interface QuizQuestion {
  word: LexiconWord;
  type: QuizType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  contextSentence?: string;
}

interface QuizArenaProps {
  words: LexiconWord[];
  bookmarkedIds: number[];
  onToggleBookmark: (id: number) => void;
  onSelectWordModal?: (word: LexiconWord) => void;
  onSelectWord?: (word: LexiconWord) => void;
  onExit?: () => void;
}

export function QuizArena({
  words,
  bookmarkedIds,
  onToggleBookmark,
  onSelectWordModal,
  onSelectWord,
  onExit
}: QuizArenaProps) {
  const handleWordSelect = onSelectWord || onSelectWordModal;
  const [quizType, setQuizType] = useState<QuizType>('definition');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [deckSource, setDeckSource] = useState<'current' | 'saved'>('current');
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'completed'>('setup');

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [missedQuestions, setMissedQuestions] = useState<{ question: QuizQuestion; userAnswer: string }[]>([]);
  const [speakingTarget, setSpeakingTarget] = useState<'word' | null>(null);

  const availablePool = useMemo(() => {
    if (deckSource === 'saved') {
      const saved = words.filter(w => bookmarkedIds.includes(w.id));
      return saved.length >= 4 ? saved : words;
    }
    return words;
  }, [words, deckSource, bookmarkedIds]);

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();

    if (speakingTarget === 'word') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingTarget(null);
      return;
    }

    speakWord(
      text,
      () => setSpeakingTarget('word'),
      () => setSpeakingTarget(null),
      () => setSpeakingTarget(null)
    );
  };

  // Generate question list
  const startQuiz = useCallback(() => {
    if (availablePool.length < 4) return;

    // Shuffle pool
    const shuffledPool = [...availablePool].sort(() => Math.random() - 0.5);
    const targetWords = shuffledPool.slice(0, Math.min(questionCount, shuffledPool.length));

    const generatedQuestions: QuizQuestion[] = targetWords.map((word) => {
      // Pick 3 distractors
      const distractors = availablePool
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (quizType === 'definition') {
        const correct = word.definition;
        const distractorDefs = distractors.map(d => d.definition);
        const options = [correct, ...distractorDefs].sort(() => Math.random() - 0.5);
        return {
          word,
          type: 'definition',
          prompt: `Select the precise definition for:`,
          options,
          correctAnswer: correct
        };
      } else if (quizType === 'tamil') {
        const correct = word.taWord;
        const distractorTa = distractors.map(d => d.taWord);
        const options = [correct, ...distractorTa].sort(() => Math.random() - 0.5);
        return {
          word,
          type: 'tamil',
          prompt: `Select the accurate Tamil meaning for:`,
          options,
          correctAnswer: correct
        };
      } else if (quizType === 'cloze') {
        const sentence = word.enExample || `${word.word} is crucial in software engineering.`;
        // Replace target word with blank
        const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
        const blanked = sentence.replace(regex, '________');
        const correct = word.word;
        const distractorWords = distractors.map(d => d.word);
        const options = [correct, ...distractorWords].sort(() => Math.random() - 0.5);
        return {
          word,
          type: 'cloze',
          prompt: `Fill in the blank with the appropriate vocabulary term:`,
          options,
          correctAnswer: correct,
          contextSentence: blanked
        };
      } else {
        // Synonym quiz
        const hasSynonym = word.synonyms && word.synonyms.length > 0;
        const correct = hasSynonym ? word.synonyms![0] : word.word;
        const distractorSyns = distractors.map(d => (d.synonyms && d.synonyms.length > 0 ? d.synonyms[0] : d.word));
        const options = [correct, ...distractorSyns].sort(() => Math.random() - 0.5);
        return {
          word,
          type: 'synonym',
          prompt: `Select the closest synonym for:`,
          options,
          correctAnswer: correct
        };
      }
    });

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMissedQuestions([]);
    setGameState('playing');
  }, [availablePool, questionCount, quizType]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    const currentQ = questions[currentIndex];
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      triggerHaptic(20);
      setScore(s => s + 1);
      setStreak(curr => {
        const next = curr + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      triggerHaptic(60);
      setStreak(0);
      setMissedQuestions(prev => [...prev, { question: currentQ, userAnswer: option }]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed!
      recordQuizCompletion(score, questions.length);
      setGameState('completed');
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-6">
      <AnimatePresence mode="wait">
        {/* SETUP SCREEN */}
        {gameState === 'setup' && (
          <motion.div
            key="setup-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="rounded-3xl bg-[#111113] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20">
                <Trophy size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <span>Quiz Arena</span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    Active Recall
                  </span>
                </h2>
                <p className="text-xs sm:text-sm font-sans text-zinc-400">
                  Sharpen your vocabulary retention with quick-fire multiple choice challenges and instant explanations.
                </p>
              </div>
            </div>

            {/* Quiz Mode Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                1. Select Challenge Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'definition' as QuizType,
                    title: 'Definition Match',
                    desc: 'Identify the exact dictionary meaning of the term'
                  },
                  {
                    id: 'tamil' as QuizType,
                    title: 'Tamil Meaning',
                    desc: 'Select the precise Tamil translation and nuance'
                  },
                  {
                    id: 'cloze' as QuizType,
                    title: 'Sentence Cloze',
                    desc: 'Fill in the blank in real-world engineering sentences'
                  },
                  {
                    id: 'synonym' as QuizType,
                    title: 'Synonym Blitz',
                    desc: 'Choose the closest synonym or replacement term'
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setQuizType(mode.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      quizType === mode.id
                        ? 'bg-amber-400/10 border-amber-400/50 text-white shadow-lg shadow-amber-400/5'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {quizType === mode.id && (
                      <div className="absolute top-0 right-0 w-2 h-full bg-amber-400" />
                    )}
                    <div className="text-sm font-semibold mb-1 text-zinc-100 flex items-center justify-between">
                      <span>{mode.title}</span>
                      {quizType === mode.id && <Sparkles size={14} className="text-amber-400" />}
                    </div>
                    <p className="text-xs font-sans text-zinc-400 leading-relaxed">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions count & Pool options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  2. Question Count
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                        questionCount === num
                          ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  3. Question Pool
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeckSource('current')}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      deckSource === 'current'
                        ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    All ({words.length})
                  </button>
                  <button
                    onClick={() => setDeckSource('saved')}
                    disabled={bookmarkedIds.length < 4}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      deckSource === 'saved'
                        ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20'
                        : bookmarkedIds.length >= 4
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        : 'bg-zinc-900/40 border-zinc-800/40 text-zinc-600 cursor-not-allowed opacity-50'
                    }`}
                    title={bookmarkedIds.length < 4 ? 'Save at least 4 words to quiz on bookmarks' : ''}
                  >
                    <Bookmark size={12} className={deckSource === 'saved' ? 'fill-black' : ''} />
                    <span>Saved ({bookmarkedIds.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">
                Ready with {Math.min(questionCount, availablePool.length)} questions
              </span>
              <button
                onClick={startQuiz}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
              >
                <Zap size={16} className="fill-black" />
                <span>Start Challenge</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && currentQ && (
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl bg-[#111113] border border-zinc-800/90 p-5 sm:p-7 shadow-2xl space-y-6"
          >
            {/* Top Status Bar: Progress, Question #, Streak, Score */}
            <div className="flex items-center justify-between gap-3 text-xs font-mono border-b border-zinc-800/60 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">
                  Question <span className="text-amber-400 font-bold">{currentIndex + 1}</span> of {questions.length}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                  Score: {score}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {streak > 1 && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full"
                  >
                    <Flame size={13} className="fill-amber-400 text-amber-400 animate-bounce" />
                    <span>{streak} Streak!</span>
                  </motion.div>
                )}

                <button
                  onClick={() => setGameState('setup')}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  title="Quit Quiz"
                >
                  Quit
                </button>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Prompt & Target Word Header */}
            <div className="space-y-2 text-center py-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                {currentQ.prompt}
              </span>

              {currentQ.type !== 'cloze' ? (
                <div className="flex items-center justify-center gap-3 pt-1">
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100 tracking-tight">
                    {currentQ.word.word}
                  </h3>
                  <button
                    onClick={(e) => handleSpeak(currentQ.word.word, e)}
                    className={`p-2 rounded-xl transition-all border ${
                      speakingTarget === 'word'
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40'
                    }`}
                    title="Pronounce word"
                  >
                    {speakingTarget === 'word' ? (
                      <AudioEqualizer isPlaying={true} color="black" />
                    ) : (
                      <Volume2 size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => onToggleBookmark(currentQ.word.id)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-all"
                    title="Bookmark word"
                  >
                    <Bookmark
                      size={18}
                      className={bookmarkedIds.includes(currentQ.word.id) ? 'fill-amber-400 text-amber-400' : ''}
                    />
                  </button>
                </div>
              ) : (
                /* Cloze sentence preview */
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-200 font-sans text-sm sm:text-base leading-relaxed text-center">
                  "{currentQ.contextSentence}"
                </div>
              )}

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                  {currentQ.word.pos}
                </span>
                {currentQ.type === 'definition' && (
                  <span className="text-[11px] font-tamil text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    {currentQ.word.taWord}
                  </span>
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQ.correctAnswer;
                const showCorrect = isAnswered && isCorrect;
                const showIncorrect = isAnswered && isSelected && !isCorrect;

                let btnStyles = 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-200';
                if (showCorrect) {
                  btnStyles = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-semibold shadow-lg shadow-emerald-500/10';
                } else if (showIncorrect) {
                  btnStyles = 'bg-red-500/20 border-red-500 text-red-200 font-semibold shadow-lg shadow-red-500/10';
                } else if (isAnswered) {
                  btnStyles = 'bg-zinc-900/40 border-zinc-800/50 text-zinc-600 opacity-60';
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 group relative overflow-hidden ${btnStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                        showCorrect
                          ? 'bg-emerald-400 text-black'
                          : showIncorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-sans text-xs sm:text-sm leading-relaxed text-zinc-100">
                        {option}
                      </span>
                    </div>

                    {showCorrect && <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />}
                    {showIncorrect && <XCircle size={20} className="text-red-400 shrink-0" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Answer Explanation & Next Question Button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2 overflow-hidden"
                >
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                      <span>EXPLANATION</span>
                      <button
                        onClick={() => onSelectWordModal(currentQ.word)}
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Full Word Card</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                    <p className="text-zinc-200">
                      <strong className="text-amber-400">{currentQ.word.word}</strong>: {currentQ.word.definition}
                    </p>
                    <p className="text-zinc-400 font-tamil leading-relaxed">
                      {currentQ.word.taWord} — {currentQ.word.taExample}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
                    >
                      <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Complete Challenge'}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* COMPLETED / SUMMARY SCREEN */}
        {gameState === 'completed' && (
          <motion.div
            key="completed-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl bg-[#111113] border border-zinc-800/90 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            {/* Header Trophy Banner */}
            <div className="text-center space-y-2 py-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-black mx-auto flex items-center justify-center shadow-xl shadow-amber-400/25 mb-3 animate-bounce">
                <Award size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                Challenge Complete!
              </h2>
              <p className="text-xs sm:text-sm font-sans text-zinc-400">
                You've successfully tested your active recall memory across {questions.length} vocabulary challenges.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Score</span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {score} / {questions.length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Accuracy</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {Math.round((score / questions.length) * 100)}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Best Streak</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 flex items-center justify-center gap-1">
                  <Flame size={18} className="fill-emerald-400" />
                  <span>{maxStreak}</span>
                </span>
              </div>
            </div>

            {/* Missed words list (Review) */}
            {missedQuestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="uppercase tracking-wider font-semibold text-zinc-300">
                    Review Missed Terms ({missedQuestions.length})
                  </span>
                  <span className="text-zinc-500">Save for extra review</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
                  {missedQuestions.map(({ question }, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-amber-400 text-sm">
                            {question.word.word}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">
                            {question.word.pos}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] line-clamp-1">{question.word.definition}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onToggleBookmark(question.word.id)}
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
                          title="Bookmark term"
                        >
                          <Bookmark
                            size={14}
                            className={bookmarkedIds.includes(question.word.id) ? 'fill-amber-400 text-amber-400' : ''}
                          />
                        </button>
                        <button
                          onClick={() => handleWordSelect?.(question.word)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-zinc-800/60">
              <button
                onClick={startQuiz}
                className="w-full sm:flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
              >
                <RotateCcw size={15} />
                <span>Play Again</span>
              </button>
              <button
                onClick={() => setGameState('setup')}
                className="w-full sm:flex-1 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Shuffle size={14} />
                <span>Change Format</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
