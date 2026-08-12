import { useMemo, useState } from 'react';
import { DOMAINS } from '../data/domains';
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER, T, fill } from '../i18n';
import { filterQuestions } from '../lib/session';
import type {
  Difficulty,
  DomainId,
  SessionConfig,
  SessionMode,
  StoredProgress,
} from '../types';

interface Props {
  progress: StoredProgress;
  hasActiveSession: boolean;
  onStart: (config: SessionConfig) => void;
  onCancel: () => void;
}

export function PracticeConfig({ progress, hasActiveSession, onStart, onCancel }: Props) {
  const [mode, setMode] = useState<SessionMode>('practice');
  const [domainIds, setDomainIds] = useState<DomainId[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([...DIFFICULTY_ORDER]);
  const [questionCount, setQuestionCount] = useState(25);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(0);
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [onlyMissed, setOnlyMissed] = useState(false);

  const available = useMemo(
    () => filterQuestions({ domainIds, difficulties, onlyMissed }, progress).length,
    [domainIds, difficulties, onlyMissed, progress],
  );

  const noDifficulty = difficulties.length === 0;
  const canStart = available > 0 && !noDifficulty;

  function toggleDomain(id: DomainId) {
    setDomainIds((current) =>
      current.includes(id) ? current.filter((d) => d !== id) : [...current, id],
    );
  }

  function toggleDifficulty(value: Difficulty) {
    setDifficulties((current) =>
      current.includes(value)
        ? current.filter((d) => d !== value)
        : [...current, value],
    );
  }

  function buildLabel(): string {
    if (mode === 'exam') return 'Simulacro de examen personalizado';
    if (onlyMissed) return 'Repaso de preguntas falladas';
    if (domainIds.length === 1) {
      const domain = DOMAINS.find((d) => d.id === domainIds[0]);
      return `Práctica del Dominio ${domainIds[0]}: ${domain?.shortName ?? ''}`.trim();
    }
    return 'Práctica personalizada';
  }

  function handleStart() {
    if (!canStart) return;
    onStart({
      mode,
      domainIds,
      difficulties,
      questionCount: Math.min(questionCount, available),
      timeLimitMinutes: mode === 'exam' && timeLimitMinutes === 0 ? 165 : timeLimitMinutes,
      instantFeedback: mode === 'practice' ? instantFeedback : false,
      onlyMissed,
      label: buildLabel(),
    });
  }

  return (
    <div className="panel">
      <header className="panel-encabezado">
        <h1>{T.config.title}</h1>
        <p className="sutil">{T.config.subtitle}</p>
      </header>

      {hasActiveSession && (
        <p className="aviso aviso-alerta">{T.config.activeSessionWarning}</p>
      )}

      <fieldset className="grupo">
        <legend>{T.config.mode}</legend>
        <label className="opcion-radio">
          <input
            type="radio"
            name="modo"
            checked={mode === 'practice'}
            onChange={() => setMode('practice')}
          />
          <span>
            <strong>{T.config.modePractice}</strong>
            <span className="sutil"> — {T.config.modePracticeHelp}</span>
          </span>
        </label>
        <label className="opcion-radio">
          <input
            type="radio"
            name="modo"
            checked={mode === 'exam'}
            onChange={() => setMode('exam')}
          />
          <span>
            <strong>{T.config.modeExam}</strong>
            <span className="sutil"> — {T.config.modeExamHelp}</span>
          </span>
        </label>
      </fieldset>

      <fieldset className="grupo">
        <legend>{T.config.domains}</legend>
        <div className="acciones-en-linea">
          <button
            type="button"
            className="boton boton-pequeno"
            onClick={() => setDomainIds(DOMAINS.map((d) => d.id))}
          >
            {T.config.selectAll}
          </button>
          <button
            type="button"
            className="boton boton-pequeno"
            onClick={() => setDomainIds([])}
          >
            {T.config.clearAll}
          </button>
          <span className="sutil">
            {domainIds.length === 0
              ? `${T.common.allDomains} · ${T.config.proportional}`
              : `${domainIds.length} seleccionados`}
          </span>
        </div>
        <div className="lista-dominios">
          {DOMAINS.map((domain) => (
            <label key={domain.id} className="opcion-casilla">
              <input
                type="checkbox"
                checked={domainIds.includes(domain.id)}
                onChange={() => toggleDomain(domain.id)}
              />
              <span>
                <strong>Dominio {domain.id}</strong> · {domain.name}{' '}
                <span className="sutil">({domain.weight} %)</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grupo">
        <legend>{T.config.difficulty}</legend>
        <div className="acciones-en-linea">
          {DIFFICULTY_ORDER.map((value) => (
            <label key={value} className="opcion-casilla">
              <input
                type="checkbox"
                checked={difficulties.includes(value)}
                onChange={() => toggleDifficulty(value)}
              />
              <span>{DIFFICULTY_LABELS[value]}</span>
            </label>
          ))}
        </div>
        {noDifficulty && <p className="aviso aviso-alerta">{T.config.warningNoDifficulty}</p>}
      </fieldset>

      <fieldset className="grupo">
        <legend>Opciones de la sesión</legend>
        <label className="campo">
          <span>{T.config.questionCount}</span>
          <input
            type="number"
            min={1}
            max={250}
            value={questionCount}
            onChange={(event) =>
              setQuestionCount(Math.max(1, Number(event.target.value) || 1))
            }
          />
        </label>
        <label className="campo">
          <span>{T.config.timeLimit}</span>
          <input
            type="number"
            min={0}
            max={300}
            value={timeLimitMinutes}
            onChange={(event) =>
              setTimeLimitMinutes(Math.max(0, Number(event.target.value) || 0))
            }
          />
          <span className="sutil">
            {timeLimitMinutes === 0 ? T.config.noTimeLimit : `${timeLimitMinutes} ${T.common.minutes}`}
          </span>
        </label>
        {mode === 'practice' && (
          <label className="opcion-casilla">
            <input
              type="checkbox"
              checked={instantFeedback}
              onChange={(event) => setInstantFeedback(event.target.checked)}
            />
            <span>{T.config.instantFeedback}</span>
          </label>
        )}
        <label className="opcion-casilla">
          <input
            type="checkbox"
            checked={onlyMissed}
            onChange={(event) => setOnlyMissed(event.target.checked)}
          />
          <span>{T.config.onlyMissed}</span>
        </label>
      </fieldset>

      <p className="sutil">
        {T.config.available}: <strong>{available}</strong>
      </p>
      {available === 0 && !noDifficulty && (
        <p className="aviso aviso-alerta">{T.config.warningNoQuestions}</p>
      )}
      {available > 0 && available < questionCount && (
        <p className="aviso aviso-info">{fill(T.config.warningFewer, { n: available })}</p>
      )}

      <div className="acciones-en-linea">
        <button
          type="button"
          className="boton boton-primario"
          onClick={handleStart}
          disabled={!canStart}
        >
          {T.config.start}
        </button>
        <button type="button" className="boton" onClick={onCancel}>
          {T.config.cancel}
        </button>
      </div>
    </div>
  );
}
