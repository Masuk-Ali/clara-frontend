import React, { useState, useRef, useEffect } from 'react';
import WordPopup from './WordPopup';
import VocabularyPanel from './VocabularyPanel';
import QuestionEngine from './QuestionEngine';
import QuestionAnswerSection from '../../components/ui/QuestionAnswerSection';

const PassageReader = ({
  passage = '',
  wordData = {},
  sentenceExplanations = {},
  mcqs = [],
  questions = [],
  title = 'Interactive Passage Reader',
  mcqTitle = 'Multiple Choice Questions',
  questionTitle = 'Comprehension Questions'
}) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordPosition, setWordPosition] = useState({ x: 0, y: 0 });
  const [savedWords, setSavedWords] = useState({});
  const [showVocabulary, setShowVocabulary] = useState(false);

  const [selectedSentence, setSelectedSentence] = useState(null);
  const [sentenceExplanationLevel, setSentenceExplanationLevel] = useState(null);

  const sentenceClickCount = useRef(0);
  const sentenceClickTimer = useRef(null);
  const lastClickedSentence = useRef(null);

  const passageRef = useRef(null);
  

  // Load saved words from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('clara-vocabulary');

    if (saved) {
      try {
        setSavedWords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved vocabulary:', e);
      }
    }
  }, []);

  // Save words to localStorage whenever savedWords changes
  useEffect(() => {
    localStorage.setItem(
      'clara-vocabulary',
      JSON.stringify(savedWords)
    );
  }, [savedWords]);

  // Clean up sentence click timer
  useEffect(() => {
    return () => {
      if (sentenceClickTimer.current) {
        clearTimeout(sentenceClickTimer.current);
      }
    };
  }, []);

  /*
   * Keep the paragraph structure from the passage.
   *
   * Paragraphs should be separated in the JSON by a blank line:
   *
   * "First paragraph sentence one. Sentence two.\n\nSecond paragraph..."
   */
  const paragraphs = passage
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

  /*
   * Prepare each paragraph's sentences while preserving punctuation.
   *
   * Example:
   * "Hello world. How are you?"
   *
   * becomes:
   * ["Hello world.", "How are you?"]
   */
  const paragraphData = paragraphs.map(paragraph => ({
    paragraph,
    sentences:
      paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []
  }));

  /*
   * Word click:
   *
   * Every word participates in sentence clicking.
   * Only words that exist in wordData open the WordPopup.
   *
   * IMPORTANT:
   * We deliberately do NOT stop event propagation here.
   * Otherwise sentence double/triple clicks would never work.
   */
  const handleWordClick = (word, event) => {
    const lowerWord = word
      .toLowerCase()
      .replace(/[^\w]/g, '');

    if (wordData && wordData[lowerWord]) {
      const rect = event.target.getBoundingClientRect();

      setWordPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });

      setSelectedWord(lowerWord);
    }
  };

  /*
   * Sentence click system:
   *
   * 1 click = nothing special
   * 2 clicks = Bengali translation
   * 3 clicks = Grammar Forensic
   *
   * A short timer allows us to determine whether the user
   * is making a second or third click.
   */
  const handleSentenceClick = (sentenceIndex, event) => {
    event.stopPropagation();

    if (lastClickedSentence.current !== sentenceIndex) {
      sentenceClickCount.current = 0;
      lastClickedSentence.current = sentenceIndex;
    }

    if (sentenceClickTimer.current) {
      clearTimeout(sentenceClickTimer.current);
    }

    sentenceClickCount.current += 1;

    const currentClickCount = sentenceClickCount.current;

    sentenceClickTimer.current = setTimeout(() => {
      if (currentClickCount === 2) {
        setSelectedSentence(sentenceIndex);
        setSentenceExplanationLevel(2);
      }

      if (currentClickCount >= 3) {
        setSelectedSentence(sentenceIndex);
        setSentenceExplanationLevel(3);
      }

      sentenceClickCount.current = 0;
    }, 350);
  };

  /*
   * Close Bengali / Grammar explanation card.
   */
  const handleCloseSentenceExplanation = (event) => {
    event.stopPropagation();

    setSelectedSentence(null);
    setSentenceExplanationLevel(null);

    sentenceClickCount.current = 0;
    lastClickedSentence.current = null;

    if (sentenceClickTimer.current) {
      clearTimeout(sentenceClickTimer.current);
    }
  };

  /*
   * Clicking elsewhere in the passage closes the word popup.
   *
   * Sentence explanations are NOT closed here.
   * They have their own close button.
   */
  const handlePassageClick = () => {
    setSelectedWord(null);
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

  /*
   * Render one word.
   *
   * All words are clickable for sentence interaction.
   * Only words with wordData get the meaning-popup behavior.
   */
  const renderWord = (word, index) => {
    const lowerWord = word
      .toLowerCase()
      .replace(/[^\w]/g, '');

    const isSaved = savedWords[lowerWord];
    const hasData = wordData && wordData[lowerWord];

    return (
      <span
        key={index}
        className={`inline-block px-1 py-0.5 mx-0.5 rounded transition-all duration-200 ${
          hasData
            ? 'cursor-pointer'
            : 'cursor-text'
        } ${
          hasData
            ? isSaved
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'hover:bg-blue-100 hover:text-blue-800'
            : ''
        }`}
        onClick={(e) => handleWordClick(word, e)}
        title={
          hasData
            ? isSaved
              ? 'Saved to vocabulary'
              : 'Click for meaning'
            : ''
        }
      >
        {word}

        {isSaved && (
          <span className="ml-1 text-green-600">
            ★
          </span>
        )}
      </span>
    );
  };

  /*
   * Render one sentence.
   *
   * Sentences remain inline inside their paragraph.
   * The explanation card is rendered outside the inline
   * sentence span so the HTML structure stays valid.
   */
  const renderSentence = (sentence, index) => {
    const words = sentence.trim().split(/\s+/);

    const processedWords = words.map(
      (word, wordIndex) =>
        renderWord(
          word,
          `${index}-${wordIndex}`
        )
    );

    const isSelected =
      selectedSentence === index;

    const explanation =
      sentenceExplanations &&
      sentenceExplanations[index];

    return (
      <React.Fragment key={index}>
        <span
          className={`text-gray-800 rounded transition-all duration-200 ${
            isSelected
              ? 'bg-yellow-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={(e) =>
            handleSentenceClick(index, e)
          }
        >
          {processedWords}
        </span>

        {isSelected && explanation && (
          <div className="my-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start justify-between gap-4">
              <h4 className="font-semibold text-blue-800">
                {sentenceExplanationLevel === 3
                  ? '🔍 Grammar Forensic'
                  : '🇧🇩 Bengali Translation'}
              </h4>

              <button
                type="button"
                onClick={handleCloseSentenceExplanation}
                className="text-gray-500 hover:text-red-600 text-xl font-bold leading-none"
                title="Close"
              >
                ×
              </button>
            </div>

            {sentenceExplanationLevel === 2 && (
              <div className="mt-2">
                <p className="text-blue-700">
                  {explanation.bengali}
                </p>
              </div>
            )}

            {sentenceExplanationLevel === 3 && (
              <div className="mt-2">
                <p className="text-green-700">
                  {explanation.grammar}
                </p>
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* Passage Reader */}
      <div className="bg-white rounded-xl shadow-lg p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {title}
          </h2>

          <button
            onClick={() =>
              setShowVocabulary(!showVocabulary)
            }
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            📚 My Vocabulary (
            {Object.values(savedWords).filter(Boolean).length}
            )
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-blue-800 text-sm">
            <strong>How to use:</strong>{' '}
            Click once on a word to see its meaning •
            Click twice on a sentence for Bengali translation •
            Click three times for grammar forensic •
            Save important words to your vocabulary
          </p>
        </div>

        {/* Vocabulary */}
        {showVocabulary && (
          <div className="mb-6">
            <VocabularyPanel
              savedWords={savedWords}
              wordData={wordData}
              onRemoveWord={handleRemoveWord}
            />
          </div>
        )}

        {/* Passage */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📖 Passage
          </h3>

          <div
            ref={passageRef}
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed select-none bg-gray-50 p-6 rounded-lg"
            onClick={handlePassageClick}
          >
            {paragraphData.map(
              (paragraphItem, paragraphIndex) => (
                <p
                  key={paragraphIndex}
                  className="mb-6 last:mb-0"
                >
                  {paragraphItem.sentences.map(
                    (sentence, sentenceIndex) => {

                      /*
                       * Create a global sentence index
                       * so sentenceExplanations[index]
                       * continues to work exactly as before.
                       */
                      const globalIndex =
                        paragraphData
                          .slice(0, paragraphIndex)
                          .reduce(
                            (total, item) =>
                              total + item.sentences.length,
                            0
                          ) + sentenceIndex;

                      return renderSentence(
                        sentence.trim(),
                        globalIndex
                      );
                    }
                  )}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Word Popup */}
      {selectedWord &&
        wordData &&
        wordData[selectedWord] && (
          <WordPopup
            word={selectedWord}
            wordData={wordData[selectedWord]}
            position={wordPosition}
            onClose={() =>
              setSelectedWord(null)
            }
            onSaveWord={handleSaveWord}
            isSaved={savedWords[selectedWord]}
          />
        )}

      {/* MCQ Section */}
      {mcqs && mcqs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🧠</span>
              {mcqTitle}
            </h3>
          </div>

          <QuestionEngine
            questions={mcqs}
          />

        </div>
      )}

      <QuestionAnswerSection questions={questions} title={questionTitle} />

    </div>
  );
};

export default PassageReader;