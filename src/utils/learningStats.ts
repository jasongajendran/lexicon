// Learning statistics & streak tracker with local persistence

export interface LearningStats {
  streak: number;
  streakDays?: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoal: number; // e.g. 20 words
  todayReviewedIds: number[];
  todayLearnedCount?: number;
  masteredIds: number[];
  quizHighScore: number;
  quizzesCompleted: number;
  totalQuizCorrect: number;
  totalQuizAnswered: number;
}

const STATS_KEY = 'lexicon-learning-stats';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadLearningStats(): LearningStats {
  const defaultStats: LearningStats = {
    streak: 1,
    lastActiveDate: getTodayString(),
    dailyGoal: 20,
    todayReviewedIds: [],
    masteredIds: [],
    quizHighScore: 0,
    quizzesCompleted: 0,
    totalQuizCorrect: 0,
    totalQuizAnswered: 0
  };

  if (typeof window === 'undefined') return defaultStats;

  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      saveLearningStats(defaultStats);
      return defaultStats;
    }

    const parsed: LearningStats = JSON.parse(raw);
    const today = getTodayString();

    // Check streak logic
    if (parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        parsed.streak = (parsed.streak || 0) + 1;
      } else if (diffDays > 1) {
        // Missed a day
        parsed.streak = 1;
      }

      parsed.lastActiveDate = today;
      parsed.todayReviewedIds = []; // reset daily reviewed
      saveLearningStats(parsed);
    }

    parsed.streakDays = parsed.streak;
    parsed.todayLearnedCount = parsed.todayReviewedIds?.length || 0;
    return parsed;
  } catch (e) {
    defaultStats.streakDays = defaultStats.streak;
    defaultStats.todayLearnedCount = defaultStats.todayReviewedIds?.length || 0;
    return defaultStats;
  }
}

export function getLearningStats(): LearningStats {
  return loadLearningStats();
}

export function saveLearningStats(stats: LearningStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    // ignore
  }
}

export function recordWordReviewed(wordId: number): LearningStats {
  const stats = loadLearningStats();
  if (!stats.todayReviewedIds.includes(wordId)) {
    stats.todayReviewedIds.push(wordId);
    stats.todayLearnedCount = stats.todayReviewedIds.length;
    saveLearningStats(stats);
  }
  return stats;
}

export const recordWordLearned = recordWordReviewed;

export function toggleWordMastered(wordId: number): { stats: LearningStats; isMastered: boolean } {
  const stats = loadLearningStats();
  const index = stats.masteredIds.indexOf(wordId);
  let isMastered = false;
  if (index >= 0) {
    stats.masteredIds.splice(index, 1);
    isMastered = false;
  } else {
    stats.masteredIds.push(wordId);
    isMastered = true;
    if (!stats.todayReviewedIds.includes(wordId)) {
      stats.todayReviewedIds.push(wordId);
    }
  }
  saveLearningStats(stats);
  return { stats, isMastered };
}

export function recordQuizCompletion(correctCount: number, totalQuestions: number): LearningStats {
  const stats = loadLearningStats();
  stats.quizzesCompleted = (stats.quizzesCompleted || 0) + 1;
  stats.totalQuizCorrect = (stats.totalQuizCorrect || 0) + correctCount;
  stats.totalQuizAnswered = (stats.totalQuizAnswered || 0) + totalQuestions;

  const scorePct = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);
  if (scorePct > (stats.quizHighScore || 0)) {
    stats.quizHighScore = scorePct;
  }

  saveLearningStats(stats);
  return stats;
}
