// ============================================================
// src/hooks/useTimer.ts
// Countdown timer hook — drives per-operation and total timers
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerOptions {
  initialSeconds: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

interface UseTimerReturn {
  secondsLeft: number;
  elapsedMs: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
  /** Ratio elapsed/total: 0 → 1 */
  progress: number;
}

export function useTimer({
  initialSeconds,
  onExpire,
  autoStart = false,
}: UseTimerOptions): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  // Track when the current "run" started (for precise ms calculation)
  const startedAtRef = useRef<number | null>(null);
  const elapsedAtPauseRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  const totalRef = useRef(initialSeconds);

  // Keep callback ref fresh
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    startedAtRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  const start = useCallback(() => {
    startedAtRef.current = Date.now();
    elapsedAtPauseRef.current = 0;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (startedAtRef.current !== null) {
      elapsedAtPauseRef.current += Date.now() - startedAtRef.current;
      startedAtRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    clearTimer();
    setIsRunning(false);
    const s = newSeconds ?? initialSeconds;
    totalRef.current = s;
    setSecondsLeft(s);
    elapsedAtPauseRef.current = 0;
    startedAtRef.current = null;
  }, [clearTimer, initialSeconds]);

  const elapsedMs =
    startedAtRef.current !== null
      ? elapsedAtPauseRef.current + (Date.now() - startedAtRef.current)
      : elapsedAtPauseRef.current;

  const progress =
    totalRef.current > 0
      ? 1 - secondsLeft / totalRef.current
      : 1;

  return { secondsLeft, elapsedMs, isRunning, start, pause, reset, progress };
}
