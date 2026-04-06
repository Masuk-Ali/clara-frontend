import { useState } from 'react';

export default function QuestionEngine({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [dragItems, setDragItems] = useState({});

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

  const handleFillBlankChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value
    });
  };

  const handleDragStart = (e, item, type) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, type }));
  };

  const handleDrop = (e, questionIndex, targetType) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

    if (data.type === targetType) {
      if (targetType === 'blank') {
        setAnswers({
          ...answers,
          [questionIndex]: data.item
        });
      } else if (targetType === 'match') {
        setDragItems({
          ...dragItems,
          [questionIndex]: {
            ...dragItems[questionIndex],
            [data.item]: true
          }
        });
      } else if (targetType === 'rearrange') {
        const currentOrder = dragItems[questionIndex] || [];
        const newOrder = [...currentOrder];
        if (!newOrder.includes(data.item)) {
          newOrder.push(data.item);
        }
        setDragItems({
          ...dragItems,
          [questionIndex]: newOrder
        });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (questionIndex) => {
    setSubmitted({
      ...submitted,
      [questionIndex]: true
    });
  };

  const resetQuestion = (questionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: undefined
    });
    setSubmitted({
      ...submitted,
      [questionIndex]: false
    });
    setDragItems({
      ...dragItems,
      [questionIndex]: undefined
    });
  };

  const renderQuestion = (question, index) => {
    const isSubmitted = submitted[index];
    const userAnswer = answers[index];

    switch (question.type) {
      case 'mcq':
        return (
          <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Question {index + 1} (MCQ)</h3>
            <p className="mb-4 text-gray-800">{question.question}</p>

            <div className="space-y-3 mb-4">
              {question.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optIndex}
                    checked={userAnswer === optIndex}
                    onChange={() => handleMCQChange(index, optIndex)}
                    disabled={isSubmitted}
                    className="text-blue-600"
                  />
                  <span className={isSubmitted && optIndex === question.correct ? 'text-green-600 font-semibold' : ''}>
                    {option}
                  </span>
                  {isSubmitted && optIndex === question.correct && <span className="text-green-600">✓</span>}
                  {isSubmitted && userAnswer === optIndex && optIndex !== question.correct && <span className="text-red-600">✗</span>}
                </label>
              ))}
            </div>

            {!isSubmitted ? (
              <button
                onClick={() => handleSubmit(index)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Answer
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800">Explanation:</h4>
                  <p className="text-blue-700 mt-1">{question.explanation}</p>
                </div>
                <button
                  onClick={() => resetQuestion(index)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        );

      case 'short':
        return (
          <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Question {index + 1} (Short Answer)</h3>
            <p className="mb-4 text-gray-800">{question.question}</p>

            <input
              type="text"
              value={userAnswer || ''}
              onChange={(e) => handleShortAnswerChange(index, e.target.value)}
              disabled={isSubmitted}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your answer..."
            />

            {!isSubmitted ? (
              <button
                onClick={() => handleSubmit(index)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800">Correct Answer:</h4>
                  <p className="text-green-700 mt-1">{question.answer}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800">Explanation:</h4>
                  <p className="text-blue-700 mt-1">{question.explanation}</p>
                </div>
                <button
                  onClick={() => resetQuestion(index)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        );

      case 'fill_blank_no_clue':
        return (
          <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Question {index + 1} (Fill in the Blank)</h3>
            <p className="mb-4 text-gray-800">{question.question}</p>

            <input
              type="text"
              value={userAnswer || ''}
              onChange={(e) => handleFillBlankChange(index, e.target.value)}
              disabled={isSubmitted}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Fill in the blank..."
            />

            {!isSubmitted ? (
              <button
                onClick={() => handleSubmit(index)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800">Correct Answer:</h4>
                  <p className="text-green-700 mt-1 font-mono">{question.answer}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800">Explanation:</h4>
                  <p className="text-blue-700 mt-1">{question.explanation}</p>
                </div>
                <button
                  onClick={() => resetQuestion(index)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        );

      case 'fill_blank_with_clue':
        return (
          <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Question {index + 1} (Fill in the Blank with Clue)</h3>
            <p className="mb-4 text-gray-800">{question.question}</p>

            {/* Word bank */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Word Bank:</h4>
              <div className="flex flex-wrap gap-2">
                {question.words.map((word, wordIndex) => (
                  <div
                    key={wordIndex}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word, 'word')}
                    className="px-3 py-1 bg-white border border-gray-300 rounded cursor-move hover:bg-blue-50 transition"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDrop={(e) => handleDrop(e, index, 'blank')}
              onDragOver={handleDragOver}
              className="min-h-12 p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-blue-400 transition"
            >
              {userAnswer ? (
                <span className="text-lg font-medium text-blue-600">{userAnswer}</span>
              ) : (
                <span className="text-gray-400">Drop a word here...</span>
              )}
            </div>

            {!isSubmitted ? (
              <button
                onClick={() => handleSubmit(index)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800">Correct Answer:</h4>
                  <p className="text-green-700 mt-1 font-mono">{question.answer}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800">Explanation:</h4>
                  <p className="text-blue-700 mt-1">{question.explanation}</p>
                </div>
                <button
                  onClick={() => resetQuestion(index)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        );

      case 'matching':
        return (
          <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Question {index + 1} (Matching)</h3>
            <p className="mb-4 text-gray-800">{question.question}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.pairs.map((pair, pairIndex) => (
                <div key={pairIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">{pair.left}</span>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1">
                    <span>{pair.right}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800">Explanation:</h4>
              <p className="text-blue-700 mt-1">{question.explanation}</p>
            </div>
          </div>
        );

      case 'rearrangement': {
        const currentOrder = dragItems[index] || [];
        const isCorrectOrder = JSON.stringify(currentOrder) === JSON.stringify(question.correctOrder.map(i => question.sentences[i]));

        return (
          <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Question {index + 1} (Rearrangement)</h3>
            <p className="mb-4 text-gray-800">{question.question}</p>

            {/* Sentence bank */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Sentence Bank:</h4>
              <div className="space-y-2">
                {question.sentences.map((sentence, sentenceIndex) => (
                  <div
                    key={sentenceIndex}
                    draggable
                    onDragStart={(e) => handleDragStart(e, sentence, 'rearrange')}
                    className="p-2 bg-white border border-gray-300 rounded cursor-move hover:bg-blue-50 transition"
                  >
                    {sentence}
                  </div>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Arrange in correct order:</h4>
              <div className="min-h-32 p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                {currentOrder.length === 0 ? (
                  <p className="text-gray-400">Drop sentences here in correct order...</p>
                ) : (
                  <ol className="list-decimal list-inside space-y-2">
                    {currentOrder.map((sentence, orderIndex) => (
                      <li key={orderIndex} className="text-gray-800">
                        {sentence}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>

            {!isSubmitted ? (
              <button
                onClick={() => handleSubmit(index)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Check Order
              </button>
            ) : (
              <div className="mt-4 space-y-3">
                <div className={`p-4 rounded-lg border-l-4 ${
                  isCorrectOrder
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}>
                  <h4 className={`font-semibold ${
                    isCorrectOrder ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isCorrectOrder ? 'Correct Order!' : 'Incorrect Order'}
                  </h4>
                  {!isCorrectOrder && (
                    <div className="mt-2">
                      <p className="font-medium text-gray-700">Correct order:</p>
                      <ol className="list-decimal list-inside mt-1 text-sm">
                        {question.correctOrder.map(i => question.sentences[i]).map((sentence, orderIndex) => (
                          <li key={orderIndex}>{sentence}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800">Explanation:</h4>
                  <p className="text-blue-700 mt-1">{question.explanation}</p>
                </div>
                <button
                  onClick={() => resetQuestion(index)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Practice Questions</h2>
      {questions.map((question, index) => renderQuestion(question, index))}
    </div>
  );
}