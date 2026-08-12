// Internal identifiers are intentionally in English (technical exception).
// Every student-facing string lives in Spanish, either in the data files or in src/i18n.ts.

export type DomainId =
  | 'I'
  | 'II'
  | 'III'
  | 'IV'
  | 'V'
  | 'VI'
  | 'VII'
  | 'VIII'
  | 'IX'
  | 'X'
  | 'XI'
  | 'XII';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface Subdomain {
  /** Outline path, e.g. "I.A" */
  id: string;
  /** Spanish display name shown to the student. */
  name: string;
}

export interface Domain {
  id: DomainId;
  /** Spanish display name shown to the student. */
  name: string;
  /** Short Spanish label for compact UI (chips, charts). */
  shortName: string;
  /** Official Florida content weighting, in percent. */
  weight: number;
  /** Number of items allocated to this domain in the 250-item bank. */
  target: number;
  subdomains: Subdomain[];
}

export interface Question {
  /** e.g. "FL-HL-D01-007" */
  id: string;
  domainId: DomainId;
  /** Outline path of the subdomain, e.g. "I.D" */
  subdomainId: string;
  difficulty: Difficulty;
  /** Question stem, in Spanish. */
  stem: string;
  options: Record<OptionId, string>;
  correct: OptionId;
  /**
   * One explanation per option. The entry for `correct` explains why the answer
   * is right; the other three explain why each distractor is wrong.
   */
  explanations: Record<OptionId, string>;
  /** Legal or regulatory citation supporting the keyed answer. */
  reference?: string;
}

export type SessionMode = 'practice' | 'exam';

export interface SessionConfig {
  mode: SessionMode;
  /** Domains included; empty array means every domain. */
  domainIds: DomainId[];
  difficulties: Difficulty[];
  questionCount: number;
  /** Minutes; 0 disables the timer. */
  timeLimitMinutes: number;
  /** Show the explanation right after answering (practice only). */
  instantFeedback: boolean;
  /** Restrict to questions previously answered incorrectly. */
  onlyMissed: boolean;
  /** Human-readable Spanish label describing the session. */
  label: string;
}

export interface AnswerState {
  questionId: string;
  selected: OptionId | null;
  flagged: boolean;
  /** Options the student crossed out. */
  struck: OptionId[];
  /** Character ranges highlighted inside the stem. */
  highlights: [number, number][];
  /** Milliseconds spent on the item. */
  timeSpentMs: number;
  revealed: boolean;
}

export interface SessionState {
  id: string;
  config: SessionConfig;
  questionIds: string[];
  answers: Record<string, AnswerState>;
  currentIndex: number;
  startedAt: number;
  /** Remaining seconds when the timer is enabled. */
  secondsLeft: number;
  finishedAt: number | null;
}

export interface AttemptRecord {
  questionId: string;
  domainId: DomainId;
  subdomainId: string;
  difficulty: Difficulty;
  selected: OptionId | null;
  correct: boolean;
  timeSpentMs: number;
}

export interface SessionResult {
  id: string;
  label: string;
  mode: SessionMode;
  finishedAt: number;
  durationMs: number;
  attempts: AttemptRecord[];
  correctCount: number;
  total: number;
  scorePct: number;
  passed: boolean;
}

export interface StoredProgress {
  results: SessionResult[];
  /** Per-question history, newest attempt last. */
  history: Record<string, { correct: boolean; at: number }[]>;
  activeSession: SessionState | null;
}
