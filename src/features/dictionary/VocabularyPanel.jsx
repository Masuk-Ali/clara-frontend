import { useState } from 'react';

export default function VocabularyPanel({ savedWords, wordData, onRemoveWord }) {
  const [filter, setFilter] = useState('all'); // all, saved

  const filteredWords = filter === 'saved'
    ? Object.keys(savedWords).filter(word => savedWords[word])
    : Object.keys(wordData || {});

  const handleRemoveWord = (word) => {
    onRemoveWord(word);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Vocabulary</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Words
          </button>
          <button
            onClick={() => setFilter('saved')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'saved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Saved ({Object.values(savedWords).filter(Boolean).length})
          </button>
        </div>
      </div>

      {filteredWords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📚</div>
          <p>No vocabulary words yet.</p>
          <p className="text-sm">Click on words in the passage to save them!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((word) => {
            const data = wordData[word];
            if (!data) return null;

            return (
              <div key={word} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-blue-600">{word}</h3>
                    <p className="text-sm text-gray-500 italic">{data.pronunciation}</p>
                  </div>
                  {savedWords[word] && (
                    <button
                      onClick={() => handleRemoveWord(word)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Remove from vocabulary"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">English:</span>
                    <span className="ml-2 text-gray-800">{data.english}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Bengali:</span>
                    <span className="ml-2 text-purple-600 font-medium">{data.bengali}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Example:</span>
                    <p className="ml-2 text-gray-700 italic text-sm">"{data.example}"</p>
                  </div>
                </div>

                {savedWords[word] && (
                  <div className="mt-3 flex items-center text-green-600 text-sm">
                    <span className="mr-1">✓</span>
                    Saved to vocabulary
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {Object.values(savedWords).filter(Boolean).length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Vocabulary Progress</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">
              {Object.values(savedWords).filter(Boolean).length} words saved
            </span>
            <span className="text-green-600">
              Keep learning! 📚
            </span>
          </div>
        </div>
      )}
    </div>
  );
}