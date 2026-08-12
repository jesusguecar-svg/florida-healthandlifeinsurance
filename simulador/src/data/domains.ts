import type { Domain, DomainId } from '../types';

/**
 * Domain scope, weighting and outline paths come from the official Florida
 * examination content outline for the Agent's Health & Life (including
 * Annuities & Variable Contracts) examination, effective January 1, 2026
 * (pages S7–S11). Spanish naming follows the Spanish research dossiers.
 *
 * The outline restarts its numbering for the Florida statutes section; the
 * dossiers number those three domains X, XI and XII, and this app does the same.
 */
export const DOMAINS: Domain[] = [
  {
    id: 'I',
    name: 'Tipos de pólizas de vida y características',
    shortName: 'Pólizas de vida',
    weight: 10,
    target: 25,
    subdomains: [
      { id: 'I.A', name: 'Productos tradicionales de vida entera' },
      {
        id: 'I.B',
        name: 'Productos de vida ajustables o sensibles a intereses y al mercado',
      },
      { id: 'I.C', name: 'Seguro de vida temporal (term life)' },
      { id: 'I.D', name: 'Anualidades' },
      { id: 'I.E', name: 'Planes combinados y variaciones' },
    ],
  },
  {
    id: 'II',
    name: 'Cláusulas adicionales, disposiciones, opciones y exclusiones de la póliza de vida',
    shortName: 'Disposiciones de vida',
    weight: 10,
    target: 25,
    subdomains: [
      { id: 'II.A', name: 'Cláusulas adicionales (riders)' },
      { id: 'II.B', name: 'Disposiciones y opciones de la póliza' },
      { id: 'II.C', name: 'Exclusiones de la póliza' },
    ],
  },
  {
    id: 'III',
    name: 'Cómo completar la solicitud de vida, suscribir y entregar las pólizas',
    shortName: 'Solicitud y entrega',
    weight: 8,
    target: 20,
    subdomains: [
      { id: 'III.A', name: 'Cómo completar la solicitud' },
      { id: 'III.B', name: 'Suscripción (underwriting)' },
      { id: 'III.C', name: 'Entrega de la póliza' },
      { id: 'III.D', name: 'Derecho contractual' },
    ],
  },
  {
    id: 'IV',
    name: 'Jubilación y otros conceptos del seguro de vida',
    shortName: 'Jubilación y conceptos',
    weight: 5,
    target: 13,
    subdomains: [
      { id: 'IV.A', name: 'Propiedad de terceros' },
      { id: 'IV.B', name: 'Acuerdos de vida (life settlements)' },
      { id: 'IV.C', name: 'Seguro de vida grupal' },
      { id: 'IV.D', name: 'Planes de jubilación' },
      {
        id: 'IV.E',
        name: 'Análisis de necesidades e idoneidad (suitability) del seguro de vida',
      },
      { id: 'IV.F', name: 'Beneficios del Seguro Social' },
      {
        id: 'IV.G',
        name: 'Tratamiento tributario de primas, beneficios y dividendos',
      },
    ],
  },
  {
    id: 'V',
    name: 'Tipos de pólizas de salud',
    shortName: 'Pólizas de salud',
    weight: 11,
    target: 27,
    subdomains: [
      { id: 'V.A', name: 'Ingreso por incapacidad (disability income)' },
      { id: 'V.B', name: 'Muerte accidental y desmembramiento (AD&D)' },
      { id: 'V.C', name: 'Seguro de gastos médicos' },
      { id: 'V.D', name: 'Pólizas de suplemento de Medicare' },
      { id: 'V.E', name: 'Seguro grupal' },
      {
        id: 'V.F',
        name: 'Cuidado a largo plazo (LTC) individual y grupal',
      },
      { id: 'V.G', name: 'Otras pólizas' },
    ],
  },
  {
    id: 'VI',
    name: 'Disposiciones, cláusulas y cláusulas adicionales de la póliza de salud',
    shortName: 'Disposiciones de salud',
    weight: 10,
    target: 25,
    subdomains: [
      { id: 'VI.A', name: 'Disposiciones obligatorias y opcionales' },
      { id: 'VI.B', name: 'Otras disposiciones y cláusulas' },
      { id: 'VI.C', name: 'Cláusulas adicionales (riders)' },
      { id: 'VI.D', name: 'Derechos de renovabilidad' },
    ],
  },
  {
    id: 'VII',
    name: 'Seguro social',
    shortName: 'Seguro social',
    weight: 4,
    target: 10,
    subdomains: [
      { id: 'VII.A', name: 'Medicare (Partes A, B, C y D)' },
      { id: 'VII.B', name: 'Medicaid' },
      { id: 'VII.C', name: 'Beneficios del Seguro Social' },
    ],
  },
  {
    id: 'VIII',
    name: 'Otros conceptos del seguro de salud',
    shortName: 'Otros conceptos de salud',
    weight: 4,
    target: 10,
    subdomains: [
      {
        id: 'VIII.A',
        name: 'Incapacidad total, parcial, recurrente y residual',
      },
      { id: 'VIII.B', name: 'Derechos del propietario' },
      { id: 'VIII.C', name: 'Beneficios para hijos dependientes' },
      { id: 'VIII.D', name: 'Beneficiarios primarios y contingentes' },
      { id: 'VIII.E', name: 'Modos de pago de primas' },
      {
        id: 'VIII.F',
        name: 'No duplicación y coordinación de beneficios (COB)',
      },
      { id: 'VIII.G', name: 'Ocupacional frente a no ocupacional' },
      {
        id: 'VIII.H',
        name: 'Tratamiento tributario de primas y beneficios',
      },
      { id: 'VIII.I', name: 'Atención administrada (managed care)' },
      {
        id: 'VIII.J',
        name: 'Compensación laboral (workers compensation)',
      },
      { id: 'VIII.K', name: 'Subrogación' },
    ],
  },
  {
    id: 'IX',
    name: 'Procedimientos de suscripción de campo',
    shortName: 'Suscripción de campo',
    weight: 5,
    target: 12,
    subdomains: [
      { id: 'IX.A', name: 'Cómo completar la solicitud' },
      {
        id: 'IX.B',
        name: 'Fuentes de asegurabilidad y privacidad (HIPAA, MIB, FCRA)',
      },
      {
        id: 'IX.C',
        name: 'Prima inicial, recibo y consecuencias del recibo',
      },
      {
        id: 'IX.D',
        name: 'Envío de la solicitud a la compañía para suscripción',
      },
      { id: 'IX.E', name: 'Entrega de la póliza' },
      {
        id: 'IX.F',
        name: 'Explicación de la póliza, cláusulas, exclusiones y calificaciones',
      },
      { id: 'IX.G', name: 'Reemplazo (replacement)' },
      { id: 'IX.H', name: 'Derecho contractual' },
    ],
  },
  {
    id: 'X',
    name: 'Estatutos, reglas y regulaciones de Florida comunes a todas las líneas',
    shortName: 'Florida: todas las líneas',
    weight: 13,
    target: 33,
    subdomains: [
      { id: 'X.A', name: 'Regulación de servicios financieros' },
      { id: 'X.B', name: 'Departamento de Servicios Financieros (DFS)' },
      { id: 'X.C', name: 'Oficina de Regulación de Seguros (OIR)' },
      { id: 'X.D', name: 'Oficina de Regulación Financiera (OFR)' },
      { id: 'X.E', name: 'Definiciones' },
      { id: 'X.F', name: 'Licencias y nombramientos' },
      { id: 'X.G', name: 'Responsabilidades del agente' },
      { id: 'X.H', name: 'Fondo de garantía de seguros' },
      {
        id: 'X.I',
        name: 'Prácticas de marketing y prácticas comerciales desleales',
      },
    ],
  },
  {
    id: 'XI',
    name: 'Estatutos y reglas de Florida sobre vida y anualidades, incluidos los productos variables',
    shortName: 'Florida: vida y anualidades',
    weight: 10,
    target: 25,
    subdomains: [
      { id: 'XI.A', name: 'Métodos y prácticas de marketing' },
      { id: 'XI.B', name: 'Reemplazo (replacement) de póliza o contrato' },
      { id: 'XI.C', name: 'Contratos individuales' },
      { id: 'XI.D', name: 'Seguro de vida grupal' },
    ],
  },
  {
    id: 'XII',
    name: 'Estatutos y reglas de Florida pertinentes al seguro de salud',
    shortName: 'Florida: salud',
    weight: 10,
    target: 25,
    subdomains: [
      {
        id: 'XII.A',
        name: 'Estándares mínimos de beneficios, coberturas requeridas y disposiciones prohibidas',
      },
      { id: 'XII.B', name: 'Seguro de salud grupal, continuación y conversión' },
      {
        id: 'XII.C',
        name: 'Divulgación, publicidad y prácticas de marketing',
      },
      {
        id: 'XII.D',
        name: 'Pólizas de suplemento de Medicare (Medigap)',
      },
      { id: 'XII.E', name: 'Pólizas de cuidado a largo plazo (LTC)' },
      { id: 'XII.F', name: 'Requisitos para pequeños empleadores' },
      { id: 'XII.G', name: 'Florida Healthy Kids Corporation' },
      { id: 'XII.H', name: 'Requisitos relacionados con el VIH y el sida' },
      { id: 'XII.I', name: 'Tipos de planes (HMO, PPO, EPO, PSO, DMPO)' },
      {
        id: 'XII.J',
        name: 'Pólizas de enfermedades temidas (dread disease)',
      },
    ],
  },
];

export const DOMAIN_BY_ID: Record<DomainId, Domain> = DOMAINS.reduce(
  (acc, domain) => {
    acc[domain.id] = domain;
    return acc;
  },
  {} as Record<DomainId, Domain>,
);

export function subdomainName(subdomainId: string): string {
  for (const domain of DOMAINS) {
    const found = domain.subdomains.find((s) => s.id === subdomainId);
    if (found) return found.name;
  }
  return subdomainId;
}

/** Official exam blueprint: 150 scored items, 2 h 45 min, 70 % to pass. */
export const EXAM_BLUEPRINT = {
  scoredQuestions: 150,
  timeLimitMinutes: 165,
  passingPct: 70,
};
