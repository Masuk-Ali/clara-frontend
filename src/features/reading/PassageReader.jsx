import React, { useState, useRef, useEffect } from 'react';
import WordPopup from './WordPopup';
import VocabularyPanel from './VocabularyPanel';
import QuestionEngine from './QuestionEngine';

const PassageReader = ({
  passage,
  wordData,
  sentenceExplanations,
  questions
}) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordPosition, setWordPosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [savedWords, setSavedWords] = useState({});
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState(null);
  const passageRef = useRef(null);

  // Load saved words from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('clara-vocabulary');
    if (saved) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setSavedWords(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  // Save words to localStorage whenever savedWords changes
  useEffect(() => {
    localStorage.setItem('clara-vocabulary', JSON.stringify(savedWords));
  }, [savedWords]);

  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);

  const handleWordClick = (word, event) => {
    event.stopPropagation();
    const rect = event.target.getBoundingClientRect();
    setWordPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setSelectedWord(word.toLowerCase());
    setClickCount(prev => prev + 1);
    setSelectedSentence(null);
  };

  const handleSentenceClick = (sentenceIndex, event) => {
    event.stopPropagation();
    if (clickCount === 2) {
      setSelectedSentence(sentenceIndex);
      setClickCount(0);
    }
  };

  const handlePassageClick = () => {
    setSelectedWord(null);
    setSelectedSentence(null);
    setClickCount(0);
  };

  const handleSaveWord = (word) => {
    setSavedWords(prev => ({
      ...prev,
      [word]: !prev[word]
    }));
  };

  const handleRemoveWord = (word) => {
    setSavedWords(prev => ({
      ...prev,
      [word]: false
    }));
  };

  const renderWord = (word, index) => {
    const lowerWord = word.toLowerCase().replace(/[^\w]/g, '');
    const isSaved = savedWords[lowerWord];
    const hasData = wordData && wordData[lowerWord];

    return (
      <span
        key={index}
        className={`inline-block px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-all duration-200 ${
          hasData
            ? isSaved
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'hover:bg-blue-100 hover:text-blue-800'
            : ''
        }`}
        onClick={(e) => hasData && handleWordClick(word, e)}
        title={hasData ? (isSaved ? 'Saved to vocabulary' : 'Click for meaning') : ''}
      >
        {word}
        {isSaved && <span className="ml-1 text-green-600">★</span>}
      </span>
    );
  };

  const renderSentence = (sentence, index) => {
    const words = sentence.trim().split(/\s+/);
    const processedWords = words.map((word, wordIndex) => renderWord(word, `${index}-${wordIndex}`));

    return (
      <span
        key={index}
        className={`block mb-4 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          selectedSentence === index
            ? 'bg-yellow-50 border-l-4 border-yellow-400'
            : 'hover:bg-gray-50'
        }`}
        onClick={(e) => handleSentenceClick(index, e)}
      >
        {processedWords}
        {selectedSentence === index && sentenceExplanations && sentenceExplanations[index] && (
          <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-1">Bengali Translation:</h4>
            <p className="text-blue-700 mb-2">{sentenceExplanations[index].bengali}</p>
            <h4 className="font-semibold text-green-800 mb-1">Grammar Explanation:</h4>
            <p className="text-green-700">{sentenceExplanations[index].grammar}</p>
          </div>
        )}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-center">Interactive Passage Reader</h2>
        <button
          onClick={() => setShowVocabulary(!showVocabulary)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          📚 My Vocabulary ({Object.values(savedWords).filter(Boolean).length})
        </button>
      </div>

      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <p className="text-blue-800 text-sm">
          <strong>Instructions:</strong>
          • Click once on a word to see its meaning
          • Click twice on a sentence to see Bengali translation and grammar
          • Click thrice on a sentence for grammar explanation
          • Save important words to your vocabulary
        </p>
      </div>

      {showVocabulary && (
        <div className="mb-6">
          <VocabularyPanel
            savedWords={savedWords}
            wordData={wordData}
            onRemoveWord={handleRemoveWord}
          />
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Passage:</h3>
        <div
          ref={passageRef}
          className="text-gray-800 leading-relaxed select-none"
          onClick={handlePassageClick}
        >
          {sentences.map((sentence, index) => renderSentence(sentence.trim(), index))}
        </div>
      </div>

      {/* Word Popup */}
      {selectedWord && wordData && wordData[selectedWord] && (
        <WordPopup
          word={selectedWord}
          wordData={wordData[selectedWord]}
          position={wordPosition}
          onClose={() => setSelectedWord(null)}
          onSaveWord={handleSaveWord}
          isSaved={savedWords[selectedWord]}
        />
      )}

      {/* Questions Section */}
      {questions && questions.length > 0 && (
        <QuestionEngine questions={questions} />
      )}
    </div>
  );
};

export default PassageReader;