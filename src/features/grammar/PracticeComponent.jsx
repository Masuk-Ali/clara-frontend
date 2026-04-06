import { useState } from "react";

export default function PracticeComponent({ exercises }) {
  const [answers, setAnswers] = useState(() => exercises.map(() => ""));
  const [feedback, setFeedback] = useState(() => exercises.map(() => null));

  const handleChange = (index, value) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = value;
    setAnswers(nextAnswers);

    const isCorrect = value.trim().toLowerCase() === exercises[index].answer.trim().toLowerCase();
    const nextFeedback = [...feedback];
    nextFeedback[index] = value ? (isCorrect ? "correct" : "incorrect") : null;
    setFeedback(nextFeedback);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gray-50 p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">Practice your grammar</h2>
        <p className="mt-2 text-gray-600">Complete the interactive exercises and get instant feedback as you type.</p>
      </div>

      <div className="grid gap-6">
        {exercises.map((exercise, index) => (
          <div key={index} className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Exercise {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{exercise.type === "fill" ? "Fill in the blank" : "Sentence correction"}</h3>
              </div>
              <span className="text-sm text-gray-500">{exercise.type}</span>
            </div>

            <p className="text-gray-700 mb-4">{exercise.prompt}</p>

            <input
              type="text"
              value={answers[index]}
              onChange={(event) => handleChange(index, event.target.value)}
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Type your answer here"
            />

            {feedback[index] && (
              <div className={`mt-4 rounded-3xl px-4 py-3 text-sm ${
                feedback[index] === "correct"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}>
                {feedback[index] === "correct"
                  ? "Great job! Your answer is correct."
                  : `Try again — the correct answer is: ${exercise.answer}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
