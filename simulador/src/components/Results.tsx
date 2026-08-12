import { DOMAIN_BY_ID } from '../data/domains';
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER, T } from '../i18n';
import {
  difficultyTallies,
  formatDuration,
  formatPct,
  pct,
  rankedDomains,
} from '../lib/stats';
import type { SessionResult } from '../types';

interface Props {
  result: SessionResult;
  onReview: () => void;
  onBack: () => void;
  onPracticeMissed: () => void;
}

export function Results({ result, onReview, onBack, onPracticeMissed }: Props) {
  const unanswered = result.attempts.filter((a) => a.selected === null).length;
  const incorrect = result.total - result.correctCount - unanswered;
  const byDomain = rankedDomains(result);
  const byDifficulty = difficultyTallies(result.attempts);
  const strong = byDomain.filter((d) => pct(d.tally) >= 80);
  const weak = [...byDomain].reverse().filter((d) => pct(d.tally) < 70);
  const missedCount = result.attempts.filter((a) => !a.correct).length;

  return (
    <div className="panel">
      <header className="panel-encabezado">
        <h1>{T.results.title}</h1>
        <p className="sutil">{result.label}</p>
      </header>

      <section
        className={`resultado-principal ${result.passed ? 'resultado-aprobado' : 'resultado-reprobado'}`}
      >
        <div>
          <span className="metrica-etiqueta">{T.results.score}</span>
          <span className="metrica-valor-grande">{formatPct(result.scorePct)}</span>
          <span className="etiqueta-resultado">
            {result.passed ? T.results.passed : T.results.failed}
          </span>
          <span className="sutil">{T.results.passMark}</span>
        </div>
        <dl className="detalles-resultado">
          <div>
            <dt>{T.results.correct}</dt>
            <dd>{result.correctCount}</dd>
          </div>
          <div>
            <dt>{T.results.incorrect}</dt>
            <dd>{incorrect}</dd>
          </div>
          <div>
            <dt>{T.results.unanswered}</dt>
            <dd>{unanswered}</dd>
          </div>
          <div>
            <dt>{T.results.duration}</dt>
            <dd>{formatDuration(result.durationMs)}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>{T.results.byDomain}</h2>
        <div className="tabla-envoltura">
          <table className="tabla">
            <thead>
              <tr>
                <th scope="col">{T.common.domain}</th>
                <th scope="col">{T.results.correct}</th>
                <th scope="col">{T.dashboard.mastery}</th>
              </tr>
            </thead>
            <tbody>
              {byDomain.map(({ domainId, tally }) => (
                <tr key={domainId}>
                  <th scope="row" className="celda-dominio">
                    <span className="etiqueta-dominio">Dominio {domainId}</span>
                    <span>{DOMAIN_BY_ID[domainId].name}</span>
                  </th>
                  <td>
                    {tally.correct}/{tally.total}
                  </td>
                  <td>
                    <div className="barra">
                      <div className="barra-relleno" style={{ width: `${pct(tally)}%` }} />
                      <span className="barra-texto">{formatPct(pct(tally))}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>{T.results.byDifficulty}</h2>
        <ul className="lista-simple">
          {DIFFICULTY_ORDER.map((difficulty) => {
            const tally = byDifficulty[difficulty];
            return (
              <li key={difficulty}>
                <strong>{DIFFICULTY_LABELS[difficulty]}:</strong>{' '}
                {tally.total === 0
                  ? T.dashboard.noData
                  : `${tally.correct}/${tally.total} · ${formatPct(pct(tally))}`}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="dos-columnas">
        <div>
          <h2>{T.results.strongAreas}</h2>
          {strong.length === 0 ? (
            <p className="sutil">{T.dashboard.noData}</p>
          ) : (
            <ul className="lista-simple">
              {strong.map(({ domainId, tally }) => (
                <li key={domainId}>
                  Dominio {domainId} · {DOMAIN_BY_ID[domainId].shortName} —{' '}
                  {formatPct(pct(tally))}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2>{T.results.weakAreas}</h2>
          {weak.length === 0 ? (
            <p className="sutil">{T.results.noWeakAreas}</p>
          ) : (
            <ul className="lista-simple">
              {weak.map(({ domainId, tally }) => (
                <li key={domainId}>
                  Dominio {domainId} · {DOMAIN_BY_ID[domainId].shortName} —{' '}
                  {formatPct(pct(tally))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="acciones-en-linea">
        <button type="button" className="boton boton-primario" onClick={onReview}>
          {T.results.reviewAnswers}
        </button>
        <button
          type="button"
          className="boton"
          onClick={onPracticeMissed}
          disabled={missedCount === 0}
        >
          {T.results.repeatMissed}
        </button>
        <button type="button" className="boton" onClick={onBack}>
          {T.results.backToDashboard}
        </button>
      </div>
    </div>
  );
}
