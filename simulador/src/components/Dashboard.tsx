import { DOMAINS, EXAM_BLUEPRINT } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { T } from '../i18n';
import { formatPct, pct } from '../lib/stats';
import type { Tally } from '../lib/stats';
import type { DomainId, SessionState, StoredProgress } from '../types';

interface Props {
  progress: StoredProgress;
  activeSession: SessionState | null;
  domainTallies: Record<DomainId, Tally>;
  coverage: Record<DomainId, { seen: number; total: number }>;
  overall: Tally;
  missedCount: number;
  onStartExam: () => void;
  onOpenConfig: () => void;
  onQuickPractice: () => void;
  onReviewMissed: () => void;
  onPracticeDomain: (domainId: DomainId) => void;
  onResumeSession: () => void;
}

export function Dashboard({
  progress,
  activeSession,
  domainTallies,
  coverage,
  overall,
  missedCount,
  onStartExam,
  onOpenConfig,
  onQuickPractice,
  onReviewMissed,
  onPracticeDomain,
  onResumeSession,
}: Props) {
  const hasData = overall.total > 0;

  return (
    <div className="panel">
      <header className="panel-encabezado">
        <h1>{T.dashboard.title}</h1>
        <p className="sutil">{T.dashboard.welcome}</p>
      </header>

      {activeSession && (
        <div className="aviso aviso-info">
          <p>
            Tienes una sesión en curso: <strong>{activeSession.config.label}</strong> (
            {activeSession.questionIds.length} {T.common.questions}).
          </p>
          <button type="button" className="boton boton-primario" onClick={onResumeSession}>
            {T.dashboard.resumeSession}
          </button>
        </div>
      )}

      <section className="tarjetas-metricas" aria-label="Resumen de progreso">
        <article className="tarjeta-metrica">
          <span className="metrica-etiqueta">{T.dashboard.bankSize}</span>
          <span className="metrica-valor">{QUESTIONS.length}</span>
        </article>
        <article className="tarjeta-metrica">
          <span className="metrica-etiqueta">{T.dashboard.answered}</span>
          <span className="metrica-valor">{overall.total}</span>
        </article>
        <article className="tarjeta-metrica">
          <span className="metrica-etiqueta">{T.dashboard.accuracy}</span>
          <span className="metrica-valor">
            {hasData ? formatPct(pct(overall)) : T.dashboard.noData}
          </span>
        </article>
        <article className="tarjeta-metrica">
          <span className="metrica-etiqueta">{T.dashboard.sessions}</span>
          <span className="metrica-valor">{progress.results.length}</span>
        </article>
      </section>

      <section className="acciones-principales" aria-label="Acciones de estudio">
        <button type="button" className="boton boton-primario" onClick={onStartExam}>
          {T.dashboard.startExam}
        </button>
        <button type="button" className="boton" onClick={onQuickPractice}>
          {T.dashboard.quickPractice}
        </button>
        <button type="button" className="boton" onClick={onOpenConfig}>
          {T.dashboard.startPractice}
        </button>
        <button
          type="button"
          className="boton"
          onClick={onReviewMissed}
          disabled={missedCount === 0}
          title={
            missedCount === 0
              ? 'No tienes preguntas falladas pendientes de repaso.'
              : undefined
          }
        >
          {T.dashboard.reviewMissed}
          {missedCount > 0 ? ` (${missedCount})` : ''}
        </button>
      </section>

      <p className="sutil">
        <strong>{T.dashboard.examBlueprint}:</strong> {T.dashboard.examBlueprintDetail} El
        simulacro completo de esta plataforma usa {EXAM_BLUEPRINT.scoredQuestions} preguntas
        distribuidas según el peso oficial de cada dominio.
      </p>

      {!hasData && <p className="aviso aviso-vacio">{T.dashboard.emptyState}</p>}

      <section aria-label={T.dashboard.domainProgress}>
        <h2>{T.dashboard.domainProgress}</h2>
        <div className="tabla-envoltura">
          <table className="tabla">
            <thead>
              <tr>
                <th scope="col">{T.common.domain}</th>
                <th scope="col">{T.dashboard.weight}</th>
                <th scope="col">{T.dashboard.items}</th>
                <th scope="col">{T.dashboard.mastery}</th>
                <th scope="col">{T.dashboard.coverage}</th>
                <th scope="col">
                  <span className="visualmente-oculto">Acción</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {DOMAINS.map((domain) => {
                const tally = domainTallies[domain.id];
                const cov = coverage[domain.id];
                const coveragePct = cov.total === 0 ? 0 : (cov.seen / cov.total) * 100;
                return (
                  <tr key={domain.id}>
                    <th scope="row" className="celda-dominio">
                      <span className="etiqueta-dominio">Dominio {domain.id}</span>
                      <span>{domain.name}</span>
                    </th>
                    <td>{domain.weight} %</td>
                    <td>{cov.total}</td>
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
                    <td>
                      <div className="barra barra-secundaria">
                        <div
                          className="barra-relleno"
                          style={{ width: `${coveragePct}%` }}
                        />
                        <span className="barra-texto">
                          {cov.seen}/{cov.total}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="boton boton-pequeno"
                        onClick={() => onPracticeDomain(domain.id)}
                      >
                        {T.dashboard.practiceDomain}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
