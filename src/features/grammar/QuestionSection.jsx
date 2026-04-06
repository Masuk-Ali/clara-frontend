import React, { useState } from 'react';

const QuestionSection = ({ questions }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleMCQChange = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const handleShortAnswerChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (q.type === 'mcq' && answers[index] === q.correct) {
        correctCount++;
      } else if (q.type === 'short' && answers[index]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Questions:</h3>

      {questions.map((question, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg">
          <p className="font-medium mb-3">{index + 1}. {question.question}</p>

          {question.type === 'mcq' ? (
            <div className="space-y-2">
              {question.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optIndex}
                    checked={answers[index] === optIndex}
                    onChange={() => handleMCQChange(index, optIndex)}
                    disabled={submitted}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                  {submitted && optIndex === question.correct && (
                    <span className="text-green-600 font-bold">✓</span>
                  )}
                  {submitted && answers[index] === optIndex && optIndex !== question.correct && (
                    <span className="text-red-600 font-bold">✗</span>
                  )}
                </label>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={answers[index] || ''}
                onChange={(e) => handleShortAnswerChange(index, e.target.value)}
                disabled={submitted}
                className="w-full p-2 border rounded"
                placeholder="Your answer..."
              />
              {submitted && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Correct answer: {question.answer}</p>
                  {answers[index]?.toLowerCase().trim() === question.answer.toLowerCase().trim() ? (
                    <p className="text-green-600 font-bold">✓ Correct!</p>
                  ) : (
                    <p className="text-red-600 font-bold">✗ Incorrect</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center mt-6">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Answers
          </button>
        ) : (
          <div className="text-lg font-semibold">
            Score: {score} / {questions.length}
          </div>
        )}

        {submitted && (
          <button
            onClick={resetQuiz}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionSection;