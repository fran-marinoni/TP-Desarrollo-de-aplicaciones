// ============================================================
// src/utils/formatters.ts
// Pure formatting utilities used across screens
// ============================================================

/**
 * Formats milliseconds into "1.2s" or "15.0s"
 */
export function formatTime(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Formats a seconds countdown: "09" or "1:45"
 */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return String(Math.max(0, totalSeconds)).padStart(2, '0');
  }
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Formats an ISO date string into a readable format.
 * e.g. "18 may. 2026 – 14:30"
 */
export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const date = d.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} – ${time}`;
}

/**
 * Returns accuracy formatted as "92.5%"
 */
export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(1)}%`;
}

/**
 * Generates a unique ID (collision-safe for local use).
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
