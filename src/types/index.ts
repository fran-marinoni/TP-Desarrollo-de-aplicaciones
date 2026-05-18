// ============================================================
// src/types/index.ts
// Central type definitions for the entire application
// ============================================================

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'trueFalse' | 'multipleChoice' | 'timeAttack';
export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type AnswerSpeed = 'fast' | 'normal' | 'timeout';

// ── Operation ────────────────────────────────────────────────
export interface Operation {
  id: string;
  expression: string; // e.g. "12 + 7"
  operandA: number;
  operandB: number;
  operator: OperationType;
  correctAnswer: number;
  /** Only used in trueFalse mode */
  displayedAnswer?: number;
  /** Only used in multipleChoice mode */
  choices?: number[];
}

// ── Game Config ───────────────────────────────────────────────
export interface GameConfig {
  difficulty: Difficulty;
  iterations: number;       // questions per round
  timePerOperation: number; // seconds
  gameMode: GameMode;
}

// ── Round Answer ─────────────────────────────────────────────
export interface RoundAnswer {
  operationId: string;
  expression: string;
  correctAnswer: number;
  givenAnswer: number | null;
  isCorrect: boolean;
  responseTimeMs: number;
  pointsAwarded: number;
  speed: AnswerSpeed;
}

// ── Game Result (persisted) ───────────────────────────────────
export interface GameResult {
  id: string;
  date: string;             // ISO string
  difficulty: Difficulty;
  gameMode: GameMode;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  accuracy: number;         // 0-100
  averageResponseTimeMs: number;
  answers: RoundAnswer[];
}

// ── Global Stats ──────────────────────────────────────────────
export interface GlobalStats {
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  bestScore: number;
  averageAccuracy: number;
  totalTimePlayed: number; // ms
  favoriteMode: GameMode | null;
  favoriteD: Difficulty | null;
}

// ── Navigation Params ─────────────────────────────────────────
export type RootStackParamList = {
  Home: undefined;
  Config: undefined;
  Game: { config: GameConfig };
  Results: { result: GameResult };
  History: undefined;
};
