// ============================================================
// src/hooks/useStatistics.ts
// Hook for reading and refreshing statistics from context
// ============================================================

import { useCallback } from 'react';
import { useStats } from '../context/StatsContext';
import { DIFFICULTY_LABELS, GAME_MODE_LABELS } from '../constants/game';

export function useStatistics() {
  const { stats, bestScores, recordResult, refreshStats, isLoading } = useStats();

  const getBestScoreForMode = useCallback(
    (mode: string, difficulty: string): number => {
      return bestScores[`${mode}_${difficulty}`] ?? 0;
    },
    [bestScores]
  );

  const formattedFavoriteMode = stats.favoriteMode
    ? GAME_MODE_LABELS[stats.favoriteMode]
    : '—';

  const formattedFavoriteDifficulty = stats.favoriteD
    ? DIFFICULTY_LABELS[stats.favoriteD]
    : '—';

  return {
    stats,
    bestScores,
    getBestScoreForMode,
    formattedFavoriteMode,
    formattedFavoriteDifficulty,
    recordResult,
    refreshStats,
    isLoading,
  };
}
