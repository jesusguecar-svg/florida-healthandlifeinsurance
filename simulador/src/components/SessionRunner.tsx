import { useEffect, useRef, useState } from 'react';
import { DOMAIN_BY_ID, subdomainName } from '../data/domains';
import { OPTION_IDS, QUESTIONS_BY_ID } from '../data/questions';
import { DIFFICULTY_LABELS, T, fill } from '../i18n';
import { formatClock } from '../lib/stats';
import type { AnswerState, OptionId, SessionState } from '../types';
import { Explanation } from './Explanation';
import { HighlightableText } from './HighlightableText';
import type { HighlightableTextHandle } from './HighlightableText';

interface Props {
  session: SessionState;
  onUpdate: (session: SessionState) => void;
  onFinish: () => void;
  onAbandon: () => void;
}

export function SessionRunner({ session, onUpdate, onFinish, onAbandon }: Props) {
  const [confirming, setConfirming] = useState<'finish' | 'abandon' | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(session.secondsLeft);
  const stemRef = useRef<HighlightableTextHandle>(null);
  const questionEnteredAt = useRef(Date.now());
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const timed = session.config.timeLimitMinutes > 0;
  const questionId = session.questionIds[session.currentIndex];
  const question = QUESTIONS_BY_ID[questionId];
  const answer: AnswerState = session.answers[questionId];
  const domain = DOMAIN_BY_ID[question.domainId];

  const showExplanation =
    session.config.mode === 'practice' &&
    session.config.instantFeedback &&
    answer.revealed;

  /**
   * The countdown ticks in local state so the session (and localStorage) is not
   * rewritten every second; it is checkpointed into the session every 15 s.
   */
  useEffect(() => {
    if (!timed) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        const next = Math.max(0, current - 1);
        if (next === 0 || next % 15 === 0) {
          onUpdate({ ...sessionRef.current, secondsLeft: next });
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timed, onUpdate]);

  useEffect(() => {
    if (timed && secondsLeft <= 0 && !timeUp) {
      setTimeUp(true);
    }
  }, [timed, secondsLeft, timeUp]);

  useEffect(() => {
    questionEnteredAt.current = Date.now();
  }, [session.currentIndex]);

  function patchAnswer(patch: Partial<AnswerState>) {
    onUpdate({
      ...session,
      answers: {
        ...session.answers,
        [questionId]: { ...answer, ...patch },
      },
    });
  }

  function goTo(index: number) {
    const elapsed = Date.now() - questionEnteredAt.current;
    const clamped = Math.max(0, Math.min(index, session.questionIds.length - 1));
    onUpdate({
      ...session,
      currentIndex: clamped,
      answers: {
        ...session.answers,
        [questionId]: { ...answer, timeSpentMs: answer.timeSpentMs + elapsed },
      },
    });
  }

  function selectOption(option: OptionId) {
    if (showExplanation) return;
    const revealAutomatically =
      session.config.mode === 'practice' && session.config.instantFeedback;
    patchAnswer({
      selected: option,
      revealed: revealAutomatically ? answer.revealed : false,
    });
  }

  function toggleStrike(option: OptionId) {
    patchAnswer({
      struck: answer.struck.includes(option)
        ? answer.struck.filter((id) => id !== option)
        : [...answer.struck, option],
    });
  }

  function addHighlight() {
    const range = stemRef.current?.getSelectionRange();
    if (!range) return;
    patchAnswer({ highlights: [...answer.highlights, range] });
  }

  const answeredCount = session.questionIds.filter(
    (id) => session.answers[id].selected !== null,
  ).length;
  const unanswered = session.questionIds.length - answeredCount;

  return (
    <div className="panel sesion">
      <header className="sesion-encabezado">
        <div>
          <h1 className="sesion-titulo">{session.config.label}</h1>
          <p className="sutil">
            {T.session.question} {session.currentIndex + 1} {T.session.of}{' '}
            {session.questionIds.length}
          </p>
        </div>
        <div className="sesion-estado">
          <div
            className={`reloj ${timed && secondsLeft <= 300 ? 'reloj-alerta' : ''}`}
            aria-label={T.a11y.timer}
          >
            <span className="metrica-etiqueta">
              {timed ? T.session.timeLeft : T.session.noTimer}
            </span>
            {timed && <span className="metrica-valor">{formatClock(secondsLeft)}</span>}
          </div>
          <div
            className="progreso"
            role="progressbar"
            aria-label={T.a11y.progress}
            aria-valuemin={0}
            aria-valuemax={session.questionIds.length}
            aria-valuenow={answeredCount}
          >
            <div
              className="progreso-relleno"
              style={{
                width: `${(answeredCount / session.questionIds.length) * 100}%`,
              }}
            />
            <span className="progreso-texto">
              {answeredCount}/{session.questionIds.length}
            </span>
          </div>
        </div>
      </header>

      <div className="sesion-cuerpo">
        <main className="pregunta">
          <div className="pregunta-meta">
            <span className="etiqueta">Dominio {domain.id} · {domain.shortName}</span>
            <span className="etiqueta etiqueta-suave">
              {subdomainName(question.subdomainId)}
            </span>
            <span className={`etiqueta etiqueta-dificultad dificultad-${question.difficulty}`}>
              {DIFFICULTY_LABELS[question.difficulty]}
            </span>
          </div>

          <p className="pregunta-enunciado">
            <HighlightableText
              ref={stemRef}
              text={question.stem}
              highlights={answer.highlights}
            />
          </p>

          <div className="herramientas">
            <button
              type="button"
              className={`boton boton-pequeno ${answer.flagged ? 'boton-activo' : ''}`}
              onClick={() => patchAnswer({ flagged: !answer.flagged })}
              aria-label={answer.flagged ? T.a11y.unflagQuestion : T.a11y.flagQuestion}
              aria-pressed={answer.flagged}
            >
              {answer.flagged ? T.session.unflag : T.session.flag}
            </button>
            <button
              type="button"
              className="boton boton-pequeno"
              // Prevent the button from stealing focus, which would drop the
              // text selection before the click handler can read it.
              onMouseDown={(event) => event.preventDefault()}
              onClick={addHighlight}
            >
              {T.session.highlight}
            </button>
            <button
              type="button"
              className="boton boton-pequeno"
              onClick={() => patchAnswer({ highlights: [] })}
              disabled={answer.highlights.length === 0}
            >
              {T.session.clearHighlights}
            </button>
            <span className="sutil">{T.session.highlightHelp}</span>
          </div>

          <ul className="opciones">
            {OPTION_IDS.map((id) => {
              const struck = answer.struck.includes(id);
              const chosen = answer.selected === id;
              const revealCorrect = showExplanation && id === question.correct;
              const revealWrong = showExplanation && chosen && id !== question.correct;
              return (
                <li key={id}>
                  <div
                    className={[
                      'opcion',
                      chosen ? 'opcion-elegida' : '',
                      struck ? 'opcion-tachada' : '',
                      revealCorrect ? 'opcion-correcta' : '',
                      revealWrong ? 'opcion-incorrecta' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <label className="opcion-etiqueta">
                      <input
                        type="radio"
                        name={`pregunta-${question.id}`}
                        checked={chosen}
                        onChange={() => selectOption(id)}
                        disabled={showExplanation}
                        aria-label={fill(T.a11y.optionLabel, { id })}
                      />
                      <span className="opcion-letra">{id}</span>
                      <span className="opcion-texto">{question.options[id]}</span>
                    </label>
                    <button
                      type="button"
                      className="boton boton-icono"
                      onClick={() => toggleStrike(id)}
                      aria-label={fill(
                        struck ? T.a11y.unstrikeOption : T.a11y.strikeOption,
                        { id },
                      )}
                      aria-pressed={struck}
                    >
                      {struck ? T.session.unstrike : T.session.strike}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="sutil">{T.session.strikeHelp}</p>

          {session.config.mode === 'practice' && session.config.instantFeedback && (
            <button
              type="button"
              className="boton boton-primario"
              onClick={() => patchAnswer({ revealed: true })}
              disabled={answer.selected === null || answer.revealed}
            >
              {T.session.submitAnswer}
            </button>
          )}

          {showExplanation && (
            <Explanation question={question} selected={answer.selected} />
          )}

          <nav className="navegacion-pregunta" aria-label="Navegación entre preguntas">
            <button
              type="button"
              className="boton"
              onClick={() => goTo(session.currentIndex - 1)}
              disabled={session.currentIndex === 0}
            >
              {T.session.previous}
            </button>
            <button
              type="button"
              className="boton"
              onClick={() => goTo(session.currentIndex + 1)}
              disabled={session.currentIndex === session.questionIds.length - 1}
            >
              {T.session.next}
            </button>
            <button
              type="button"
              className="boton boton-primario"
              onClick={() => setConfirming('finish')}
            >
              {T.session.finish}
            </button>
            <button
              type="button"
              className="boton boton-peligro"
              onClick={() => setConfirming('abandon')}
            >
              {T.session.abandon}
            </button>
          </nav>
        </main>

        <aside className="navegador" aria-label={T.session.navigator}>
          <h2>{T.session.navigator}</h2>
          <ol className="cuadricula-navegador">
            {session.questionIds.map((id, index) => {
              const state = session.answers[id];
              const classes = [
                'celda-navegador',
                state.selected !== null ? 'celda-contestada' : '',
                state.flagged ? 'celda-marcada' : '',
                index === session.currentIndex ? 'celda-actual' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={classes}
                    onClick={() => goTo(index)}
                    aria-label={fill(T.a11y.questionNav, { n: index + 1 })}
                    aria-current={index === session.currentIndex ? 'true' : undefined}
                  >
                    {index + 1}
                  </button>
                </li>
              );
            })}
          </ol>
          <ul className="leyenda">
            <li>
              <span className="muestra celda-contestada" /> {T.session.legendAnswered}
            </li>
            <li>
              <span className="muestra" /> {T.session.legendUnanswered}
            </li>
            <li>
              <span className="muestra celda-marcada" /> {T.session.legendFlagged}
            </li>
            <li>
              <span className="muestra celda-actual" /> {T.session.legendCurrent}
            </li>
          </ul>
        </aside>
      </div>

      {timeUp && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-tiempo">
          <div className="modal-contenido">
            <h2 id="titulo-tiempo">{T.session.timeUpTitle}</h2>
            <p>{T.session.timeUpBody}</p>
            <button type="button" className="boton boton-primario" onClick={onFinish}>
              {T.results.title}
            </button>
          </div>
        </div>
      )}

      {confirming && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-confirmar">
          <div className="modal-contenido">
            <h2 id="titulo-confirmar">
              {confirming === 'finish'
                ? T.session.confirmFinishTitle
                : T.session.confirmAbandonTitle}
            </h2>
            <p>
              {confirming === 'finish'
                ? unanswered > 0
                  ? fill(T.session.confirmFinishBody, { n: unanswered })
                  : T.session.confirmFinishBodyAll
                : T.session.confirmAbandonBody}
            </p>
            <div className="acciones-en-linea">
              <button
                type="button"
                className={`boton ${confirming === 'abandon' ? 'boton-peligro' : 'boton-primario'}`}
                onClick={() => {
                  setConfirming(null);
                  if (confirming === 'finish') onFinish();
                  else onAbandon();
                }}
              >
                {confirming === 'finish' ? T.session.confirmFinish : T.session.confirmAbandon}
              </button>
              <button type="button" className="boton" onClick={() => setConfirming(null)}>
                {T.session.keepGoing}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
