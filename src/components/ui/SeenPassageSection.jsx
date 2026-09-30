import { useState } from 'react';
import PassageReader from '../../features/reading/PassageReader';

export default function SeenPassageSection({ passages = [], onBackToSyllabus }) {
  const [selectedPassageId, setSelectedPassageId] = useState(null);
  const selectedPassage = passages.find((passage) => passage.id === selectedPassageId);

  if (!selectedPassage) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBackToSyllabus}
          aria-label="Back to syllabus"
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

  const sentenceExplanations = Array.isArray(selectedPassage.sentences)
    ? selectedPassage.sentences.reduce((explanations, sentence, index) => {
        explanations[index] = {
          bengali: sentence.bengaliMeaning || '',
          grammar: sentence.forensic
            ? Object.entries(sentence.forensic)
                .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
                .join(' • ')
            : ''
        };
        return explanations;
      }, {})
    : {};

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setSelectedPassageId(null)}
        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        ← Back to Passages
      </button>
      <PassageReader
        passage={selectedPassage.passage || ''}
        wordData={selectedPassage.wordData || {}}
        sentenceExplanations={sentenceExplanations}
        mcqs={selectedPassage.mcqs || []}
        questions={selectedPassage.questions || []}
        title={selectedPassage.title}
        mcqTitle="Q1. Multiple Choice Questions — 7 Marks"
        questionTitle="Q2. Answer the Questions — 10 Marks"
      />
    </div>
  );
}