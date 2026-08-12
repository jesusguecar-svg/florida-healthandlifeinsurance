import type { DomainId, Question } from '../../types';
import { DOMAIN_1_QUESTIONS } from './domain1';
import { DOMAIN_2_QUESTIONS } from './domain2';
import { DOMAIN_3_QUESTIONS } from './domain3';
import { DOMAIN_4_QUESTIONS } from './domain4';
import { DOMAIN_5_QUESTIONS } from './domain5';
import { DOMAIN_6_QUESTIONS } from './domain6';
import { DOMAIN_7_QUESTIONS } from './domain7';
import { DOMAIN_8_QUESTIONS } from './domain8';
import { DOMAIN_9_QUESTIONS } from './domain9';
import { DOMAIN_10_QUESTIONS } from './domain10';
import { DOMAIN_11_QUESTIONS } from './domain11';
import { DOMAIN_12_QUESTIONS } from './domain12';

/**
 * Validated Spanish question bank: 250 items distributed across the twelve
 * domains in proportion to the official Florida content weighting.
 */
export const QUESTIONS: Question[] = [
  ...DOMAIN_1_QUESTIONS,
  ...DOMAIN_2_QUESTIONS,
  ...DOMAIN_3_QUESTIONS,
  ...DOMAIN_4_QUESTIONS,
  ...DOMAIN_5_QUESTIONS,
  ...DOMAIN_6_QUESTIONS,
  ...DOMAIN_7_QUESTIONS,
  ...DOMAIN_8_QUESTIONS,
  ...DOMAIN_9_QUESTIONS,
  ...DOMAIN_10_QUESTIONS,
  ...DOMAIN_11_QUESTIONS,
  ...DOMAIN_12_QUESTIONS,
];

export const QUESTIONS_BY_ID: Record<string, Question> = QUESTIONS.reduce(
  (acc, question) => {
    acc[question.id] = question;
    return acc;
  },
  {} as Record<string, Question>,
);

export function questionsByDomain(domainId: DomainId): Question[] {
  return QUESTIONS.filter((q) => q.domainId === domainId);
}

export const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;
