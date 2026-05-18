// ============================================================
// src/utils/scoreCalculator.ts
// Pure scoring logic — no side-effects, fully testable
// ============================================================

import { AnswerSpeed, RoundAnswer } from '../types';
import { SCORE_VALUES, FAST_ANSWER_THRESHOLD } from '../constants/game';

/**
 * Determines answer speed based on elapsed vs allowed time.
 * @param elapsedMs - time the player took in milliseconds
 * @param timeLimitMs - maximum allowed time in milliseconds
 */
export function determineAnswerSpeed(
  elapsedMs: number,
  timeLimitMs: number
): AnswerSpeed {
  if (elapsedMs <= 0 || timeLimitMs <= 0) return 'normal';
  const ratio = elapsedMs / timeLimitMs;
  if (ratio < FAST_ANSWER_THRESHOLD) return 'fast';
  return 'normal';
}

/**
 * Calculates points for a single answer.
 */
export function calculatePoints(
  isCorrect: boolean,
  answered: boolean,
  speed: AnswerSpeed
): number {
  if (!answered) return SCORE_VALUES.UNANSWERED;
  if (!isCorrect) return SCORE_VALUES.INCORRECT;
  return speed === 'fast' ? SCORE_VALUES.FAST_CORRECT : SCORE_VALUES.NORMAL_CORRECT;
}

/**
 * Builds a complete RoundAnswer record.
 */
export function buildRoundAnswer(params: {
  operationId: string;
  expression: string;
  correctAnswer: number;
  givenAnswer: number | null;
  responseTimeMs: number;
  timeLimitMs: number;
}): RoundAnswer {
  const { operationId, expression, correctAnswer, givenAnswer, responseTimeMs, timeLimitMs } = params;
  const answered = givenAnswer !== null;
  const isCorrect = answered && givenAnswer === correctAnswer;
  const speed: AnswerSpeed = answered
    ? determineAnswerSpeed(responseTimeMs, timeLimitMs)
    : 'timeout';
  const pointsAwarded = calculatePoints(isCorrect, answered, speed);

  return {
    operationId,
    expression,
    correctAnswer,
    givenAnswer,
    isCorrect,
    responseTimeMs,
    pointsAwarded,
    speed,
  };
}

/**
 * Sums total score from an array of round answers.
 * Score is floored at 0 (no negative totals).
 */
export function computeTotalScore(answers: RoundAnswer[]): number {
  const raw = answers.reduce((acc, a) => acc + a.pointsAwarded, 0);
  return Math.max(0, raw);
}

/**
 * Calculates accuracy as a percentage (0-100, rounded to 1 decimal).
 */
export function computeAccuracy(answers: RoundAnswer[]): number {
  if (answers.length === 0) return 0;
  const correct = answers.filter((a) => a.isCorrect).length;
  return Math.round((correct / answers.length) * 1000) / 10;
}

/**
 * Calculates average response time in milliseconds (only answered questions).
 */
export function computeAverageResponseTime(answers: RoundAnswer[]): number {
  const answered = answers.filter((a) => a.givenAnswer !== null);
  if (answered.length === 0) return 0;
  const total = answered.reduce((sum, a) => sum + a.responseTimeMs, 0);
  return Math.round(total / answered.length);
}
