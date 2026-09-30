import { useState } from 'react';
import UnseenPassage from '../../features/reading/UnseenPassage';

export default function UnseenPassageSection({ exercise = {}, onBackToSyllabus, onEvaluateSummary }) {
  const passages = Array.isArray(exercise.passages) ? exercise.passages : [];
  const [selectedPassageId, setSelectedPassageId] = useState(null);
  const selectedPassage = passages.find((passage) => passage.id === selectedPassageId);

  if (!selectedPassage) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBackToSyllabus}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          ← Back to Syllabus
        </button>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th scope="col" className="w-16 border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">No.</th>
                <th scope="col" className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">Title</th>
              </tr>
            </thead>
            <tbody>
              {passages.map((passage, index) => (
                <tr key={passage.id} className="bg-white dark:bg-gray-900">
                  <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">{index + 1}</td>
                  <td className="border-b border-gray-200 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPassageId(passage.id)}
                      className="text-left font-medium text-blue-700 hover:underline dark:text-blue-300"
                    >
                      {passage.title}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setSelectedPassageId(null)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        ← Back to Unseen Passages
      </button>
      <UnseenPassage exercise={selectedPassage} onEvaluateSummary={onEvaluateSummary} />
    </div>
  );
}