import React, { useState } from 'react';

export default function QuestionEngine({
  question = {},
  onSubmit = () => {},
  autoShowCorrect = true
}) {
  const [userAnswer, setUserAnswer] = useState(null);
  const [draggedItems, setDraggedItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleMCQChange = (optionIndex) => {
    if (!submitted) {
      setUserAnswer(optionIndex);
    }
  };

  const handleFillBlankChange = (value) => {
    if (!submitted) {
      setUserAnswer(value);
    }
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToBlank = (e, blankIndex) => {
    e.preventDefault();
    if (submitted) return;

    try {
      const item = JSON.parse(e.dataTransfer.getData('text/plain'));
      const newAnswers = userAnswer ? [...userAnswer] : [];
      newAnswers[blankIndex] = item;
      setUserAnswer(newAnswers);
    } catch (err) {
      console.error('Drop failed:', err);
    }
  };

  const handleRearrangeAdd = (item) => {
    if (!submitted && question.type === 'rearrange') {
      if (!draggedItems.includes(item)) {
        setDraggedItems([...draggedItems, item]);
      }
    }
  };

  const handleRearrangeRemove = (index) => {
    if (!submitted) {
      setDraggedItems(draggedItems.filter((_, i) => i !== index));
    }
  };

  const checkAnswer = () => {
    let correct = false;

    switch (question.type) {
      case 'mcq':
        correct = userAnswer === question.correct;
        break;
      case 'fill_blank':
        const normalized = (userAnswer || '').trim().toLowerCase();
        const expectedAnswer = (question.answer || '').trim().toLowerCase();
        correct = normalized === expectedAnswer;
        break;
      case 'drag_drop':
        correct = JSON.stringify(userAnswer) === JSON.stringify(question.correct);
        break;
      case 'rearrange':
        correct = JSON.stringify(draggedItems) === JSON.stringify(question.correct);
        break;
      default:
        correct = false;
    }

    setIsCorrect(correct);
    setSubmitted(true);
    onSubmit?.({ correct, userAnswer: userAnswer || draggedItems });
  };

  const reset = () => {
    setUserAnswer(null);
    setDraggedItems([]);
    setSubmitted(false);
    setIsCorrect(null);
  };

  if (!question || !question.type) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 text-center">
        No question provided.
      </div>
    );
  }

  const renderQuestionUI = () => {
    switch (question.type) {
      case 'mcq':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-blue-300 transition"
              >
                <input
                  type="radio"
                  name={`mcq-option`}
                  checked={userAnswer === index}
                  onChange={() => handleMCQChange(index)}
                  disabled={submitted}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-800 flex-1">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={userAnswer || ''}
              onChange={(e) => handleFillBlankChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !submitted && checkAnswer()}
              disabled={submitted}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>
        );

      case 'drag_drop':
        return (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-3 font-semibold">Drag items to the blanks:</p>
              <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
                {question.items?.map((item, index) => (
                  <div
                    key={index}
                    draggable={!submitted}
                    onDragStart={(e) => handleDragStart(e, item)}
                    className={`px-3 py-2 rounded-lg cursor-move font-medium transition ${
                      submitted
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {question.blanks?.map((blank, blankIndex) => (
                <div key={blankIndex} className="flex items-center gap-2">
                  <span className="text-gray-700">{blankIndex + 1}.</span>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropToBlank(e, blankIndex)}
                    className={`flex-1 min-h-12 p-3 border-2 border-dashed rounded-lg transition-colors ${
                      userAnswer?.[blankIndex]
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {userAnswer?.[blankIndex] ? (
                      <span className="font-medium text-green-700">{userAnswer[blankIndex]}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Drop item here...</span>
                    )}
                  </div>
                  {userAnswer?.[blankIndex] && (
                    <button
                      onClick={() => {
                        const newAnswers = [...userAnswer];
                        newAnswers.splice(blankIndex, 1);
                        setUserAnswer(newAnswers);
                      }}
                      className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'rearrange':
        return (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-3 font-semibold">Drag items in the correct order:</p>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                {question.items?.filter((item) => !draggedItems.includes(item)).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleRearrangeAdd(item)}
                    className={`px-3 py-2 rounded-lg cursor-pointer font-medium transition ${
                      submitted
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-3 font-semibold">Your arrangement:</p>
              <div className="space-y-2 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300 min-h-16">
                {draggedItems.length > 0 ? (
                  draggedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                      <span className="text-sm font-medium text-gray-800">{index + 1}. {item}</span>
                      {!submitted && (
                        <button
                          onClick={() => handleRearrangeRemove(index)}
                          className="text-red-600 hover:text-red-800 text-lg leading-none"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-4">Click items above to arrange them...</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-gray-600">Unknown question type: {question.type}</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-3">
            {question.type?.toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
        </div>

        {renderQuestionUI()}

        <div className="mt-6 flex gap-3">
          <button
            onClick={checkAnswer}
            disabled={submitted || userAnswer === null}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
          >
            Submit Answer
          </button>
          {submitted && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>

      {submitted && autoShowCorrect && (
        <div className={`rounded-xl p-6 border-2 ${
          isCorrect
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <p className={`text-lg font-semibold mb-3 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>

          {!isCorrect && (
            <div className="space-y-2 mb-3">
              <p className="text-sm text-gray-700">
                <strong>Correct answer:</strong> {question.answer || JSON.stringify(question.correct)}
              </p>
            </div>
          )}

          {question.explanation && (
            <div className="p-3 bg-white rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-gray-800">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
