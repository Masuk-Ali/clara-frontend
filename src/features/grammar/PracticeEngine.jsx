import { useState } from 'react';
import { usePaginatedItems, useEnterKey } from '../../hooks';
import { validateAnswer } from '../../utils/styleHelpers';
import { Button, Input, EmptyState, Card } from '../../components/ui';

export default function PracticeEngine({ practiceQuestions = [], onPracticeComplete }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Use pagination hook for question navigation
  const {
    currentItem: question,
    index: currentIndex,
    goNext,
    reset,
    isLast,
    total
  } = usePaginatedItems(practiceQuestions);

  if (total === 0) {
    return <EmptyState emoji="✏️" title="No Practice Questions" message="No practice questions available." />;
  }

  const handleSubmit = () => {
    if (!question) return;

    const correct = validateAnswer(answer, question.answer);
    setIsCorrect(correct);
    setSubmitted(true);

    // Callback when quiz completes
    if (correct && isLast) {
      onPracticeComplete?.();
    }
  };

  const handleNext = () => {
    goNext();
    setAnswer('');
    setSubmitted(false);
    setIsCorrect(null);
  };

  const handleRestart = () => {
    reset();
    setAnswer('');
    setSubmitted(false);
    setIsCorrect(null);
  };

  const enterKeyHandler = useEnterKey(handleSubmit);

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Practice {currentIndex + 1} of {total}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{question.prompt}</h2>

        <div className="space-y-4">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={enterKeyHandler}
            placeholder="Type your answer"
            disabled={submitted}
          />

          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              fullWidth
            >
              Submit Answer
            </Button>
          ) : null}

          {submitted && (
            <div
              className={`rounded-lg border p-4 ${
                isCorrect
                  ? 'bg-green-50 border-green-200 text-green-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <p className="font-semibold">
                {isCorrect ? '✓ Correct answer!' : '✗ Not quite right.'}
              </p>
              <p className="mt-2 text-sm">
                Correct answer: <span className="font-medium">{question.answer}</span>
              </p>
              {question.explanation && (
                <p className="mt-2 text-sm">{question.explanation}</p>
              )}
            </div>
          )}
        </div>
      </Card>

      {submitted && (
        <div className="flex justify-end gap-2">
          {!isLast && (
            <Button variant="secondary" onClick={handleNext}>
              Next Question
            </Button>
          )}
          {isLast && (
            <Button onClick={handleRestart}>
              Restart Practice
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
