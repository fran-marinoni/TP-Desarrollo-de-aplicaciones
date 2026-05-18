// ============================================================
// src/constants/game.ts
// Game-wide configuration constants
// ============================================================

import { Difficulty, GameMode, OperationType } from '../types';

// ── Score values ──────────────────────────────────────────────
export const SCORE_VALUES = {
  FAST_CORRECT: 100,      // answered in < 75% of time limit
  NORMAL_CORRECT: 70,     // answered in >= 75% of time limit
  INCORRECT: -30,
  UNANSWERED: -50,
} as const;

// ── Fast answer threshold (75% of time limit) ─────────────────
export const FAST_ANSWER_THRESHOLD = 0.75;

// ── Default config ────────────────────────────────────────────
export const DEFAULT_CONFIG = {
  difficulty: 'medium' as Difficulty,
  iterations: 10,
  timePerOperation: 15,
  gameMode: 'classic' as GameMode,
};

// ── Time per operation (seconds) by difficulty ────────────────
export const TIME_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 20,
  medium: 15,
  hard: 8,
};

// ── Iterations options ────────────────────────────────────────
export const ITERATIONS_OPTIONS = [5, 10, 15, 20] as const;

// ── Difficulty labels ─────────────────────────────────────────
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
};

// ── Game mode labels ──────────────────────────────────────────
export const GAME_MODE_LABELS: Record<GameMode, string> = {
  classic: 'Clásico',
  trueFalse: 'Verdadero / Falso',
  multipleChoice: 'Múltiple Opción',
  timeAttack: 'Contra el Reloj',
};

// ── Game mode descriptions ────────────────────────────────────
export const GAME_MODE_DESCRIPTIONS: Record<GameMode, string> = {
  classic: 'Escribe el resultado correcto.',
  trueFalse: 'Indica si el resultado es verdadero o falso.',
  multipleChoice: 'Elige una de las 4 opciones.',
  timeAttack: 'Responde operaciones continuas hasta agotar el tiempo.',
};

// ── Allowed operations by difficulty ─────────────────────────
export const OPERATIONS_BY_DIFFICULTY: Record<Difficulty, OperationType[]> = {
  easy: ['addition', 'subtraction'],
  medium: ['addition', 'subtraction', 'multiplication'],
  hard: ['addition', 'subtraction', 'multiplication', 'division'],
};

// ── Number ranges by difficulty ───────────────────────────────
export const NUMBER_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 20 },
  medium: { min: 2, max: 50 },
  hard: { min: 5, max: 99 },
};

// ── Operator symbols ──────────────────────────────────────────
export const OPERATOR_SYMBOLS: Record<OperationType, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

// ── Multiple choice: number of wrong distractors ──────────────
export const MULTIPLE_CHOICE_COUNT = 4;

// ── AsyncStorage keys ────────────────────────────────────────
export const STORAGE_KEYS = {
  GAME_CONFIG: '@MentalCalc:gameConfig',
  GAME_HISTORY: '@MentalCalc:gameHistory',
  GLOBAL_STATS: '@MentalCalc:globalStats',
  BEST_SCORES: '@MentalCalc:bestScores',
} as const;

// ── Max history entries to persist ───────────────────────────
export const MAX_HISTORY_ENTRIES = 100;

// ── Time attack: total time in seconds ───────────────────────
export const TIME_ATTACK_TOTAL_SECONDS: Record<Difficulty, number> = {
  easy: 90,
  medium: 60,
  hard: 45,
};
