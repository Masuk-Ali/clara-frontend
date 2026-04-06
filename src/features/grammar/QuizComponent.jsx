import { useState } from "react";

export default function QuizComponent({ questions }) {
  const [selectedAnswers, setSelectedAnswers] = useState(() => questions.map(() => null));
  const [score, setScore] = useState(null);

  const handleSelect = (questionIndex, optionIndex) => {
    const next = [...selectedAnswers];
    next[questionIndex] = optionIndex;
    setSelectedAnswers(next);
  };

  const submitQuiz = () => {
    const total = questions.length;
    const correct = questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correct ? count + 1 : count;
    }, 0);
    setScore({ correct, total });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gray-50 p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">Quick grammar quiz</h2>
        <p className="mt-2 text-gray-600">Choose the best answer for each question and submit to view your score.</p>
      </div>

      <div className="space-y-5">
        {questions.map((question, index) => (
          <div key={index} className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Question {index + 1}</p>
              <p className="mt-3 text-lg text-gray-900">{question.question}</p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, optionIndex) => {
                const selected = selectedAnswers[index] === optionIndex;
                return (
                  <label
                    key={optionIndex}
                    className={`flex cursor-pointer items-center gap-3 rounded-3xl border px-4 py-3 transition ${
                      selected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={selected}
                      onChange={() => handleSelect(index, optionIndex)}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button
          onClick={submitQuiz}
          className="rounded-3xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Submit Quiz
        </button>

        {score && (
          <div className="rounded-3xl bg-green-50 px-5 py-4 text-green-800 border border-green-100">
            <p className="text-sm font-semibold">Score</p>
            <p className="text-2xl font-bold">{score.correct}/{score.total}</p>
            <p className="text-sm text-green-700">{Math.round((score.correct / score.total) * 100)}% correct</p>
          </div>
        )}
      </div>
    </div>
  );
}
