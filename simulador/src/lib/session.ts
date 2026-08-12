import { DOMAINS, EXAM_BLUEPRINT } from '../data/domains';
import { QUESTIONS, QUESTIONS_BY_ID } from '../data/questions';
import type {
  AnswerState,
  AttemptRecord,
  DomainId,
  Difficulty,
  Question,
  SessionConfig,
  SessionResult,
  SessionState,
  StoredProgress,
} from '../types';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function missedQuestionIds(progress: StoredProgress): string[] {
  return Object.entries(progress.history)
    .filter(([, attempts]) => {
      const last = attempts[attempts.length - 1];
      return last && !last.correct;
    })
    .map(([id]) => id)
    .filter((id) => QUESTIONS_BY_ID[id] !== undefined);
}

export function filterQuestions(
  config: Pick<SessionConfig, 'domainIds' | 'difficulties' | 'onlyMissed'>,
  progress: StoredProgress,
): Question[] {
  const missed = new Set(config.onlyMissed ? missedQuestionIds(progress) : []);
  return QUESTIONS.filter((q) => {
    if (config.domainIds.length > 0 && !config.domainIds.includes(q.domainId)) {
      return false;
    }
    if (
      config.difficulties.length > 0 &&
      !config.difficulties.includes(q.difficulty)
    ) {
      return false;
    }
    if (config.onlyMissed && !missed.has(q.id)) return false;
    return true;
  });
}

/**
 * Picks the items for a session. Exam sessions draw from every domain in
 * proportion to the official Florida content weighting; practice sessions draw
 * evenly from whatever the student selected.
 */
export function selectQuestions(
  config: SessionConfig,
  progress: StoredProgress,
): Question[] {
  const pool = filterQuestions(config, progress);
  if (pool.length === 0) return [];
  const count = Math.min(config.questionCount, pool.length);

  if (config.mode !== 'exam') {
    return shuffle(pool).slice(0, count);
  }

  const byDomain = new Map<DomainId, Question[]>();
  for (const question of pool) {
    const list = byDomain.get(question.domainId) ?? [];
    list.push(question);
    byDomain.set(question.domainId, list);
  }

  const eligible = DOMAINS.filter((d) => (byDomain.get(d.id) ?? []).length > 0);
  const totalWeight = eligible.reduce((sum, d) => sum + d.weight, 0) || 1;

  const picked: Question[] = [];
  const remainders: { domainId: DomainId; remainder: number }[] = [];

  for (const domain of eligible) {
    const exact = (count * domain.weight) / totalWeight;
    const whole = Math.min(Math.floor(exact), (byDomain.get(domain.id) ?? []).length);
    const available = shuffle(byDomain.get(domain.id) ?? []);
    picked.push(...available.slice(0, whole));
    byDomain.set(domain.id, available.slice(whole));
    remainders.push({ domainId: domain.id, remainder: exact - whole });
  }

  remainders.sort((a, b) => b.remainder - a.remainder);
  let cursor = 0;
  while (picked.length < count && cursor < remainders.length * 4) {
    const { domainId } = remainders[cursor % remainders.length];
    const left = byDomain.get(domainId) ?? [];
    if (left.length > 0) {
      picked.push(left[0]);
      byDomain.set(domainId, left.slice(1));
    }
    cursor++;
  }

  // Top up from anything left if weighting could not fill the quota.
  if (picked.length < count) {
    const used = new Set(picked.map((q) => q.id));
    for (const question of shuffle(pool)) {
      if (picked.length >= count) break;
      if (!used.has(question.id)) {
        picked.push(question);
        used.add(question.id);
      }
    }
  }

  return shuffle(picked).slice(0, count);
}

export function createAnswerState(questionId: string): AnswerState {
  return {
    questionId,
    selected: null,
    flagged: false,
    struck: [],
    highlights: [],
    timeSpentMs: 0,
    revealed: false,
  };
}

export function createSession(
  config: SessionConfig,
  progress: StoredProgress,
): SessionState | null {
  const questions = selectQuestions(config, progress);
  if (questions.length === 0) return null;
  const answers: Record<string, AnswerState> = {};
  for (const question of questions) {
    answers[question.id] = createAnswerState(question.id);
  }
  return {
    id: `s-${Date.now()}`,
    config: { ...config, questionCount: questions.length },
    questionIds: questions.map((q) => q.id),
    answers,
    currentIndex: 0,
    startedAt: Date.now(),
    secondsLeft: config.timeLimitMinutes * 60,
    finishedAt: null,
  };
}

export function gradeSession(session: SessionState): SessionResult {
  const attempts: AttemptRecord[] = session.questionIds.map((id) => {
    const question = QUESTIONS_BY_ID[id];
    const answer = session.answers[id];
    return {
      questionId: id,
      domainId: question.domainId,
      subdomainId: question.subdomainId,
      difficulty: question.difficulty,
      selected: answer?.selected ?? null,
      correct: answer?.selected === question.correct,
      timeSpentMs: answer?.timeSpentMs ?? 0,
    };
  });

  const correctCount = attempts.filter((a) => a.correct).length;
  const total = attempts.length;
  const scorePct = total === 0 ? 0 : (correctCount / total) * 100;

  return {
    id: session.id,
    label: session.config.label,
    mode: session.config.mode,
    finishedAt: Date.now(),
    durationMs: Date.now() - session.startedAt,
    attempts,
    correctCount,
    total,
    scorePct,
    passed: scorePct >= EXAM_BLUEPRINT.passingPct,
  };
}

export function examConfig(): SessionConfig {
  return {
    mode: 'exam',
    domainIds: [],
    difficulties: ['easy', 'medium', 'hard'],
    questionCount: EXAM_BLUEPRINT.scoredQuestions,
    timeLimitMinutes: EXAM_BLUEPRINT.timeLimitMinutes,
    instantFeedback: false,
    onlyMissed: false,
    label: 'Simulacro completo del examen',
  };
}

export function quickPracticeConfig(): SessionConfig {
  return {
    mode: 'practice',
    domainIds: [],
    difficulties: ['easy', 'medium', 'hard'],
    questionCount: 20,
    timeLimitMinutes: 0,
    instantFeedback: true,
    onlyMissed: false,
    label: 'Práctica rápida',
  };
}

export function domainPracticeConfig(
  domainId: DomainId,
  count: number,
): SessionConfig {
  const domain = DOMAINS.find((d) => d.id === domainId);
  return {
    mode: 'practice',
    domainIds: [domainId],
    difficulties: ['easy', 'medium', 'hard'],
    questionCount: count,
    timeLimitMinutes: 0,
    instantFeedback: true,
    onlyMissed: false,
    label: `Práctica del Dominio ${domainId}: ${domain?.shortName ?? ''}`.trim(),
  };
}

export function missedPracticeConfig(count: number): SessionConfig {
  return {
    mode: 'practice',
    domainIds: [],
    difficulties: ['easy', 'medium', 'hard'],
    questionCount: count,
    timeLimitMinutes: 0,
    instantFeedback: true,
    onlyMissed: true,
    label: 'Repaso de preguntas falladas',
  };
}

export const ALL_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
