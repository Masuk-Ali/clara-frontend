import { useState } from 'react';
import QuestionAnswerSection from './QuestionAnswerSection';

export default function StoryQA({ exercise = {} }) {
  const stories = Array.isArray(exercise.stories) ? exercise.stories : [];
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const selectedStory = stories.find((story, index) => String(story.id ?? index) === String(selectedStoryId));

  if (!stories.length) {
    return <p className="rounded-lg border border-gray-200 bg-white p-5 text-gray-600">No stories available.</p>;
  }

  return (
    <section className="space-y-6">
      {!selectedStory ? (
        <>
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{exercise.title || 'Story Q&A'}</h2>
            {exercise.marks !== undefined && (
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{exercise.marks} Marks</span>
            )}
          </header>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th scope="col" className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">Story</th>
                  <th scope="col" className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">Author / Source</th>
                  <th scope="col" className="border-b border-gray-200 px-4 py-3"><span className="sr-only">Open story</span></th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story, index) => (
                  <tr key={story.id ?? index} className="bg-white dark:bg-gray-900">
                    <th scope="row" className="border-b border-gray-200 px-4 py-3 text-left font-medium text-gray-900 dark:border-gray-700 dark:text-white">
                      {story.title}
                    </th>
                    <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                      {story.author || '—'}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-3 text-right dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setSelectedStoryId(story.id ?? index)}
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
        </>
      ) : (
        <article className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedStoryId(null)}
            className="min-h-11 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            ← Back to Stories
          </button>

          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <header>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedStory.title}</h2>
              {selectedStory.author && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{selectedStory.author}</p>}
            </header>
            {selectedStory.storyText && (
              <div className="space-y-4 leading-relaxed text-gray-800 dark:text-gray-100">
                {selectedStory.storyText.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">{paragraph}</p>
                ))}
              </div>
            )}
          </section>

          <QuestionAnswerSection
            questions={selectedStory.questions || []}
            title="Questions"
            instructions=""
          />
        </article>
      )}
    </section>
  );
}