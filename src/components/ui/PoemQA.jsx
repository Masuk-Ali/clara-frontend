import { useState } from 'react';

export default function PoemQA({ exercise = {} }) {
  return <PoemQAView key={exercise.id || exercise.title} exercise={exercise} />;
}

function PoemQAView({ exercise }) {
  const poems = Array.isArray(exercise.poems) ? exercise.poems : [];
  const [selectedPoemId, setSelectedPoemId] = useState(null);
  const [summaryLanguage, setSummaryLanguage] = useState('bengali');
  const [studentAnswers, setStudentAnswers] = useState({});
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [revealedClues, setRevealedClues] = useState({});
  const selectedPoem = poems.find((poem, index) => String(poem.id ?? index) === String(selectedPoemId));

  const handleReset = (questionKey) => {
    setStudentAnswers((current) => {
      const next = { ...current };
      delete next[questionKey];
      return next;
    });
    setCheckedQuestions((current) => {
      const next = { ...current };
      delete next[questionKey];
      return next;
    });
    setRevealedClues((current) => {
      const next = { ...current };
      delete next[questionKey];
      return next;
    });
  };

  if (!poems.length) {
    return <p className="rounded-lg border border-gray-200 bg-white p-5 text-gray-600">No poems available.</p>;
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        {exercise.title && <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{exercise.title}</h2>}
        {exercise.marks !== undefined && (
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{exercise.marks} Marks</span>
        )}
      </header>

      {!selectedPoem ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th scope="col" className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">Poem</th>
                <th scope="col" className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">Questions</th>
                <th scope="col" className="border-b border-gray-200 px-4 py-3"><span className="sr-only">Select poem</span></th>
              </tr>
            </thead>
            <tbody>
              {poems.map((poem, poemIndex) => (
                <tr key={poem.id ?? poemIndex} className="bg-white dark:bg-gray-900">
                  <th scope="row" className="border-b border-gray-200 px-4 py-3 text-left font-medium text-gray-900 dark:border-gray-700 dark:text-white">
                    {poem.title}
                  </th>
                  <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                    {poem.questions?.length || 0}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3 text-right dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setSelectedPoemId(poem.id ?? poemIndex)}
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
      ) : (
        <article className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedPoemId(null)}
            className="min-h-11 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            ← Back to Poems
          </button>

          <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedPoem.title}</h3>
              {selectedPoem.author && <p className="italic text-sm text-gray-600 dark:text-gray-300">{selectedPoem.author}</p>}
            </div>

            <div className="space-y-5 text-gray-800 dark:text-gray-100">
              {(selectedPoem.poem || '').split(/\n\s*\n/).filter(Boolean).map((stanza, index) => (
                <p key={index} className="whitespace-pre-line font-serif leading-relaxed">
                  {stanza}
                </p>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Poem summary language">
                <button
                  type="button"
                  onClick={() => setSummaryLanguage('bengali')}
                  aria-pressed={summaryLanguage === 'bengali'}
                  className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium transition ${summaryLanguage === 'bengali' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
                >
                  বাংলা সারাংশ
                </button>
                <button
                  type="button"
                  onClick={() => setSummaryLanguage('english')}
                  aria-pressed={summaryLanguage === 'english'}
                  className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium transition ${summaryLanguage === 'english' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
                >
                  English Summary
                </button>
              </div>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                {summaryLanguage === 'bengali' ? selectedPoem.bengaliSummary : selectedPoem.englishSummary}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Questions and Answers</h3>
            {(selectedPoem.questions || []).map((item, questionIndex) => {
              const questionKey = `${selectedPoem.id}:${item.id ?? questionIndex}`;
              const studentAnswer = studentAnswers[questionKey] || '';
              const isChecked = Boolean(checkedQuestions[questionKey]);
              const isClueRevealed = Boolean(revealedClues[questionKey]);

              return (
                <section key={questionKey} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {questionIndex + 1}. {item.question}
                  </p>

                  {!isChecked ? (
                    <div className="mt-4">
                      <label htmlFor={`poem-answer-${questionKey}`} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Answer
                      </label>
                      <textarea
                        id={`poem-answer-${questionKey}`}
                        rows={3}
                        value={studentAnswer}
                        onChange={(event) => setStudentAnswers((current) => ({ ...current, [questionKey]: event.target.value }))}
                        placeholder="Write your answer here..."
                        className="w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      />

                      <div className="mt-3 flex flex-wrap gap-3">
                        {item.clue && !isClueRevealed && (
                          <button
                            type="button"
                            onClick={() => setRevealedClues((current) => ({ ...current, [questionKey]: true }))}
                            className="min-h-11 rounded-lg bg-yellow-500 px-5 py-2 font-medium text-white transition hover:bg-yellow-600"
                          >
                            💡 Clue
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setCheckedQuestions((current) => ({ ...current, [questionKey]: true }))}
                          disabled={!studentAnswer.trim()}
                          className={`min-h-11 rounded-lg px-5 py-2 font-medium transition ${studentAnswer.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
                        >
                          Check Answer
                        </button>
                      </div>

                      {isClueRevealed && item.clue && (
                        <div className="mt-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:bg-yellow-900/20">
                          <h4 className="mb-1 font-semibold text-yellow-800 dark:text-yellow-200">💡 Clue</h4>
                          <p className="text-yellow-700 dark:text-yellow-100">{item.clue}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">Your Answer</h4>
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{studentAnswer}</p>
                      </div>
                      <div className="rounded-lg border-l-4 border-green-400 bg-green-50 p-4 dark:bg-green-900/20">
                        <h4 className="mb-1 font-semibold text-green-800 dark:text-green-200">Model Answer</h4>
                        <p className="text-green-700 dark:text-green-100">{item.answer}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleReset(questionKey)}
                        className="min-h-11 rounded-lg bg-gray-600 px-5 py-2 font-medium text-white transition hover:bg-gray-700"
                      >
                        ↻ Reset
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </section>
        </article>
      )}
    </section>
  );
}