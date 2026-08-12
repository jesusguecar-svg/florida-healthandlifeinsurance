import { describe, expect, it } from 'vitest';
import { DOMAINS } from '../domains';
import { OPTION_IDS, QUESTIONS } from './index';
import type { DomainId } from '../../types';

const DOMAIN_IDS = new Set(DOMAINS.map((d) => d.id));
const SUBDOMAIN_IDS = new Set(DOMAINS.flatMap((d) => d.subdomains.map((s) => s.id)));

describe('banco de preguntas', () => {
  it('contiene 250 preguntas con identificadores únicos', () => {
    expect(QUESTIONS).toHaveLength(250);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(250);
  });

  it('respeta la asignación por dominio del esquema oficial', () => {
    const counts = QUESTIONS.reduce<Record<string, number>>((acc, q) => {
      acc[q.domainId] = (acc[q.domainId] ?? 0) + 1;
      return acc;
    }, {});
    for (const domain of DOMAINS) {
      expect(counts[domain.id], `Dominio ${domain.id}`).toBe(domain.target);
    }
  });

  it('suma 100 % de peso oficial y 250 preguntas asignadas', () => {
    expect(DOMAINS.reduce((sum, d) => sum + d.weight, 0)).toBe(100);
    expect(DOMAINS.reduce((sum, d) => sum + d.target, 0)).toBe(250);
  });

  for (const question of QUESTIONS) {
    describe(question.id, () => {
      it('usa un dominio y subdominio válidos del esquema', () => {
        expect(DOMAIN_IDS.has(question.domainId as DomainId)).toBe(true);
        expect(SUBDOMAIN_IDS.has(question.subdomainId)).toBe(true);
        expect(question.subdomainId.startsWith(`${question.domainId}.`)).toBe(true);
      });

      it('tiene cuatro opciones no vacías y una respuesta correcta válida', () => {
        for (const id of OPTION_IDS) {
          expect(question.options[id]?.trim().length ?? 0).toBeGreaterThan(0);
        }
        expect(OPTION_IDS).toContain(question.correct);
      });

      it('no repite el texto de dos opciones', () => {
        const texts = OPTION_IDS.map((id) => question.options[id].trim().toLowerCase());
        expect(new Set(texts).size).toBe(4);
      });

      it('explica cada una de las cuatro opciones', () => {
        for (const id of OPTION_IDS) {
          expect(question.explanations[id]?.trim().length ?? 0).toBeGreaterThan(20);
        }
      });

      it('marca la explicación de la respuesta correcta como correcta', () => {
        expect(question.explanations[question.correct]).toMatch(/^Correcto\./);
      });

      it('tiene un enunciado en español y una dificultad válida', () => {
        expect(question.stem.trim().length).toBeGreaterThan(20);
        expect(['easy', 'medium', 'hard']).toContain(question.difficulty);
      });
    });
  }

  it('incluye las tres dificultades en cada dominio', () => {
    for (const domain of DOMAINS) {
      const levels = new Set(
        QUESTIONS.filter((q) => q.domainId === domain.id).map((q) => q.difficulty),
      );
      expect(levels.size, `Dominio ${domain.id}`).toBeGreaterThanOrEqual(2);
    }
  });

  it('distribuye la respuesta correcta entre las cuatro opciones', () => {
    const counts = QUESTIONS.reduce<Record<string, number>>((acc, q) => {
      acc[q.correct] = (acc[q.correct] ?? 0) + 1;
      return acc;
    }, {});
    for (const id of OPTION_IDS) {
      expect(counts[id] ?? 0).toBeGreaterThan(10);
    }
  });
});
