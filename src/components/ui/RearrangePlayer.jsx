import { useRef, useState, useEffect } from 'react';
import { useRearrange } from '../../hooks/useRearrange';

export default function RearrangePlayer({ story, onBack, classId }) {
  const {
    selectedOrder,
    availableSentences,
    submitted,
    isCorrect,
    selectSentence,
    deselectSentence,
    checkAnswer,
    reset,
  } = useRearrange(story);

  const [popup, setPopup] = useState(null); // { type, text, x, y, id }
  const [errorId, setErrorId] = useState(null);
  const [shuffledPool, setShuffledPool] = useState([]);
  const canSubmit = selectedOrder.length === story.sentences.length && !submitted;
  const progress = (selectedOrder.length / story.sentences.length) * 100;

  // Fisher-Yates Shuffle Utility
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Auto-close popups
  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setPopup(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  // Sync local pool when availableSentences change (items removed)
  useEffect(() => {
    const currentIds = availableSentences.map(s => s.id).sort().join(',');
    const existingIds = shuffledPool.map(s => s.id).sort().join(',');
    if (currentIds !== existingIds) {
      setShuffledPool(shuffleArray(availableSentences));
    }
  }, [availableSentences]);

  const handleWordClick = (e, word, sentence) => {
    e.stopPropagation();
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    const meaning = sentence.wordMeanings?.[cleanWord];

    setPopup({
      type: 'meaning',
      text: meaning ? `${word}: ${meaning}` : `${word}: No meaning available`,
      sentenceId: sentence.id,
      id: `w-${sentence.id}-${word}`
    });
  };

  const handleDoubleClick = (e, sentence) => {
    e.stopPropagation();
    setPopup({
      type: 'translation',
      text: sentence.bengaliTranslation || sentence.translation || "Translation not available",
      sentenceId: sentence.id,
      id: `t-${sentence.id}`
    });
  };

  // Swipe Logic
  const swipeRef = useRef({ x: 0, y: 0, isSwiping: false });

  const handleStart = (e) => {
    const point = e.type.includes('touch') ? e.touches[0] : e;
    swipeRef.current = { x: point.clientX, y: point.clientY, isSwiping: false };
  };

  const handleEnd = (e, sentence) => {
    if (submitted && isCorrect) return;
    const point = e.type.includes('touch') ? e.changedTouches[0] : e;
    const dx = point.clientX - swipeRef.current.x;
    const dy = point.clientY - swipeRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 30) {
      swipeRef.current.isSwiping = true;
      
      // Check if this is the next correct sentence in the story sequence
      const nextExpectedIndex = story.correctOrder[selectedOrder.length];
      
      // Fix: Compare as numbers to ensure accuracy
      if (Number(sentence.id) === nextExpectedIndex) {
        selectSentence(sentence);
        setErrorId(null);
      } else {
        setErrorId(sentence.id);
        // Reshuffle ONLY the remaining unsolved sentences on error
        setShuffledPool(shuffleArray(shuffledPool));
        setTimeout(() => setErrorId(null), 500);
      }
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

      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-800 dark:text-white">{story.title}</h3>
          <span className="text-xs font-black text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
            {selectedOrder.length}/{story.sentences.length}
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Solved Sentences */}
        {selectedOrder.map((sentence, index) => (
          <div
            key={`correct-${sentence.id}`}
            onDoubleClick={(e) => handleDoubleClick(e, sentence)}
            className="relative p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 flex items-start gap-4 animate-in slide-in-from-top-2 duration-300"
          >
            {/* Relative Tooltip */}
            {popup && popup.sentenceId === sentence.id && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl shadow-2xl pointer-events-none animate-in fade-in zoom-in duration-200 max-w-[280px] text-center text-xs font-bold border transition-all ${
                  popup.type === 'meaning' 
                    ? 'bg-indigo-600 text-white border-indigo-400 bottom-full mb-3' 
                    : 'bg-emerald-700 text-white border-emerald-500 top-full mt-3'
                }`}
              >
                {popup.text}
                <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                  popup.type === 'meaning' ? 'bg-indigo-600 -bottom-1.5' : 'bg-emerald-700 -top-1.5'
                }`} />
              </div>
            )}
            <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
              {index + 1}
            </span>
            <div className="text-sm leading-relaxed text-green-900 dark:text-green-100 font-medium">
              {sentence.text.split(' ').map((word, wIdx) => (
                <span 
                  key={wIdx} 
                  className="px-0.5 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                  onClick={(e) => handleWordClick(e, word, sentence)}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Unified Pool List */}
        {shuffledPool.length > 0 && (
          <div className="space-y-4 pt-2">
            {selectedOrder.length > 0 && (
              <div className="flex items-center gap-3 opacity-30">
                <div className="h-px bg-gray-400 flex-1"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Next Step</span>
                <div className="h-px bg-gray-400 flex-1"></div>
              </div>
            )}
            {shuffledPool.map((sentence) => (
              <div
                key={`pool-${sentence.id}`}
                onMouseDown={handleStart}
                onMouseUp={(e) => handleEnd(e, sentence)}
                onTouchStart={handleStart}
                onTouchEnd={(e) => handleEnd(e, sentence)}
                onDoubleClick={(e) => handleDoubleClick(e, sentence)}
                className={`relative p-5 rounded-3xl bg-white dark:bg-gray-800 shadow-lg border-2 border-b-[6px] transition-all cursor-grab active:scale-95 select-none group ${
                  errorId === sentence.id 
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/10 animate-shake' 
                    : 'border-gray-200 dark:border-gray-700 active:border-amber-400'
                }`}
              >
                {/* Relative Tooltip */}
                {popup && popup.sentenceId === sentence.id && (
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl shadow-2xl pointer-events-none animate-in fade-in zoom-in duration-200 max-w-[280px] text-center text-xs font-bold border transition-all ${
                      popup.type === 'meaning' 
                        ? 'bg-indigo-600 text-white border-indigo-400 bottom-full mb-3' 
                        : 'bg-emerald-700 text-white border-emerald-500 top-full mt-3'
                    }`}
                  >
                    {popup.text}
                    <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                      popup.type === 'meaning' ? 'bg-indigo-600 -bottom-1.5' : 'bg-emerald-700 -top-1.5'
                    }`} />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex-1 flex flex-wrap gap-x-2 gap-y-1.5">
                    {sentence.text.split(' ').map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-sm border border-gray-100 dark:border-gray-600"
                        onClick={(e) => handleWordClick(e, word, sentence)}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-300 dark:text-gray-600 pt-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="6" cy="2" r="1.5"/><circle cx="10" cy="2" r="1.5"/><circle cx="2" cy="6" r="1.5"/><circle cx="6" cy="6" r="1.5"/><circle cx="10" cy="6" r="1.5"/><circle cx="2" cy="10" r="1.5"/><circle cx="6" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/></svg>
                  </div>
                </div>
                {errorId === sentence.id && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                    Try again!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-8 pb-4 flex gap-4">
        <button
          onClick={checkAnswer}
          disabled={!canSubmit}
          className="flex-1 py-4 bg-amber-600 text-white rounded-2xl shadow-[0_5px_0_rgb(180,83,9)] active:translate-y-1 active:shadow-none transition-all font-black text-sm uppercase tracking-widest disabled:bg-gray-200 disabled:shadow-none"
        >
          {submitted ? 'Well Done!' : 'Finish Activity'}
        </button>
        {submitted && (
          <button
            onClick={reset}
            className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold active:scale-95 transition-all"
          >
            Reset
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
