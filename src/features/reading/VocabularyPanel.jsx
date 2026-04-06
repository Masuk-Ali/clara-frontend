import React, { useState } from 'react';

export default function VocabularyPanel({
  savedWords,
  wordData,
  onRemoveWord
}) {
  const [sortBy, setSortBy] = useState('recent');

  const savedWordsList = Object.entries(savedWords)
    .filter(([_, saved]) => saved)
    .map(([word]) => word);

  const sortedWords = [...savedWordsList].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.localeCompare(b);
    }
    return 0;
  });

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-800">📚 My Vocabulary</h3>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-purple-300 rounded text-sm bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <span className="text-sm text-purple-700 font-semibold">
            {savedWordsList.length} words
          </span>
        </div>
      </div>

      {savedWordsList.length === 0 ? (
        <p className="text-purple-700 text-center py-6">
          No saved words yet. Click on words in the passage to save them!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedWords.map((word) => (
            <div
              key={word}
              className="bg-white rounded-lg p-3 shadow-sm border border-purple-100 hover:border-purple-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm capitalize">{word}</p>
                  {wordData && wordData[word] && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {wordData[word].definition || 'No definition'}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onRemoveWord(word)}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none"
                  title="Remove from vocabulary"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
