import { useState } from 'react';
import { DOMAINS } from '../data/domains';
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER, T } from '../i18n';
import {
  allAttempts,
  difficultyTallies,
  domainTallies,
  formatDate,
  formatDuration,
  formatPct,
  overallTally,
  pct,
} from '../lib/stats';
import type { StoredProgress } from '../types';

interface Props {
  progress: StoredProgress;
  onReset: () => void;
}

export function Analytics({ progress, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);
  const attempts = allAttempts(progress);
  const overall = overallTally(progress);
  const byDomain = domainTallies(attempts);
  const byDifficulty = difficultyTallies(attempts);
  const sessions = [...progress.results].reverse();

  return (
    <div className="panel">
      <header className="panel-encabezado">
        <h1>{T.analytics.title}</h1>
        <p className="sutil">{T.analytics.subtitle}</p>
      </header>

      {attempts.length === 0 ? (
        <p className="aviso aviso-vacio">{T.analytics.empty}</p>
      ) : (
        <>
          <section className="tarjetas-metricas">
            <article className="tarjeta-metrica">
              <span className="metrica-etiqueta">{T.analytics.overall}</span>
              <span className="metrica-valor">{formatPct(pct(overall))}</span>
            </article>
            <article className="tarjeta-metrica">
              <span className="metrica-etiqueta">{T.analytics.totalAnswered}</span>
              <span className="metrica-valor">{overall.total}</span>
            </article>
            <article className="tarjeta-metrica">
              <span className="metrica-etiqueta">{T.analytics.totalSessions}</span>
              <span className="metrica-valor">{progress.results.length}</span>
            </article>
          </section>

          <section>
            <h2>{T.analytics.byDomain}</h2>
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
                  {DOMAINS.map((domain) => {
                    const tally = byDomain[domain.id];
                    return (
                      <tr key={domain.id}>
                        <th scope="row" className="celda-dominio">
                          <span className="etiqueta-dominio">Dominio {domain.id}</span>
                          <span>{domain.name}</span>
                        </th>
                        <td>
                          {tally.total === 0
                            ? T.dashboard.noData
                            : `${tally.correct}/${tally.total}`}
                        </td>
                        <td>
                          {tally.total === 0 ? (
                            <span className="sutil">{T.dashboard.noData}</span>
                          ) : (
                            <div className="barra">
                              <div
                                className="barra-relleno"
                                style={{ width: `${pct(tally)}%` }}
                              />
                              <span className="barra-texto">{formatPct(pct(tally))}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>{T.analytics.byDifficulty}</h2>
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

          <section>
            <h2>{T.analytics.lastSessions}</h2>
            <div className="tabla-envoltura">
              <table className="tabla">
                <thead>
                  <tr>
                    <th scope="col">{T.analytics.date}</th>
                    <th scope="col">{T.analytics.session}</th>
                    <th scope="col">{T.results.duration}</th>
                    <th scope="col">{T.analytics.result}</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td>{formatDate(session.finishedAt)}</td>
                      <td>{session.label}</td>
                      <td>{formatDuration(session.durationMs)}</td>
                      <td>
                        {session.correctCount}/{session.total} ·{' '}
                        {formatPct(session.scorePct)}{' '}
                        <span
                          className={
                            session.passed ? 'texto-aprobado' : 'texto-reprobado'
                          }
                        >
                          ({session.passed ? T.results.passed : T.results.failed})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <section>
        <h2>{T.analytics.resetTitle}</h2>
        <p className="sutil">{T.analytics.resetBody}</p>
        {confirming ? (
          <div className="acciones-en-linea">
            <button
              type="button"
              className="boton boton-peligro"
              onClick={() => {
                setConfirming(false);
                onReset();
              }}
            >
              {T.analytics.confirmReset}
            </button>
            <button type="button" className="boton" onClick={() => setConfirming(false)}>
              {T.analytics.cancel}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="boton boton-peligro"
            onClick={() => setConfirming(true)}
            disabled={progress.results.length === 0}
          >
            {T.analytics.reset}
          </button>
        )}
      </section>
    </div>
  );
}
