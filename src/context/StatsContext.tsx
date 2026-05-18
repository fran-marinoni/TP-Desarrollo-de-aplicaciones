// ============================================================
// src/context/StatsContext.tsx
// Global statistics + best scores state
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GameResult, GlobalStats } from '../types';
import {
  loadStats,
  updateStats,
  loadBestScores,
  updateBestScore,
} from '../storage/storageService';

type BestScores = Record<string, number>;

interface StatsContextValue {
  stats: GlobalStats;
  bestScores: BestScores;
  recordResult: (result: GameResult) => Promise<void>;
  refreshStats: () => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_STATS: GlobalStats = {
  totalGamesPlayed: 0,
  totalCorrectAnswers: 0,
  totalIncorrectAnswers: 0,
  bestScore: 0,
  averageAccuracy: 0,
  totalTimePlayed: 0,
  favoriteMode: null,
  favoriteD: null,
};

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<GlobalStats>(DEFAULT_STATS);
  const [bestScores, setBestScores] = useState<BestScores>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshStats = useCallback(async () => {
    const [s, b] = await Promise.all([loadStats(), loadBestScores()]);
    setStats(s);
    setBestScores(b);
  }, []);

  useEffect(() => {
    refreshStats().finally(() => setIsLoading(false));
  }, [refreshStats]);

  const recordResult = useCallback(async (result: GameResult) => {
    const [updatedStats] = await Promise.all([
      updateStats(result),
      updateBestScore(result),
    ]);
    const updatedBest = await loadBestScores();
    setStats(updatedStats);
    setBestScores(updatedBest);
  }, []);

  return (
    <StatsContext.Provider value={{ stats, bestScores, recordResult, refreshStats, isLoading }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats(): StatsContextValue {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error('useStats must be used within StatsProvider');
  return ctx;
}
