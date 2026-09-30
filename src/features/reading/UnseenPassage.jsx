import { useState } from 'react';

export default function UnseenPassage({ exercise = {}, onEvaluateSummary }) {
  const informationTransfer = exercise.informationTransfer || {};
  const summaryWriting = exercise.summaryWriting || {};
  const columns = informationTransfer.columns || [];
  const rows = informationTransfer.rows || [];
  const blankCells = rows.flatMap((row) => row.cells || []).filter((cell) => cell.input);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryFeedback, setSummaryFeedback] = useState('');
  const [evaluationError, setEvaluationError] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const allAnswered = blankCells.every((cell) => answers[cell.input.id]?.trim());

  const checkAnswers = () => {
    if (allAnswered) setChecked(true);
  };

  const resetInformationTransfer = () => {
    setAnswers({});
    setChecked(false);
  };

  const resetSummary = () => {
    setSummary('');
    setSummaryFeedback('');
    setEvaluationError('');
  };

  const evaluateSummary = async () => {
    const trimmedSummary = summary.trim();
    if (!trimmedSummary) return;

    setEvaluating(true);
    setEvaluationError('');

    try {
      if (onEvaluateSummary) {
        const result = await onEvaluateSummary({
          passage: exercise.passage,
          summary: trimmedSummary,
          requirements: summaryWriting.requirements || []
        });
        setSummaryFeedback(
          typeof result === 'string'
            ? result
            : result?.feedback || result?.message || 'Evaluation complete.'
        );
      } else {
        const wordCount = trimmedSummary.split(/\s+/).length;
        const { minWords, maxWords } = summaryWriting;
        if ((minWords && wordCount < minWords) || (maxWords && wordCount > maxWords)) {
          setSummaryFeedback(`Your summary has ${wordCount} words. Aim for ${minWords || 1}-${maxWords || 'the suggested'} words.`);
        } else {
          setSummaryFeedback(`Summary checked: ${wordCount} words. Detailed content evaluation can be connected through an evaluator.`);
        }
      }
    } catch (error) {
      setEvaluationError(error.message || 'Summary evaluation failed. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        {exercise.title && <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">{exercise.title}</h2>}
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">📖 Passage</h3>
        <p className="whitespace-pre-line text-base leading-relaxed text-gray-800 dark:text-gray-100">{exercise.passage}</p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {informationTransfer.questionNumber ? `Q${informationTransfer.questionNumber}. ` : ''}Information Transfer
          {informationTransfer.marks !== undefined ? ` — ${informationTransfer.marks} Marks` : ''}
        </h3>
        {informationTransfer.instructions && <p className="mb-4 text-gray-700 dark:text-gray-300">{informationTransfer.instructions}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left text-sm text-gray-800 dark:text-gray-100">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={column.id || column.label || column || index} scope="col" className="border border-gray-300 bg-gray-100 px-3 py-3 font-semibold dark:border-gray-600 dark:bg-gray-700">
                    {typeof column === 'string' ? column : column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {(row.cells || []).map((cell, columnIndex) => {
                    if (!cell.input) {
                      return (
                        <td key={columnIndex} className="border border-gray-300 px-3 py-3 dark:border-gray-600">
                          {cell.text || ''}
                        </td>
                      );
                    }

                    const input = cell.input;
                    const acceptedAnswers = (Array.isArray(input.answers) ? input.answers : [input.answer])
                      .filter(Boolean)
                      .map((answer) => answer.trim().toLowerCase());
                    const isCorrect = acceptedAnswers.includes((answers[input.id] || '').trim().toLowerCase());
                    const rowLabel = row.label || row.id || `row ${rowIndex + 1}`;
                    const columnLabel = typeof columns[columnIndex] === 'string'
                      ? columns[columnIndex]
                      : columns[columnIndex]?.label || `column ${columnIndex + 1}`;

                    return (
                      <td key={columnIndex} className="border border-gray-300 px-3 py-3 dark:border-gray-600">
                        <input
                          type="text"
                          aria-label={input.label || `${rowLabel}, ${columnLabel}`}
                          value={answers[input.id] || ''}
                          disabled={checked}
                          onChange={(event) => setAnswers((current) => ({ ...current, [input.id]: event.target.value }))}
                          className="w-full min-w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                        />
                        {checked && (
                          <p className={`mt-2 text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {isCorrect ? 'Correct' : `Incorrect. Correct answer: ${input.answer || input.answers?.[0]}`}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={resetInformationTransfer} className="rounded-lg bg-gray-600 px-5 py-2 font-medium text-white transition hover:bg-gray-700">
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

      <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {summaryWriting.questionNumber ? `Q${summaryWriting.questionNumber}. ` : ''}Summary Writing
          {summaryWriting.marks !== undefined ? ` — ${summaryWriting.marks} Marks` : ''}
        </h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {summaryWriting.prompt || 'Write a summary of the passage in your own words.'}
        </p>
        {summaryWriting.requirements?.length > 0 && (
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-300">
            {summaryWriting.requirements.map((requirement, index) => <li key={index}>{requirement}</li>)}
          </ul>
        )}
        <textarea
          rows={5}
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
            setSummaryFeedback('');
            setEvaluationError('');
          }}
          placeholder="Write your summary here..."
          className="w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={resetSummary} className="rounded-lg bg-gray-600 px-5 py-2 font-medium text-white transition hover:bg-gray-700">
            Reset
          </button>
          <button
            type="button"
            onClick={evaluateSummary}
            disabled={!summary.trim() || evaluating}
            className={`rounded-lg px-5 py-2 font-medium transition ${summary.trim() && !evaluating ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
          >
            {evaluating ? 'Evaluating...' : 'Check / Evaluate'}
          </button>
        </div>
        {summaryFeedback && <p role="status" className="mt-4 rounded-lg bg-blue-50 p-3 text-blue-800">{summaryFeedback}</p>}
        {evaluationError && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-800">{evaluationError}</p>}
      </section>
    </div>
  );
}