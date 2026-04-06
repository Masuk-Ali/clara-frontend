import React, { useEffect } from 'react';

export default function WordPopup({
  word,
  wordData,
  position,
  onClose,
  onSaveWord,
  isSaved
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm z-50"
        style={{
          left: `${Math.min(position.x - 200, window.innerWidth - 240)}px`,
          top: `${Math.min(position.y, window.innerHeight - 300)}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 capitalize">{word}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {wordData.pronunciation && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Pronunciation</p>
              <p className="text-sm text-gray-700 italic">{wordData.pronunciation}</p>
            </div>
          )}

          {wordData.partOfSpeech && (
            <div>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                {wordData.partOfSpeech}
              </span>
            </div>
          )}

          {wordData.definition && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Definition</p>
              <p className="text-sm text-gray-800">{wordData.definition}</p>
            </div>
          )}

          {wordData.example && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Example</p>
              <p className="text-sm text-gray-700 italic">{wordData.example}</p>
            </div>
          )}

          {wordData.synonyms && wordData.synonyms.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Synonyms</p>
              <div className="flex flex-wrap gap-1">
                {wordData.synonyms.map((syn, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onSaveWord(word)}
          className={`w-full mt-4 px-3 py-2 rounded-lg font-medium transition ${
            isSaved
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
          }`}
        >
          {isSaved ? '✓ Saved' : '+ Save to Vocabulary'}
        </button>
      </div>
    </div>
  );
}
