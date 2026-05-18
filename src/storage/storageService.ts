// ============================================================
// src/storage/storageService.ts
// Centralized AsyncStorage layer — all persistence goes here
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameConfig, GameResult, GlobalStats } from '../types';
import {
  STORAGE_KEYS,
  DEFAULT_CONFIG,
  MAX_HISTORY_ENTRIES,
} from '../constants/game';

// ── Helpers ───────────────────────────────────────────────────
async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// ── Game Config ───────────────────────────────────────────────
export async function loadConfig(): Promise<GameConfig> {
  return getItem<GameConfig>(STORAGE_KEYS.GAME_CONFIG, DEFAULT_CONFIG);
}

export async function saveConfig(config: GameConfig): Promise<void> {
  await setItem(STORAGE_KEYS.GAME_CONFIG, config);
}

// ── Game History ──────────────────────────────────────────────
export async function loadHistory(): Promise<GameResult[]> {
  return getItem<GameResult[]>(STORAGE_KEYS.GAME_HISTORY, []);
}

export async function saveGameResult(result: GameResult): Promise<void> {
  const history = await loadHistory();
  // Prepend newest, cap at max entries
  const updated = [result, ...history].slice(0, MAX_HISTORY_ENTRIES);
  await setItem(STORAGE_KEYS.GAME_HISTORY, updated);
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);
}

// ── Global Statistics ─────────────────────────────────────────
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

export async function loadStats(): Promise<GlobalStats> {
  return getItem<GlobalStats>(STORAGE_KEYS.GLOBAL_STATS, DEFAULT_STATS);
}

export async function updateStats(result: GameResult): Promise<GlobalStats> {
  const current = await loadStats();

  const newTotal = current.totalGamesPlayed + 1;
  const newCorrect = current.totalCorrectAnswers + result.correctAnswers;
  const newIncorrect = current.totalIncorrectAnswers + result.incorrectAnswers;
  const newBest = Math.max(current.bestScore, result.score);

  // Rolling average accuracy
  const newAvgAccuracy =
    (current.averageAccuracy * current.totalGamesPlayed + result.accuracy) /
    newTotal;

  const newTimePlayed =
    current.totalTimePlayed +
    result.answers.reduce((sum, a) => sum + a.responseTimeMs, 0);

  const updated: GlobalStats = {
    totalGamesPlayed: newTotal,
    totalCorrectAnswers: newCorrect,
    totalIncorrectAnswers: newIncorrect,
    bestScore: newBest,
    averageAccuracy: Math.round(newAvgAccuracy * 10) / 10,
    totalTimePlayed: newTimePlayed,
    favoriteMode: result.gameMode,  // simplified: last played
    favoriteD: result.difficulty,
  };

  await setItem(STORAGE_KEYS.GLOBAL_STATS, updated);
  return updated;
}

// ── Best Scores (per mode + difficulty) ───────────────────────
type BestScoreKey = string; // e.g. "classic_medium"
type BestScores = Record<BestScoreKey, number>;

export async function loadBestScores(): Promise<BestScores> {
  return getItem<BestScores>(STORAGE_KEYS.BEST_SCORES, {});
}

export async function updateBestScore(
  result: GameResult
): Promise<number> {
  const key: BestScoreKey = `${result.gameMode}_${result.difficulty}`;
  const scores = await loadBestScores();
  const prev = scores[key] ?? 0;
  if (result.score > prev) {
    scores[key] = result.score;
    await setItem(STORAGE_KEYS.BEST_SCORES, scores);
  }
  return Math.max(prev, result.score);
}

// ── Full reset ────────────────────────────────────────────────
export async function resetAllData(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.GAME_HISTORY),
    AsyncStorage.removeItem(STORAGE_KEYS.GLOBAL_STATS),
    AsyncStorage.removeItem(STORAGE_KEYS.BEST_SCORES),
  ]);
}
