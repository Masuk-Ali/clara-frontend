import { useState } from 'react';

export default function GapFilling({ exercise = {} }) {
  const gaps = exercise.gaps || [];
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const gapById = new Map(gaps.map((gap) => [String(gap.id), gap]));
  const segments = (exercise.gapPassage || '').split(/(\{\{[^}]+\}\})/g);
  const allAnswered = gaps.every((gap) => answers[gap.id]?.trim());

  const checkAnswers = () => {
    if (allAnswered) setChecked(true);
  };

  const reset = () => {
    setAnswers({});
    setChecked(false);
  };

  const renderGap = (gap, index) => {
    const acceptedAnswers = (Array.isArray(gap.answers) ? gap.answers : [gap.answer])
      .filter(Boolean)
      .map((answer) => answer.trim().toLowerCase());
    const isCorrect = acceptedAnswers.includes((answers[gap.id] || '').trim().toLowerCase());
    const correctAnswer = gap.answer || gap.answers?.[0];

    return (
      <span key={gap.id} className="inline-flex flex-col align-middle mx-1">
        {gap.options?.length ? (
          <select
            aria-label={`Gap ${index + 1}`}
            value={answers[gap.id] || ''}
            disabled={checked}
            onChange={(event) => setAnswers((current) => ({ ...current, [gap.id]: event.target.value }))}
            className="min-w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          >
            <option value="">Choose...</option>
            {gap.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        ) : (
          <input
            aria-label={`Gap ${index + 1}`}
            type="text"
            value={answers[gap.id] || ''}
            disabled={checked}
            onChange={(event) => setAnswers((current) => ({ ...current, [gap.id]: event.target.value }))}
            className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />
        )}
        {gap.clue && !checked && <span className="mt-1 text-xs text-gray-500">{gap.clue}</span>}
        {checked && (
          <span className={`mt-1 text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct' : `Incorrect. Correct answer: ${correctAnswer}`}
          </span>
        )}
      </span>
    );
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      {exercise.title && <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{exercise.title}</h2>}
      {exercise.originalPassage && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">📖 Original Passage</h3>
          <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-100">{exercise.originalPassage}</p>
        </div>
      )}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">✏️ Fill in the Blanks</h3>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-100">
          {segments.map((segment, index) => {
            const match = segment.match(/^\{\{([^}]+)\}\}$/);
            const gap = match && gapById.get(match[1]);
            return gap ? renderGap(gap, gaps.indexOf(gap)) : segment;
          })}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-gray-600 px-5 py-2 font-medium text-white transition hover:bg-gray-700"
        >
          Reset
        </button>
        {!checked && (
          <button
            type="button"
            onClick={checkAnswers}
            disabled={!allAnswered}
            className={`rounded-lg px-5 py-2 font-medium transition ${allAnswered ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
          >
            Check Answers
          </button>
        )}
      </div>
    </section>
  );
}