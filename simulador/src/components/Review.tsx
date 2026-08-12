import { useState } from 'react';
import { DOMAIN_BY_ID, subdomainName } from '../data/domains';
import { OPTION_IDS, QUESTIONS_BY_ID } from '../data/questions';
import { DIFFICULTY_LABELS, T } from '../i18n';
import type { SessionResult, SessionState } from '../types';
import { Explanation } from './Explanation';

type Filter = 'all' | 'correct' | 'incorrect' | 'flagged' | 'unanswered';

interface Props {
  result: SessionResult;
  /** Flags and annotations captured during the session, when still available. */
  session: SessionState | null;
  onBack: () => void;
}

const FILTER_LABELS: Record<Filter, string> = {
  all: T.review.filterAll,
  correct: T.review.filterCorrect,
  incorrect: T.review.filterIncorrect,
  flagged: T.review.filterFlagged,
  unanswered: T.review.filterUnanswered,
};

export function Review({ result, session, onBack }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const items = result.attempts.filter((attempt) => {
    const flagged = session?.answers[attempt.questionId]?.flagged ?? false;
    switch (filter) {
      case 'correct':
        return attempt.correct;
      case 'incorrect':
        return !attempt.correct && attempt.selected !== null;
      case 'unanswered':
        return attempt.selected === null;
      case 'flagged':
        return flagged;
      default:
        return true;
    }
  });

  return (
    <div className="panel">
      <header className="panel-encabezado">
        <h1>{T.review.title}</h1>
        <p className="sutil">{result.label}</p>
      </header>

      <div className="acciones-en-linea" role="group" aria-label="Filtros de revisión">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`boton boton-pequeno ${filter === key ? 'boton-activo' : ''}`}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
          >
            {FILTER_LABELS[key]}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="aviso aviso-vacio">{T.review.empty}</p>
      ) : (
        <ol className="lista-revision">
          {items.map((attempt, index) => {
            const question = QUESTIONS_BY_ID[attempt.questionId];
            const domain = DOMAIN_BY_ID[question.domainId];
            const flagged = session?.answers[attempt.questionId]?.flagged ?? false;
            return (
              <li key={attempt.questionId} className="tarjeta-revision">
                <div className="pregunta-meta">
                  <span className="etiqueta">
                    {T.session.question} {index + 1}
                  </span>
                  <span className="etiqueta">
                    Dominio {domain.id} · {domain.shortName}
                  </span>
                  <span className="etiqueta etiqueta-suave">
                    {subdomainName(question.subdomainId)}
                  </span>
                  <span
                    className={`etiqueta etiqueta-dificultad dificultad-${question.difficulty}`}
                  >
                    {DIFFICULTY_LABELS[question.difficulty]}
                  </span>
                  {flagged && <span className="etiqueta etiqueta-marcada">{T.session.flagged}</span>}
                </div>
                <p className="pregunta-enunciado">{question.stem}</p>
                <ul className="opciones opciones-revision">
                  {OPTION_IDS.map((id) => (
                    <li
                      key={id}
                      className={[
                        'opcion',
                        id === question.correct ? 'opcion-correcta' : '',
                        attempt.selected === id && id !== question.correct
                          ? 'opcion-incorrecta'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <span className="opcion-letra">{id}</span>
                      <span className="opcion-texto">{question.options[id]}</span>
                    </li>
                  ))}
                </ul>
                <Explanation question={question} selected={attempt.selected} />
              </li>
            );
          })}
        </ol>
      )}

      <button type="button" className="boton" onClick={onBack}>
        {T.review.back}
      </button>
    </div>
  );
}
