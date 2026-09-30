import { useState } from 'react';

export default function QuestionAnswerSection({
  questions = [],
  title = 'Comprehension Questions',
  instructions = 'Read each question and write your own answer.'
}) {
  const [studentAnswers, setStudentAnswers] = useState({});
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [revealedClues, setRevealedClues] = useState({});

  if (!questions.length) return null;

  const resetQuestion = (questionId) => {
    setStudentAnswers((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
    setCheckedQuestions((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
    setRevealedClues((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>❓</span>
          {title}
        </h3>
        {instructions && <p className="text-gray-600 mt-2">{instructions}</p>}
      </div>

      <div className="space-y-6">
        {questions.map((item, index) => {
          const questionId = item.id || index;
          const studentAnswer = studentAnswers[questionId] || '';
          const isChecked = checkedQuestions[questionId];
          const isClueRevealed = revealedClues[questionId];

          return (
            <div key={questionId} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-semibold text-gray-900 text-lg">
                {index + 1}. {item.question}
              </p>

              {!isChecked && (
                <div className="mt-4">
                  <label htmlFor={`question-answer-${questionId}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    id={`question-answer-${questionId}`}
                    rows={4}
                    value={studentAnswer}
                    onChange={(event) => setStudentAnswers((current) => ({ ...current, [questionId]: event.target.value }))}
                    placeholder="Write your answer here..."
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
                  />
                </div>
              )}

              {!isChecked && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {item.clue && !isClueRevealed && (
                    <button
                      type="button"
                      onClick={() => setRevealedClues((current) => ({ ...current, [questionId]: true }))}
                      className="px-5 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition font-medium"
                    >
                      💡 Clue
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (studentAnswer.trim()) {
                        setCheckedQuestions((current) => ({ ...current, [questionId]: true }));
                      }
                    }}
                    disabled={!studentAnswer.trim()}
                    className={`px-5 py-2 rounded-lg transition font-medium ${studentAnswer.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Check Answer
                  </button>
                </div>
              )}

              {!isChecked && isClueRevealed && item.clue && (
                <div className="mt-5 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-800 mb-1">💡 Clue</h4>
                  <p className="text-yellow-700">{item.clue}</p>
                </div>
              )}

              {isChecked && (
                <div className="mt-5 space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">📝 Your Answer</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{studentAnswer}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-semibold text-green-800 mb-1">📖 Model Answer</h4>
                    <p className="text-green-700">{item.answer}</p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => resetQuestion(questionId)}
                      className="px-5 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition font-medium"
                    >
                      ↻ Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}