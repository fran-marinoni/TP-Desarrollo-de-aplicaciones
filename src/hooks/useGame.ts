// ============================================================
// src/hooks/useGame.ts
// Orchestrates operation lifecycle, timer resets, and transitions
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameConfig, GameResult, Operation, RoundAnswer } from '../types';
import { generateRound } from '../services/gameEngine';
import { validateAnswer } from '../services/gameEngine';
import {
  buildRoundAnswer,
  computeAccuracy,
  computeAverageResponseTime,
  computeTotalScore,
} from '../utils/scoreCalculator';
import { generateId } from '../utils/formatters';
import { TIME_ATTACK_TOTAL_SECONDS } from '../constants/game';

export type GamePhase = 'idle' | 'playing' | 'finished';

interface UseGameReturn {
  phase: GamePhase;
  operations: Operation[];
  currentIndex: number;
  currentOperation: Operation | null;
  answers: RoundAnswer[];
  score: number;
  /** Remaining seconds for the current question */
  questionSecondsLeft: number;
  /** Remaining seconds for time-attack mode total */
  totalSecondsLeft: number;
  startGame: (config: GameConfig) => void;
  submitAnswer: (answer: number | boolean | null) => void;
  skipQuestion: () => void;
  result: GameResult | null;
}

export function useGame(): UseGameReturn {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [operations, setOperations] = useState<Operation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<RoundAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [questionSecondsLeft, setQuestionSecondsLeft] = useState(0);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  const configRef = useRef<GameConfig | null>(null);
  const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(0);

  // ── Cleanup helpers ────────────────────────────────────────
  const clearQuestionTimer = useCallback(() => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }
  }, []);

  const clearTotalTimer = useCallback(() => {
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
  }, []);

  // ── Finish game ────────────────────────────────────────────
  const finishGame = useCallback(
    (finalAnswers: RoundAnswer[], cfg: GameConfig) => {
      clearQuestionTimer();
      clearTotalTimer();

      const gameResult: GameResult = {
        id: generateId(),
        date: new Date().toISOString(),
        difficulty: cfg.difficulty,
        gameMode: cfg.gameMode,
        score: computeTotalScore(finalAnswers),
        totalQuestions: finalAnswers.length,
        correctAnswers: finalAnswers.filter((a) => a.isCorrect).length,
        incorrectAnswers: finalAnswers.filter(
          (a) => !a.isCorrect && a.givenAnswer !== null
        ).length,
        unansweredQuestions: finalAnswers.filter((a) => a.givenAnswer === null)
          .length,
        accuracy: computeAccuracy(finalAnswers),
        averageResponseTimeMs: computeAverageResponseTime(finalAnswers),
        answers: finalAnswers,
      };

      setResult(gameResult);
      setPhase('finished');
    },
    [clearQuestionTimer, clearTotalTimer]
  );

  // ── Process an answer (correct, wrong, or timeout) ─────────
  const processAnswer = useCallback(
    (
      ops: Operation[],
      idx: number,
      currentAnswers: RoundAnswer[],
      givenAnswer: number | null,
      cfg: GameConfig
    ) => {
      clearQuestionTimer();

      const op = ops[idx];
      const responseTimeMs = Date.now() - questionStartRef.current;
      const timeLimitMs = cfg.timePerOperation * 1000;

      const roundAnswer = buildRoundAnswer({
        operationId: op.id,
        expression: op.expression,
        correctAnswer: op.correctAnswer,
        givenAnswer,
        responseTimeMs,
        timeLimitMs,
      });

      const updatedAnswers = [...currentAnswers, roundAnswer];
      const updatedScore = computeTotalScore(updatedAnswers);

      setAnswers(updatedAnswers);
      setScore(updatedScore);

      const nextIndex = idx + 1;

      // Time attack: keep going while total time remains
      if (cfg.gameMode === 'timeAttack') {
        const newOp = generateRound(cfg.difficulty, cfg.gameMode, 1)[0];
        const newOps = [...ops, newOp];
        setOperations(newOps);
        setCurrentIndex(nextIndex);
        startQuestionTimer(cfg, newOps, nextIndex, updatedAnswers);
        return;
      }

      if (nextIndex >= ops.length) {
        finishGame(updatedAnswers, cfg);
        return;
      }

      setCurrentIndex(nextIndex);
      startQuestionTimer(cfg, ops, nextIndex, updatedAnswers);
    },
    [clearQuestionTimer, finishGame] // eslint-disable-line
  );

  // ── Start per-question timer ───────────────────────────────
  // NOTE: defined as ref-based to avoid stale closures
  const processAnswerRef = useRef(processAnswer);
  useEffect(() => { processAnswerRef.current = processAnswer; }, [processAnswer]);

  function startQuestionTimer(
    cfg: GameConfig,
    ops: Operation[],
    idx: number,
    currentAnswers: RoundAnswer[]
  ) {
    clearQuestionTimer();
    setQuestionSecondsLeft(cfg.timePerOperation);
    questionStartRef.current = Date.now();

    let remaining = cfg.timePerOperation;
    questionTimerRef.current = setInterval(() => {
      remaining -= 1;
      setQuestionSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(questionTimerRef.current!);
        questionTimerRef.current = null;
        // Timeout: record as unanswered
        processAnswerRef.current(ops, idx, currentAnswers, null, cfg);
      }
    }, 1000);
  }

  // ── Start total timer (time attack only) ──────────────────
  function startTotalTimer(cfg: GameConfig, ops: Operation[]) {
    clearTotalTimer();
    const total = TIME_ATTACK_TOTAL_SECONDS[cfg.difficulty];
    setTotalSecondsLeft(total);
    let remaining = total;

    totalTimerRef.current = setInterval(() => {
      remaining -= 1;
      setTotalSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(totalTimerRef.current!);
        totalTimerRef.current = null;
        clearQuestionTimer();
        // Game over — finish with current answers
        setAnswers((prev) => {
          finishGameRef.current(prev, cfg);
          return prev;
        });
      }
    }, 1000);
  }

  const finishGameRef = useRef(finishGame);
  useEffect(() => { finishGameRef.current = finishGame; }, [finishGame]);

  // ── Public: start game ─────────────────────────────────────
  const startGame = useCallback(
    (config: GameConfig) => {
      clearQuestionTimer();
      clearTotalTimer();

      configRef.current = config;
      const ops = generateRound(config.difficulty, config.gameMode, config.iterations);

      setOperations(ops);
      setCurrentIndex(0);
      setAnswers([]);
      setScore(0);
      setResult(null);
      setPhase('playing');

      if (config.gameMode === 'timeAttack') {
        startTotalTimer(config, ops);
      }

      startQuestionTimer(config, ops, 0, []);
    },
    [clearQuestionTimer, clearTotalTimer] // eslint-disable-line
  );

  // ── Public: submit answer ──────────────────────────────────
  const submitAnswer = useCallback(
    (answer: number | boolean | null) => {
      if (phase !== 'playing' || !configRef.current) return;
      const cfg = configRef.current;

      let numericAnswer: number | null = null;
      if (answer !== null) {
        if (typeof answer === 'boolean') {
          // For trueFalse: convert to 1 (true) or 0 (false)
          // validate separately via gameEngine
          const op = operations[currentIndex];
          const isCorrect = validateAnswer(op, cfg.gameMode, answer);
          numericAnswer = isCorrect ? op.correctAnswer : -999; // sentinel
          // Build answer manually
          clearQuestionTimer();
          const responseTimeMs = Date.now() - questionStartRef.current;
          const timeLimitMs = cfg.timePerOperation * 1000;
          const roundAnswer = buildRoundAnswer({
            operationId: op.id,
            expression: op.expression,
            correctAnswer: op.correctAnswer,
            givenAnswer: isCorrect ? op.correctAnswer : (op.displayedAnswer ?? -1),
            responseTimeMs,
            timeLimitMs,
          });
          // Override isCorrect since validation is boolean-based
          const correctedAnswer: RoundAnswer = { ...roundAnswer, isCorrect };

          setAnswers((prev) => {
            const updated = [...prev, correctedAnswer];
            const updatedScore = computeTotalScore(updated);
            setScore(updatedScore);

            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);

            if (cfg.gameMode === 'timeAttack') {
              const newOp = generateRound(cfg.difficulty, cfg.gameMode, 1)[0];
              setOperations((prevOps) => {
                const newOps = [...prevOps, newOp];
                startQuestionTimer(cfg, newOps, nextIndex, updated);
                return newOps;
              });
            } else if (nextIndex >= operations.length) {
              finishGameRef.current(updated, cfg);
            } else {
              startQuestionTimer(cfg, operations, nextIndex, updated);
            }

            return updated;
          });
          return;
        }
        numericAnswer = answer as number;
      }

      setAnswers((prev) => {
        processAnswerRef.current(
          operations,
          currentIndex,
          prev,
          numericAnswer,
          cfg
        );
        return prev;
      });
    },
    [phase, operations, currentIndex, clearQuestionTimer]
  );

  // ── Public: skip ───────────────────────────────────────────
  const skipQuestion = useCallback(() => {
    submitAnswer(null);
  }, [submitAnswer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearQuestionTimer();
      clearTotalTimer();
    };
  }, [clearQuestionTimer, clearTotalTimer]);

  return {
    phase,
    operations,
    currentIndex,
    currentOperation: operations[currentIndex] ?? null,
    answers,
    score,
    questionSecondsLeft,
    totalSecondsLeft,
    startGame,
    submitAnswer,
    skipQuestion,
    result,
  };
}
