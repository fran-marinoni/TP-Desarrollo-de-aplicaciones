// ============================================================
// src/hooks/useScore.ts
// Reactive score accumulation hook
// ============================================================

import { useCallback, useState } from 'react';
import { RoundAnswer } from '../types';
import {
  buildRoundAnswer,
  computeAccuracy,
  computeAverageResponseTime,
  computeTotalScore,
} from '../utils/scoreCalculator';

interface UseScoreReturn {
  score: number;
  answers: RoundAnswer[];
  accuracy: number;
  averageResponseTimeMs: number;
  addAnswer: (params: {
    operationId: string;
    expression: string;
    correctAnswer: number;
    givenAnswer: number | null;
    responseTimeMs: number;
    timeLimitMs: number;
  }) => RoundAnswer;
  reset: () => void;
}

export function useScore(): UseScoreReturn {
  const [answers, setAnswers] = useState<RoundAnswer[]>([]);
  const [score, setScore] = useState(0);

  const addAnswer = useCallback(
    (params: {
      operationId: string;
      expression: string;
      correctAnswer: number;
      givenAnswer: number | null;
      responseTimeMs: number;
      timeLimitMs: number;
    }): RoundAnswer => {
      const roundAnswer = buildRoundAnswer(params);

      setAnswers((prev) => {
        const updated = [...prev, roundAnswer];
        setScore(computeTotalScore(updated));
        return updated;
      });

      return roundAnswer;
    },
    []
  );

  const reset = useCallback(() => {
    setAnswers([]);
    setScore(0);
  }, []);

  return {
    score,
    answers,
    accuracy: computeAccuracy(answers),
    averageResponseTimeMs: computeAverageResponseTime(answers),
    addAnswer,
    reset,
  };
}
