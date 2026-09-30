import { Fragment, useState } from 'react';

const columnKeys = ['A', 'B', 'C'];

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  if (shuffled.length > 1 && shuffled.every((item, index) => item === items[index])) {
    const offset = 1 + Math.floor(Math.random() * (items.length - 1));
    return [...items.slice(offset), ...items.slice(0, offset)];
  }

  return shuffled;
};

const createOptionOrder = (columns) => Object.fromEntries(
  columnKeys.map((column) => [column, shuffle((columns[column] || []).map((part) => part.id))])
);

export default function Matching({ exercise = {} }) {
  return <MatchingExercise key={exercise.id || exercise.title} exercise={exercise} />;
}

function MatchingExercise({ exercise }) {
  const columns = exercise.columns || {};
  const targets = exercise.targets || [];
  const [completed, setCompleted] = useState({});
  const [selection, setSelection] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [optionOrder, setOptionOrder] = useState(() => createOptionOrder(columns));
  const currentTarget = targets.find((target) => !completed[target.id]);
  const allSelected = currentTarget && columnKeys.every((column) => selection[column] !== undefined);
  const matchedCount = Object.keys(completed).length;

  const handleDragStart = (event, column, partId) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({ column, partId }));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const assignPart = (column, partId) => {
    if (!currentTarget) return;
    setSelection((current) => ({ ...current, [column]: partId }));
    setSelectedPart(null);
    setFeedback(null);
  };

  const handleDrop = (event, column) => {
    event.preventDefault();
    if (!currentTarget) return;

    try {
      const { column: sourceColumn, partId } = JSON.parse(event.dataTransfer.getData('text/plain'));
      if (sourceColumn === column && partId !== undefined) {
        assignPart(column, partId);
      }
    } catch {
      // Ignore drops that do not contain a matching fragment.
    }
  };

  const removePart = (column) => {
    setSelection((current) => {
      const next = { ...current };
      delete next[column];
      return next;
    });
    setFeedback(null);
  };

  const getPart = (column, partId) =>
    columns[column]?.find((part) => String(part.id) === String(partId));

  const checkAnswer = () => {
    if (!currentTarget || !allSelected) return;
    const expected = exercise.correctCombinations?.[currentTarget.id] || {};
    const isCorrect = columnKeys.every((column) =>
      String(selection[column]) === String(expected[column])
    );

    if (!isCorrect) {
      const correctCombination = columnKeys.map((column) => {
        const part = getPart(column, expected[column]);
        return `${part?.label || ''} ${part?.text || ''}`;
      }).join(' ');
      setFeedback({ type: 'incorrect', text: `Incorrect. Correct combination: ${correctCombination}` });
      return;
    }

    const nextCompleted = { ...completed, [currentTarget.id]: selection };
    setCompleted(nextCompleted);
    setOptionOrder(Object.fromEntries(columnKeys.map((column) => {
      const usedParts = new Set(Object.values(nextCompleted).map((answer) => String(answer[column])));
      const remainingIds = (columns[column] || [])
        .filter((part) => !usedParts.has(String(part.id)))
        .map((part) => part.id);
      return [column, shuffle(remainingIds)];
    })));
    setSelection({});
    setSelectedPart(null);
    setFeedback({ type: 'correct', text: 'Correct. Continue with the next sentence.' });
  };

  const reset = () => {
    setCompleted({});
    setSelection({});
    setSelectedPart(null);
    setFeedback(null);
    setOptionOrder(createOptionOrder(columns));
  };

  if (!targets.length || !columnKeys.every((column) => columns[column]?.length)) {
    return <p className="rounded-lg border border-gray-200 bg-white p-5 text-gray-600">No matching exercise data available.</p>;
  }

  const usedParts = Object.values(completed);

  return (
    <section className="space-y-4">
      {exercise.title && <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{exercise.title}</h2>}
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {exercise.instructions || 'Drag a part from each column into the active sentence row. On a phone, tap a part and then its cell.'}
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
          <caption className="bg-gray-50 px-3 py-2 text-left font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {currentTarget
              ? `${currentTarget.label || `Sentence ${matchedCount + 1}`} · ${matchedCount + 1} of ${targets.length}`
              : `All ${targets.length} sentences matched`}
          </caption>
          <thead>
            <tr>
              {columnKeys.map((column) => (
                <th key={column} scope="col" className="border border-gray-200 bg-gray-100 px-2 py-2 font-semibold dark:border-gray-700 dark:bg-gray-900">
                  Column {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {columnKeys.map((column) => {
                const usedIds = new Set(usedParts.map((answer) => String(answer[column])));
                const availableParts = (columns[column] || [])
                  .filter((part) => !usedIds.has(String(part.id)))
                  .sort((first, second) => optionOrder[column].indexOf(first.id) - optionOrder[column].indexOf(second.id));

                return (
                  <td key={column} className="align-top border border-gray-200 p-1 dark:border-gray-700 sm:p-2">
                    <div className="space-y-1">
                      {availableParts.map((part) => {
                        const isSelected = selectedPart?.column === column && String(selectedPart.partId) === String(part.id);
                        return (
                          <button
                            key={part.id}
                            type="button"
                            draggable
                            onClick={() => setSelectedPart({ column, partId: part.id })}
                            onDragStart={(event) => handleDragStart(event, column, part.id)}
                            className={`block min-h-11 w-full break-words rounded border px-1.5 py-2 text-left leading-snug touch-manipulation ${isSelected ? 'border-blue-500 bg-blue-100 ring-1 ring-blue-500 dark:bg-blue-900/40' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'} text-gray-800 dark:text-gray-100`}
                          >
                            <span className="mr-1 font-semibold">{part.label}</span>{part.text}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>
            {currentTarget && (
              <>
                <tr>
                  <th colSpan={3} className="border border-gray-200 bg-blue-50 px-2 py-2 text-left font-semibold text-blue-900 dark:border-gray-700 dark:bg-blue-900/30 dark:text-blue-100">
                    Match the parts for {currentTarget.label || `Sentence ${matchedCount + 1}`}
                  </th>
                </tr>
                <tr>
                  {columnKeys.map((column) => {
                    const part = getPart(column, selection[column]);
                    const isSelectedColumn = selectedPart?.column === column;
                    return (
                      <td
                        key={column}
                        onClick={() => isSelectedColumn && assignPart(column, selectedPart.partId)}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleDrop(event, column)}
                        className={`h-16 align-top border border-dashed p-1.5 sm:p-2 dark:border-gray-500 ${feedback?.type === 'incorrect' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : `border-gray-400 ${isSelectedColumn ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}`}
                      >
                        {part ? (
                          <div className="flex items-start justify-between gap-1">
                            <span className="break-words leading-snug text-gray-800 dark:text-gray-100">
                              <span className="mr-1 font-semibold">{part.label}</span>{part.text}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePart(column)}
                              aria-label={`Remove Column ${column} selection`}
                              className="shrink-0 rounded px-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">Drop {column}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </>
            )}
            {targets.filter((target) => completed[target.id]).map((target, index) => (
              <Fragment key={target.id}>
                <tr key={`${target.id}-label`}>
                  <th colSpan={3} className="border border-gray-200 bg-green-50 px-2 py-2 text-left font-semibold text-green-800 dark:border-gray-700 dark:bg-green-900/20 dark:text-green-200">
                    {target.label || `Sentence ${index + 1}`} · Correct
                  </th>
                </tr>
                <tr key={`${target.id}-answer`}>
                  {columnKeys.map((column) => {
                    const part = getPart(column, completed[target.id][column]);
                    return (
                      <td key={column} className="break-words border border-gray-200 bg-green-50/50 p-1.5 text-gray-800 dark:border-gray-700 dark:bg-green-900/10 dark:text-gray-100 sm:p-2">
                        <span className="mr-1 font-semibold">{part?.label}</span>{part?.text}
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {feedback && (
        <p role="status" className={`text-sm font-medium ${feedback.type === 'correct' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
          {feedback.text}
        </p>
      )}
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Matched: {matchedCount} / {targets.length}</p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="min-h-11 rounded-lg bg-gray-600 px-5 py-2 font-medium text-white transition hover:bg-gray-700">
          Reset
        </button>
        {currentTarget && (
          <button
            type="button"
            onClick={checkAnswer}
            disabled={!allSelected}
            className={`min-h-11 rounded-lg px-5 py-2 font-medium transition ${allSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
          >
            Check Answers
          </button>
        )}
      </div>
    </section>
  );
}