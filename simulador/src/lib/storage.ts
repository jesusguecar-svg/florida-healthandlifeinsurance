import type { SessionResult, SessionState, StoredProgress } from '../types';

const STORAGE_KEY = 'fl-hl-simulador-v1';

const EMPTY: StoredProgress = {
  results: [],
  history: {},
  activeSession: null,
};

export function loadProgress(): StoredProgress {
  if (typeof localStorage === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      results: parsed.results ?? [],
      history: parsed.history ?? {},
      activeSession: parsed.activeSession ?? null,
    };
  } catch {
    return EMPTY;
  }
}

export function saveProgress(progress: StoredProgress): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable: the session still works in memory.
  }
}

export function clearProgress(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function recordResult(
  progress: StoredProgress,
  result: SessionResult,
): StoredProgress {
  const history = { ...progress.history };
  for (const attempt of result.attempts) {
    const prior = history[attempt.questionId] ?? [];
    history[attempt.questionId] = [
      ...prior,
      { correct: attempt.correct, at: result.finishedAt },
    ];
  }
  return {
    results: [...progress.results, result],
    history,
    activeSession: null,
  };
}

export function setActiveSession(
  progress: StoredProgress,
  session: SessionState | null,
): StoredProgress {
  return { ...progress, activeSession: session };
}
