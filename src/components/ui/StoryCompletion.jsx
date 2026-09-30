import { useState } from 'react';

export default function StoryCompletion({ exercise = {}, onSubmit }) {
  return <StoryCompletionView key={exercise.id || exercise.title} exercise={exercise} onSubmit={onSubmit} />;
}

function StoryCompletionView({ exercise, onSubmit }) {
  const exercises = Array.isArray(exercise.exercises) ? exercise.exercises : [];
  const [selectedId, setSelectedId] = useState(null);
  const [writing, setWriting] = useState('');
  const [showReference, setShowReference] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const selectedExercise = exercises.find((item, index) => String(item.id ?? index) === String(selectedId));

  const reset = () => {
    setWriting('');
    setShowReference(false);
    setSubmitted(false);
  };

  if (!exercises.length) {
    return <p className="rounded-lg border border-gray-200 bg-white p-5 text-gray-600">No story-completion exercises available.</p>;
  }

  if (!selectedExercise) {
    return (
      <section className="space-y-4">
        <header className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{exercise.title || 'Completing a Story'}</h2>
          {exercise.marks !== undefined && (
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{exercise.marks} Marks</span>
          )}
        </header>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th scope="col" className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">Story</th>
                <th scope="col" className="border-b border-gray-200 px-4 py-3 text-right"><span className="sr-only">Open exercise</span></th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((item, index) => (
                <tr key={item.id ?? index} className="bg-white dark:bg-gray-900">
                  <th scope="row" className="border-b border-gray-200 px-4 py-3 text-left font-medium text-gray-900 dark:border-gray-700 dark:text-white">
                    {item.title}
                  </th>
                  <td className="border-b border-gray-200 px-4 py-3 text-right dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id ?? index)}
                      className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <article className="space-y-6">
      <button
        type="button"
        onClick={() => {
          setSelectedId(null);
          reset();
        }}
        className="min-h-11 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        ← Back to Stories
      </button>

      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <header className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedExercise.title}</h2>
          {selectedExercise.marks !== undefined && (
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{selectedExercise.marks} Marks</span>
          )}
        </header>

        <p className="whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-100">{selectedExercise.opening}</p>
        <p className="font-medium text-gray-800 dark:text-gray-100">{selectedExercise.instruction}</p>

        <label htmlFor={`story-completion-${selectedExercise.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Complete the story
        </label>
        <textarea
          id={`story-completion-${selectedExercise.id}`}
          rows={12}
          value={writing}
          onChange={(event) => setWriting(event.target.value)}
          placeholder="Write the rest of the story here..."
          className="w-full resize-y rounded-lg border border-gray-300 bg-white p-4 leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowReference(true)}
            className="min-h-11 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Check Answer
          </button>
          <button
            type="button"
            onClick={() => {
              onSubmit?.({
                exerciseId: selectedExercise.id,
                answer: writing,
                metadata: selectedExercise.evaluationMetadata
              });
              setSubmitted(true);
            }}
            disabled={!writing.trim()}
            className={`min-h-11 rounded-lg px-5 py-2 font-medium transition ${writing.trim() ? 'bg-green-700 text-white hover:bg-green-800' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
          >
            Submit
          </button>
          {(writing || showReference || submitted) && (
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-lg bg-gray-600 px-5 py-2 font-medium text-white transition hover:bg-gray-700"
            >
              Reset
            </button>
          )}
        </div>

        {submitted && <p role="status" className="text-sm text-gray-600 dark:text-gray-300">Answer submitted.</p>}

        {showReference && (
          <section className="space-y-2 rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:bg-green-900/20">
            <h3 className="font-semibold text-green-900 dark:text-green-200">Reference Answer</h3>
            <p className="whitespace-pre-line leading-relaxed text-green-900 dark:text-green-100">{selectedExercise.referenceAnswer}</p>
          </section>
        )}
      </section>
    </article>
  );
}