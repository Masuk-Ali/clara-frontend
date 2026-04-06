import { useState, useEffect } from 'react';

export default function WordPopup({ word, wordData, position, onClose, onSaveWord, isSaved }) {
  const [showBengali, setShowBengali] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);

  useEffect(() => {
    // Reset states when word changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setShowBengali(false);
    setShowGrammar(false);
  }, [word]);

  if (!wordData) return null;

  const handleSaveWord = () => {
    onSaveWord(word);
  };

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50 min-w-80 max-w-md"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* Word header */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-blue-600">{word}</h3>
        <p className="text-sm text-gray-500 italic">{wordData.pronunciation}</p>
      </div>

      {/* English meaning */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-700 mb-1">English Meaning:</h4>
        <p className="text-gray-800">{wordData.english}</p>
      </div>

      {/* Bengali meaning */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-700 mb-1">Bengali Meaning:</h4>
        <p className="text-lg text-purple-600 font-medium">{wordData.bengali}</p>
      </div>

      {/* Example sentence */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-700 mb-1">Example:</h4>
        <p className="text-gray-700 italic">"{wordData.example}"</p>
      </div>

      {/* Save to vocabulary button */}
      <button
        onClick={handleSaveWord}
        className={`w-full py-2 px-4 rounded-lg font-medium transition ${
          isSaved
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isSaved ? '✓ Saved to Vocabulary' : '💾 Save to My Vocabulary'}
      </button>

      {/* Additional info toggle */}
      <div className="mt-3 text-center">
        <button
          onClick={() => setShowBengali(!showBengali)}
          className="text-sm text-blue-600 hover:text-blue-800 underline mr-4"
        >
          {showBengali ? 'Hide Bengali' : 'Show Bengali'}
        </button>
        <button
          onClick={() => setShowGrammar(!showGrammar)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showGrammar ? 'Hide Grammar' : 'Show Grammar'}
        </button>
      </div>

      {/* Additional content */}
      {showBengali && (
        <div className="mt-3 p-3 bg-purple-50 rounded border-l-4 border-purple-400">
          <h4 className="font-semibold text-purple-700 mb-1">Bengali Context:</h4>
          <p className="text-purple-800">This word appears in Bengali as part of compound words or phrases in historical contexts.</p>
        </div>
      )}

      {showGrammar && (
        <div className="mt-3 p-3 bg-green-50 rounded border-l-4 border-green-400">
          <h4 className="font-semibold text-green-700 mb-1">Grammar Note:</h4>
          <p className="text-green-800">This is a noun/adjective that can be used in various grammatical constructions in English.</p>
        </div>
      )}
    </div>
  );
}