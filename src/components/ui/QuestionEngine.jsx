import React, { useState, useRef, useEffect } from 'react';

export default function QuestionEngine({
  question = {},
  onSubmit = () => {},
  autoShowCorrect = true
}) {
  const [userAnswer, setUserAnswer] = useState(null);
  const [draggedItems, setDraggedItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [initialDraggedItems, setInitialDraggedItems] = useState([]);
  const [hint, setHint] = useState(null);

  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array, correctOrder) => {
    let shuffled = [...array];
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // Ensure it doesn't start in the correct order
    } while (shuffled.length > 1 && JSON.stringify(shuffled.map(i => parseInt(i.id))) === JSON.stringify(correctOrder));
    return shuffled;
  };

  useEffect(() => {
    if (question.type === 'rearrange' && question.items) {
      // Map strings to objects if necessary, using index as ID
      const normalizedItems = question.items.map((item, idx) => 
        typeof item === 'string' 
          ? { id: idx.toString(), text: item } 
          : { ...item, id: (item.id || idx).toString() }
      );
      const shuffledItems = shuffleArray(normalizedItems, question.correct);
      setDraggedItems(shuffledItems);
      // Store the initial shuffled order to snap back if incorrect
      setInitialDraggedItems(shuffledItems);

    }
  }, [question]);

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

  const handleSentenceDoubleClick = (item) => {
    if (submitted && isCorrect) return; // Do not show hints if already correct and submitted
    setHint({ 
      type: 'Bengali Translation', 
      text: item.bengaliTranslation || item.translation || 'No translation available',
      index: item.id
    });
  };

  const checkAnswer = () => {
    let correct = false;

    switch (question.type) {
      case 'mcq': // Fallthrough for MCQ, fill_blank, drag_drop
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
        const currentOrder = draggedItems.map(item => parseInt(item.id));
        correct = JSON.stringify(currentOrder) === JSON.stringify(question.correct);
        if (!correct) {
          setTimeout(() => {
            setSubmitted(false);
            // Reshuffle items instead of snapping back to fixed initial order
            const normalizedItems = question.items.map((item, idx) => 
              typeof item === 'string' 
                ? { id: idx.toString(), text: item } 
                : { ...item, id: (item.id || idx).toString() }
            );
            setDraggedItems(shuffleArray(normalizedItems, question.correct));
            setIsCorrect(null);
          }, 1500);
        }
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
    if (question.type === 'rearrange') {
      const normalizedItems = question.items.map((item, idx) => 
        typeof item === 'string' 
          ? { id: idx.toString(), text: item } 
          : { ...item, id: (item.id || idx).toString() }
      );
      setDraggedItems(shuffleArray(normalizedItems, question.correct));
    } else {
      setDraggedItems([]);
    }
    setSubmitted(false);
    setIsCorrect(null);
    setHint(null);
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
          <div className="space-y-4">
            {hint && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm flex justify-between items-center animate-fade-in">
                <span className="text-blue-800 dark:text-blue-200">
                  <strong className="uppercase mr-2">{hint.type}:</strong> {hint.text}
                </span>
                <button onClick={() => setHint(null)} className="text-blue-500 hover:text-blue-700">✕</button>
              </div>
            )}
            <div className="space-y-2">
              {draggedItems.map((item, index) => (
                <div
                  key={item.id}
                  draggable={!(submitted && isCorrect)}
                  onDragStart={(e) => e.dataTransfer.setData('index', index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const fromIndex = e.dataTransfer.getData('index');
                    const newItems = [...draggedItems];
                    const [movedItem] = newItems.splice(fromIndex, 1);
                    newItems.splice(index, 0, movedItem);
                    setDraggedItems(newItems);
                  }} // Only allow dropping if not submitted or if submitted and incorrect (to allow snap back)
                  onDoubleClick={() => handleSentenceDoubleClick(item)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer select-none flex items-center gap-4 ${
                    submitted && isCorrect 
                      ? 'bg-green-50 border-green-500 cursor-default shadow-sm' 
                      : submitted && !isCorrect 
                        ? 'bg-red-50 border-red-500 animate-pulse' 
                        : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md active:cursor-grabbing'
                  }`}
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {index + 1}
                  </span>
                  <div className="text-gray-800 flex-1 flex flex-wrap gap-x-1">
                    {item.text.split(' ').map((word, wIdx) => {
                      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
                      const meaning = item.wordMeanings?.[cleanWord];
                      return (
                        <span
                          key={wIdx}
                          className={`px-0.5 rounded transition-colors ${meaning ? 'cursor-help hover:bg-blue-100 text-blue-700 font-medium' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (meaning) {
                               const en = typeof meaning === 'object' ? meaning.english : "Not available";
                               const bn = typeof meaning === 'object' ? meaning.bengali : meaning;
                               setHint({ 
                                 type: 'Word Meaning', 
                                 text: `${word.toUpperCase()}\nবাংলা: ${bn}\nEnglish: ${en}` 
                               });
                            }
                          }}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
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
            disabled={submitted || (question.type !== 'rearrange' && userAnswer === null) || (question.type === 'rearrange' && draggedItems.length === 0)}
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
