import { useRef } from 'react';
import { useRearrange } from '../../hooks/useRearrange';

export default function RearrangePlayer({ story, onBack, classId }) {
  const {
    selectedOrder,
    availableSentences,
    submitted,
    isCorrect,
    hint,
    selectSentence,
    deselectSentence,
    reorderSelected,
    showWordMeaning,
    showTranslation,
    checkAnswer,
    reset,
    setHint,
  } = useRearrange(story);

  const canSubmit = selectedOrder.length === story.sentences.length && !submitted;

  // Swipe Logic
  const swipeRef = useRef({ x: 0, y: 0, isSwiping: false });

  const handleStart = (e) => {
    const point = e.type.includes('touch') ? e.touches[0] : e;
    swipeRef.current = { x: point.clientX, y: point.clientY, isSwiping: false };
  };

  const handleEnd = (e, sentence, isSelected) => {
    if (submitted && isCorrect) return;
    const point = e.type.includes('touch') ? e.changedTouches[0] : e;
    const dx = point.clientX - swipeRef.current.x;
    const dy = point.clientY - swipeRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 30) {
      swipeRef.current.isSwiping = true;
      if (isSelected) {
        deselectSentence(sentence);
      } else {
        selectSentence(sentence);
      }
    }
  };

  const handleWordClick = (e, word, sentence) => {
    e.stopPropagation();
    if (!swipeRef.current.isSwiping) {
      showWordMeaning(word, sentence);
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors mb-4"
      >
        ← Back to Stories
      </button>

      <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg">
        <h3 className="text-amber-800 dark:text-amber-200 font-semibold mb-1">
          {story.title}
        </h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm">
          Swipe a sentence in any direction to move it. Click words for meanings, double-click for translation.
        </p>
      </div>

      {hint && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm flex justify-between items-center animate-pulse">
          <span className="text-blue-800 dark:text-blue-200">
            <strong className="uppercase mr-2">{hint.type}:</strong> {hint.text}
          </span>
          <button 
            onClick={() => setHint(null)} 
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Sentences */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
            📝 Available Sentences ({availableSentences.length})
          </h4>
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl min-h-[300px] border-2 border-transparent">
            {availableSentences.length > 0 ? (
              availableSentences.map((sentence, idx) => (
                <div
                  key={sentence.id}
                  onMouseDown={handleStart}
                  onMouseUp={(e) => handleEnd(e, sentence, false)}
                  onTouchStart={handleStart}
                  onTouchEnd={(e) => handleEnd(e, sentence, false)}
                  onDoubleClick={() => showTranslation(sentence)}
                  className={`w-full p-3 rounded-lg text-left text-sm transition-all cursor-pointer select-none ${
                    submitted && isCorrect
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-700 border-l-4 border-blue-400 hover:shadow-md dark:text-white'
                  }`}
                >
                  <div className="flex items-start gap-2 pointer-events-none">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-300">
                      ?
                    </span>
                    <div className="flex-1 flex flex-wrap gap-x-1 pointer-events-auto">
                      {sentence.text.split(' ').map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className="hover:text-blue-600 cursor-help px-0.5 rounded hover:bg-blue-50 transition-colors"
                          onClick={(e) => handleWordClick(e, word, sentence)}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                All sentences selected ✓
              </div>
            )}
          </div>
        </div>

        {/* Selected Order */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
            ✓ Your Order ({selectedOrder.length}/{story.sentences.length})
          </h4>
          <div className="space-y-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl min-h-[300px] border-l-4 border-green-500">
            {selectedOrder.length > 0 ? (
              selectedOrder.map((sentence, index) => (
                <div
                  key={sentence.id}
                  onMouseDown={handleStart}
                  onMouseUp={(e) => handleEnd(e, sentence, true)}
                  onTouchStart={handleStart}
                  onTouchEnd={(e) => handleEnd(e, sentence, true)}
                  onDoubleClick={() => showTranslation(sentence)}
                  className="p-3 rounded-lg bg-green-100 dark:bg-green-900/40 border-l-4 border-green-600 flex items-start gap-2 cursor-pointer select-none"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1 text-sm dark:text-white flex flex-wrap gap-x-1">
                    {sentence.text.split(' ').map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="hover:text-green-700 cursor-help"
                        onClick={(e) => handleWordClick(e, word, sentence)}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Click sentences to add them here in order
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={checkAnswer}
          disabled={!canSubmit}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
        >
          {submitted ? 'Submitted' : 'Check Answer'}
        </button>
        {submitted && (
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Result */}
      {submitted && (
        <div
          className={`rounded-xl p-6 border-2 ${
            isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
          }`}
        >
          <p
            className={`text-lg font-semibold mb-3 ${
              isCorrect ? 'text-green-900' : 'text-red-900'
            }`}
          >
            {isCorrect ? '✓ Correct Order!' : '✗ Incorrect Order'}
          </p>

          {!isCorrect && (
            <div className="space-y-2 mb-3 p-3 bg-white rounded-lg border-l-4 border-red-400">
              <p className="text-sm font-semibold text-gray-800">Correct order:</p>
              <div className="space-y-1">
                {story.correctOrder.map((idx, position) => (
                  <p key={idx} className="text-sm text-gray-700">
                    {position + 1}. {story.sentences[idx]?.text}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
