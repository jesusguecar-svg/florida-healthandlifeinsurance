import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import type {
  AttemptRecord,
  Difficulty,
  DomainId,
  SessionResult,
  StoredProgress,
} from '../types';

export interface Tally {
  correct: number;
  total: number;
}

export function pct(tally: Tally): number {
  return tally.total === 0 ? 0 : (tally.correct / tally.total) * 100;
}

export function tallyBy<K extends string>(
  attempts: AttemptRecord[],
  key: (a: AttemptRecord) => K,
): Record<K, Tally> {
  const out = {} as Record<K, Tally>;
  for (const attempt of attempts) {
    const k = key(attempt);
    const current = out[k] ?? { correct: 0, total: 0 };
    out[k] = {
      correct: current.correct + (attempt.correct ? 1 : 0),
      total: current.total + 1,
    };
  }
  return out;
}

export function allAttempts(progress: StoredProgress): AttemptRecord[] {
  return progress.results.flatMap((r) => r.attempts);
}

export function domainTallies(
  attempts: AttemptRecord[],
): Record<DomainId, Tally> {
  const base = {} as Record<DomainId, Tally>;
  for (const domain of DOMAINS) base[domain.id] = { correct: 0, total: 0 };
  for (const attempt of attempts) {
    const entry = base[attempt.domainId];
    if (!entry) continue;
    entry.total += 1;
    if (attempt.correct) entry.correct += 1;
  }
  return base;
}

export function difficultyTallies(
  attempts: AttemptRecord[],
): Record<Difficulty, Tally> {
  const base: Record<Difficulty, Tally> = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  };
  for (const attempt of attempts) {
    const entry = base[attempt.difficulty];
    entry.total += 1;
    if (attempt.correct) entry.correct += 1;
  }
  return base;
}

/** Distinct bank questions seen at least once, per domain. */
export function coverageByDomain(
  progress: StoredProgress,
): Record<DomainId, { seen: number; total: number }> {
  const totals = {} as Record<DomainId, { seen: number; total: number }>;
  for (const domain of DOMAINS) totals[domain.id] = { seen: 0, total: 0 };
  for (const question of QUESTIONS) {
    if (totals[question.domainId]) totals[question.domainId].total += 1;
  }
  for (const [questionId, attempts] of Object.entries(progress.history)) {
    if (attempts.length === 0) continue;
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (question && totals[question.domainId]) {
      totals[question.domainId].seen += 1;
    }
  }
  return totals;
}

export function overallTally(progress: StoredProgress): Tally {
  return allAttempts(progress).reduce<Tally>(
    (acc, a) => ({
      correct: acc.correct + (a.correct ? 1 : 0),
      total: acc.total + 1,
    }),
    { correct: 0, total: 0 },
  );
}

export function rankedDomains(
  result: SessionResult,
): { domainId: DomainId; tally: Tally }[] {
  const tallies = domainTallies(result.attempts);
  return DOMAINS.map((d) => ({ domainId: d.id, tally: tallies[d.id] }))
    .filter((entry) => entry.tally.total > 0)
    .sort((a, b) => pct(b.tally) - pct(a.tally));
}

export function formatPct(value: number): string {
  return `${value.toFixed(0)} %`;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

export function formatClock(totalSeconds: number): string {
  return formatDuration(Math.max(0, totalSeconds) * 1000);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
