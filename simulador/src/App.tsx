import { useCallback, useMemo, useState } from 'react';
import { Analytics } from './components/Analytics';
import { Dashboard } from './components/Dashboard';
import { PracticeConfig } from './components/PracticeConfig';
import { Results } from './components/Results';
import { Review } from './components/Review';
import { SessionRunner } from './components/SessionRunner';
import { T } from './i18n';
import {
  createSession,
  domainPracticeConfig,
  examConfig,
  gradeSession,
  missedPracticeConfig,
  missedQuestionIds,
  quickPracticeConfig,
} from './lib/session';
import {
  clearProgress,
  loadProgress,
  recordResult,
  saveProgress,
  setActiveSession,
} from './lib/storage';
import {
  allAttempts,
  coverageByDomain,
  domainTallies,
  overallTally,
} from './lib/stats';
import { questionsByDomain } from './data/questions';
import type {
  DomainId,
  SessionConfig,
  SessionResult,
  SessionState,
  StoredProgress,
} from './types';

type View = 'dashboard' | 'config' | 'session' | 'results' | 'review' | 'analytics';

export default function App() {
  const [progress, setProgress] = useState<StoredProgress>(() => loadProgress());
  const [view, setView] = useState<View>('dashboard');
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [reviewSession, setReviewSession] = useState<SessionState | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  const persist = useCallback((next: StoredProgress) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const activeSession = progress.activeSession;

  const attempts = useMemo(() => allAttempts(progress), [progress]);
  const tallies = useMemo(() => domainTallies(attempts), [attempts]);
  const coverage = useMemo(() => coverageByDomain(progress), [progress]);
  const overall = useMemo(() => overallTally(progress), [progress]);
  const missed = useMemo(() => missedQuestionIds(progress), [progress]);

  const startSession = useCallback(
    (config: SessionConfig) => {
      const session = createSession(config, progress);
      if (!session) {
        setStartError(T.config.warningNoQuestions);
        setView('config');
        return;
      }
      setStartError(null);
      persist(setActiveSession(progress, session));
      setView('session');
    },
    [persist, progress],
  );

  const updateSession = useCallback(
    (session: SessionState) => {
      persist(setActiveSession(progress, session));
    },
    [persist, progress],
  );

  const finishSession = useCallback(() => {
    if (!activeSession) return;
    const result = gradeSession(activeSession);
    setReviewSession(activeSession);
    setLastResult(result);
    persist(recordResult(progress, result));
    setView('results');
  }, [activeSession, persist, progress]);

  const abandonSession = useCallback(() => {
    persist(setActiveSession(progress, null));
    setView('dashboard');
  }, [persist, progress]);

  function handleReset() {
    clearProgress();
    const empty: StoredProgress = { results: [], history: {}, activeSession: null };
    setProgress(empty);
    setLastResult(null);
    setReviewSession(null);
    setView('dashboard');
  }

  function practiceDomain(domainId: DomainId) {
    const count = Math.min(20, questionsByDomain(domainId).length);
    startSession(domainPracticeConfig(domainId, count));
  }

  function practiceMissedFromResult() {
    if (!lastResult) return;
    startSession({
      ...missedPracticeConfig(
        lastResult.attempts.filter((a) => !a.correct).length || 10,
      ),
      label: 'Repaso de las falladas de la última sesión',
    });
  }

  const navItems: { id: View; label: string; disabled?: boolean }[] = [
    { id: 'dashboard', label: T.nav.dashboard },
    { id: 'config', label: T.nav.practice },
    { id: 'session', label: T.nav.session, disabled: !activeSession },
    { id: 'results', label: T.nav.results, disabled: !lastResult },
    { id: 'analytics', label: T.nav.analytics },
  ];

  return (
    <div className="aplicacion">
      <header className="cabecera">
        <div>
          <p className="marca">{T.appName}</p>
          <p className="sutil">{T.appSubtitle}</p>
        </div>
        <nav aria-label={T.a11y.mainNav} className="navegacion">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`boton boton-navegacion ${view === item.id ? 'boton-activo' : ''}`}
              onClick={() => setView(item.id)}
              disabled={item.disabled}
              aria-current={view === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="contenido">
        {view === 'dashboard' && (
          <Dashboard
            progress={progress}
            activeSession={activeSession}
            domainTallies={tallies}
            coverage={coverage}
            overall={overall}
            missedCount={missed.length}
            onStartExam={() => startSession(examConfig())}
            onQuickPractice={() => startSession(quickPracticeConfig())}
            onOpenConfig={() => setView('config')}
            onReviewMissed={() =>
              startSession(missedPracticeConfig(Math.min(25, missed.length)))
            }
            onPracticeDomain={practiceDomain}
            onResumeSession={() => setView('session')}
          />
        )}

        {view === 'config' && (
          <>
            {startError && <p className="aviso aviso-alerta">{startError}</p>}
            <PracticeConfig
              progress={progress}
              hasActiveSession={activeSession !== null}
              onStart={startSession}
              onCancel={() => setView('dashboard')}
            />
          </>
        )}

        {view === 'session' &&
          (activeSession ? (
            <SessionRunner
              session={activeSession}
              onUpdate={updateSession}
              onFinish={finishSession}
              onAbandon={abandonSession}
            />
          ) : (
            <p className="aviso aviso-vacio">
              No hay ninguna sesión en curso. Configura una práctica o inicia un simulacro
              desde el panel principal.
            </p>
          ))}

        {view === 'results' &&
          (lastResult ? (
            <Results
              result={lastResult}
              onReview={() => setView('review')}
              onBack={() => setView('dashboard')}
              onPracticeMissed={practiceMissedFromResult}
            />
          ) : (
            <p className="aviso aviso-vacio">
              Todavía no hay resultados. Completa una sesión para verlos aquí.
            </p>
          ))}

        {view === 'review' &&
          (lastResult ? (
            <Review
              result={lastResult}
              session={reviewSession}
              onBack={() => setView('results')}
            />
          ) : (
            <p className="aviso aviso-vacio">
              Todavía no hay respuestas que revisar.
            </p>
          ))}

        {view === 'analytics' && <Analytics progress={progress} onReset={handleReset} />}
      </main>

      <footer className="pie">
        <p className="sutil">
          Contenido educativo basado en los Esquemas de Contenido del Examen de Seguros de
          Florida vigentes a partir del 1 de enero de 2026 y en los expedientes de
          investigación en español del repositorio. Esta plataforma es material de estudio y
          no constituye asesoría legal.
        </p>
      </footer>
    </div>
  );
}
