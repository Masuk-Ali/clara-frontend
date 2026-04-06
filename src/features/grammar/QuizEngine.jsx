import { useState } from 'react';
import { usePaginatedItems, useScore } from '../../hooks';
import { calculateScorePercentage, getPerformanceLabel } from '../../utils/styleHelpers';
import { Button, EmptyState, Card } from '../../components/ui';

export default function QuizEngine({ quizQuestions = [] }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);

  // Use hooks for pagination and scoring
  const {
    currentItem: question,
    index: currentIndex,
    goNext,
    reset,
    isLast,
    total
  } = usePaginatedItems(quizQuestions);

  const { correct, addCorrect, reset: resetScore } = useScore(total);

  if (total === 0) {
    return <EmptyState emoji="🎯" title="No Quiz Questions" message="No quiz questions available." />;
  }

  const handleSubmit = () => {
    if (selectedOption === null || !question) return;

    const isCorrect = selectedOption === question.correct;

    const result = {
      question: question.question,
      selectedAnswer: question.options[selectedOption],
      correctAnswer: question.options[question.correct],
      explanation: question.explanation,
      isCorrect
    };

    setResults((prev) => [...prev, result]);
    if (isCorrect) addCorrect();
    setSubmitted(true);
  };

  const handleNext = () => {
    goNext();
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleRestart = () => {
    reset();
    resetScore();
    setSelectedOption(null);
    setSubmitted(false);
    setResults([]);
  };

  const scorePercentage = calculateScorePercentage(correct, total);
  const performance = getPerformanceLabel(scorePercentage);

  // Quiz results view
  if (submitted && isLast) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">{performance.emoji}</div>
            <h2 className={`text-3xl font-bold ${performance.color}`}>
              {performance.label}!
            </h2>
            <p className="text-gray-600 mt-2">
              You scored {correct} out of {total} ({scorePercentage}%)
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </Card>

        {/* Results review */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Review Your Answers</h3>
          {results.map((result, index) => (
            <Card
              key={index}
              variant="outlined"
              className={
                result.isCorrect
                  ? 'border-green-300 bg-green-50/30'
                  : 'border-red-300 bg-red-50/30'
              }
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">
                  {result.isCorrect ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Question {index + 1}</p>
                  <p className="text-gray-900">{result.question}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>Your answer: <span className="font-medium">{result.selectedAnswer}</span></p>
                <p>Correct answer: <span className="font-medium">{result.correctAnswer}</span></p>
                {result.explanation && (
                  <p className="text-gray-700 mt-2 p-2 bg-white rounded border border-gray-200">
                    💡 <span>{result.explanation}</span>
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleRestart}>Restart Quiz</Button>
        </div>
      </div>
    );
  }

  // Quiz question view
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Question {currentIndex + 1} of {total}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedOption === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              } ${submitted ? 'cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name={`quiz-option-${currentIndex}`}
                checked={selectedOption === index}
                onChange={() => setSelectedOption(index)}
                disabled={submitted}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-gray-800">{option}</span>
            </label>
          ))}
        </div>

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            fullWidth
            className="mt-6"
          >
            Submit Answer
          </Button>
        )}
      </Card>

      {submitted && !isLast && (
        <div className={`rounded-lg border p-4 ${
          results[currentIndex]?.isCorrect
            ? 'bg-green-50 border-green-200 text-green-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <p className="font-semibold">
            {results[currentIndex]?.isCorrect ? '✓ Correct!' : '✗ Incorrect.'}
          </p>
          <p className="mt-2 text-sm">
            Correct answer: <span className="font-medium">{question.options[question.correct]}</span>
          </p>
          {question.explanation && (
            <p className="mt-2 text-sm">💡 {question.explanation}</p>
          )}
        </div>
      )}

      {submitted && !isLast && (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={handleNext}>
            Next Question
          </Button>
        </div>
      )}
    </div>
  );
}
