// ============================================================
// src/services/gameEngine.ts
// Core game logic — operation generation, mode setup
// All pure functions, no React dependencies
// ============================================================

import { Difficulty, GameMode, Operation, OperationType } from '../types';
import {
  NUMBER_RANGES,
  OPERATIONS_BY_DIFFICULTY,
  OPERATOR_SYMBOLS,
  MULTIPLE_CHOICE_COUNT,
} from '../constants/game';
import { generateId } from '../utils/formatters';

// ── Random helpers ────────────────────────────────────────────
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Core operation generator ──────────────────────────────────
function generateCoreOperation(difficulty: Difficulty): {
  a: number;
  b: number;
  operator: OperationType;
  result: number;
} {
  const { min, max } = NUMBER_RANGES[difficulty];
  const operators = OPERATIONS_BY_DIFFICULTY[difficulty];
  const operator = pickRandom(operators);

  let a = randInt(min, max);
  let b = randInt(min, max);

  switch (operator) {
    case 'addition':
      return { a, b, operator, result: a + b };

    case 'subtraction':
      // Ensure non-negative result
      if (a < b) [a, b] = [b, a];
      return { a, b, operator, result: a - b };

    case 'multiplication': {
      // Cap to avoid huge numbers
      const capA = difficulty === 'hard' ? 20 : min;
      const capB = difficulty === 'hard' ? 20 : min;
      const ma = randInt(2, Math.max(2, capA));
      const mb = randInt(2, Math.max(2, capB));
      return { a: ma, b: mb, operator, result: ma * mb };
    }

    case 'division': {
      // Generate valid division: pick divisor then compute dividend
      const divisor = randInt(2, difficulty === 'hard' ? 12 : 10);
      const quotient = randInt(2, difficulty === 'hard' ? 15 : 10);
      const dividend = divisor * quotient;
      return { a: dividend, b: divisor, operator, result: quotient };
    }
  }
}

// ── Build expression string ───────────────────────────────────
function buildExpression(a: number, b: number, operator: OperationType): string {
  return `${a} ${OPERATOR_SYMBOLS[operator]} ${b}`;
}

// ── Multiple-choice distractors ───────────────────────────────
function generateChoices(correct: number, difficulty: Difficulty): number[] {
  const distractors = new Set<number>();
  const spread = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20;

  while (distractors.size < MULTIPLE_CHOICE_COUNT - 1) {
    const offset = randInt(-spread, spread);
    const candidate = correct + offset;
    if (candidate !== correct && candidate >= 0) {
      distractors.add(candidate);
    }
  }

  return shuffle([correct, ...Array.from(distractors)]);
}

// ── Generate a single operation ───────────────────────────────
export function generateOperation(
  difficulty: Difficulty,
  mode: GameMode
): Operation {
  const { a, b, operator, result } = generateCoreOperation(difficulty);
  const expression = buildExpression(a, b, operator);

  const operation: Operation = {
    id: generateId(),
    expression,
    operandA: a,
    operandB: b,
    operator,
    correctAnswer: result,
  };

  if (mode === 'trueFalse') {
    // 50% chance the displayed answer is wrong
    const showWrong = Math.random() < 0.5;
    if (showWrong) {
      const spread = Math.max(2, Math.round(result * 0.3));
      let wrongAnswer: number;
      do {
        wrongAnswer = result + randInt(-spread, spread);
      } while (wrongAnswer === result || wrongAnswer < 0);
      operation.displayedAnswer = wrongAnswer;
    } else {
      operation.displayedAnswer = result;
    }
  }

  if (mode === 'multipleChoice') {
    operation.choices = generateChoices(result, difficulty);
  }

  return operation;
}

// ── Generate a full round of operations ───────────────────────
export function generateRound(
  difficulty: Difficulty,
  mode: GameMode,
  count: number
): Operation[] {
  return Array.from({ length: count }, () => generateOperation(difficulty, mode));
}

// ── Validate a player's answer ────────────────────────────────
export function validateAnswer(
  operation: Operation,
  mode: GameMode,
  playerAnswer: number | boolean | null
): boolean {
  if (playerAnswer === null) return false;

  if (mode === 'trueFalse') {
    const isTrue = operation.displayedAnswer === operation.correctAnswer;
    return (playerAnswer as boolean) === isTrue;
  }

  return (playerAnswer as number) === operation.correctAnswer;
}
