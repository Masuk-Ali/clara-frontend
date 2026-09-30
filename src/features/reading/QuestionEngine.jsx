import React, { useState } from 'react';

export default function QuestionEngine({ questions = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [revealedClues, setRevealedClues] = useState({});

  const question = Array.isArray(questions) ? questions[currentIndex] : null;
  const questionKey = question?.id ?? currentIndex;
  const selectedOption = selectedAnswers[questionKey] ?? null;
  const result = submittedAnswers[questionKey];
  const submitted = Boolean(result);
  const score = Object.values(submittedAnswers).filter((answer) => answer.isCorrect).length;
  const options = Array.isArray(question?.options) ? question.options : [];
  const correctIndex = Number.isInteger(question?.correctAnswer)
    ? question.correctAnswer
    : Number.isInteger(question?.correct)
      ? question.correct
      : null;

  const handleOptionChange = (optionIndex) => {
    setSelectedAnswers((current) => ({ ...current, [questionKey]: optionIndex }));
  };

  const handleSubmit = () => {
    if (selectedOption === null || !question || correctIndex === null) return;

    const correct = selectedOption === correctIndex;
    const nextResult = {
      selectedAnswer: options[selectedOption],
      isCorrect: correct
    };

    setSubmittedAnswers((current) => ({ ...current, [questionKey]: nextResult }));
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setRevealedClues({});
  };

  const allQuestionsAnswered = questions.every((item, index) =>
    Boolean(submittedAnswers[item?.id ?? index])
  );

  if (!question || !options.length) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 text-center text-gray-600">
        No questions available for this passage.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-2 mb-4">
          <span className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
          <h2 className="text-2xl font-semibold text-gray-900">{question.question}</h2>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <label key={index} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-blue-300 transition">
              <input
                type="radio"
                name={`question-option-${currentIndex}`}
                checked={selectedOption === index}
                onChange={() => handleOptionChange(index)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-gray-800">{option}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!submitted && question.clue && !revealedClues[questionKey] && (
            <button
              type="button"
              onClick={() => setRevealedClues((current) => ({ ...current, [questionKey]: true }))}
              className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
            >
              💡 Clue
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || submitted}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Submit Answer
          </button>
        </div>

        {!submitted && question.clue && revealedClues[questionKey] && (
          <div className="mt-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">💡 Clue: {question.clue}</p>
          </div>
        )}
      </div>

      {submitted && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className={`rounded-lg p-4 ${selectedOption === correctIndex ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            <p className="font-semibold">
              {selectedOption === correctIndex ? 'Correct!' : 'Incorrect.'}
            </p>
            <p className="mt-2 text-sm text-gray-700">Correct answer: <span className="font-medium">{options[correctIndex]}</span></p>
            {question.explanation && (
              <p className="mt-3 text-sm text-gray-700">Explanation: {question.explanation}</p>
            )}
          </div>

          {currentIndex === questions.length - 1 && allQuestionsAnswered && (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-white p-4 border border-gray-200">
                <p className="text-sm text-gray-600">Comprehension complete!</p>
                <p className="text-xl font-semibold text-gray-900">Score: {score} / {questions.length}</p>
              </div>
              <button
                onClick={restartQuiz}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Restart Questions
              </button>
            </div>
          )}
        </div>
      )}

      <nav aria-label="MCQ question navigation" className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => goToQuestion(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="px-5 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition"
        >
          Previous Question
        </button>
        <span className="text-sm text-gray-500">{currentIndex + 1} / {questions.length}</span>
        <button
          type="button"
          onClick={() => goToQuestion(currentIndex + 1)}
          disabled={currentIndex === questions.length - 1}
          className="px-5 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition"
        >
          Next Question
        </button>
      </nav>
    </div>
  );
}
