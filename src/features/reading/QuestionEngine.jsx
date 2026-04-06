import React, { useState } from 'react';

export default function QuestionEngine({ questions = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  const question = questions[currentIndex];

  const handleOptionChange = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !question) return;

    const correct = selectedOption === question.correct;
    const nextResult = {
      question: question.question,
      selectedAnswer: question.options[selectedOption],
      correctAnswer: question.options[question.correct],
      explanation: question.explanation,
      isCorrect: correct
    };

    setResults((prev) => [...prev, nextResult]);
    setScore((prev) => prev + (correct ? 1 : 0));
    setSubmitted(true);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setScore(0);
    setResults([]);
  };

  if (!question) {
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
          {question.options.map((option, index) => (
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

        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || submitted}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Submit Answer
        </button>
      </div>

      {submitted && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className={`rounded-lg p-4 ${selectedOption === question.correct ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            <p className="font-semibold">
              {selectedOption === question.correct ? 'Correct!' : 'Incorrect.'}
            </p>
            <p className="mt-2 text-sm text-gray-700">Correct answer: <span className="font-medium">{question.options[question.correct]}</span></p>
            {question.explanation && (
              <p className="mt-3 text-sm text-gray-700">Explanation: {question.explanation}</p>
            )}
          </div>

          {currentIndex < questions.length - 1 ? (
            <div className="mt-4 flex justify-end">
              <button
                onClick={goNext}
                className="px-5 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >
                Next Question
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-white p-4 border border-gray-200">
                <p className="text-sm text-gray-600">Comprehension complete!</p>
                <p className="text-xl font-semibold text-gray-900">Score: {score} / {questions.length}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={restartQuiz}
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Restart Questions
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
