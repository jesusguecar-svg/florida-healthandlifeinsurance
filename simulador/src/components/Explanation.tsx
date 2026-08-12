import { OPTION_IDS } from '../data/questions';
import { T } from '../i18n';
import type { OptionId, Question } from '../types';

interface Props {
  question: Question;
  selected: OptionId | null;
}

export function Explanation({ question, selected }: Props) {
  const isCorrect = selected === question.correct;
  const wrongOptions = OPTION_IDS.filter((id) => id !== question.correct);

  return (
    <section
      className={`explicacion ${isCorrect ? 'explicacion-correcta' : 'explicacion-incorrecta'}`}
      aria-live="polite"
    >
      <h3 className="explicacion-titulo">
        {selected === null
          ? T.session.unansweredNotice
          : isCorrect
            ? T.session.correct
            : T.session.incorrect}
      </h3>
      <p className="explicacion-resumen">
        {selected !== null && (
          <>
            <strong>{T.session.yourAnswer}:</strong> {selected}.{' '}
          </>
        )}
        <strong>{T.session.correctAnswer}:</strong> {question.correct}.
      </p>

      <h4>{T.session.explanation}</h4>
      <p>{question.explanations[question.correct]}</p>

      <h4>{T.session.whyWrong}</h4>
      <ul className="lista-explicaciones">
        {wrongOptions.map((id) => (
          <li key={id} className={selected === id ? 'explicacion-elegida' : undefined}>
            <strong>{id}.</strong> {question.explanations[id]}
          </li>
        ))}
      </ul>

      {question.reference && (
        <p className="sutil">
          <strong>{T.session.reference}:</strong> {question.reference}
        </p>
      )}
    </section>
  );
}
