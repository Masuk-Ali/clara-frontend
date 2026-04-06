import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabulary, useAddWord, useRemoveWord } from '../../store';

// Comprehensive word database with English and Bengali meanings
const wordDatabase = {
  // Common academic words
  'history': {
    english: 'History',
    bengali: 'ইতিহাস',
    pronunciation: '/ˈhɪstəri/',
    partOfSpeech: 'noun',
    meaning: 'The study of past events, particularly in human affairs.',
    bengaliMeaning: 'অতীত ঘটনার অধ্যয়ন, বিশেষ করে মানব বিষয়ে।',
    examples: [
      'The history of Bangladesh is rich and diverse.',
      'She is studying world history at university.',
      'Ancient history fascinates many scholars.'
    ],
    synonyms: ['past', 'chronicle', 'record'],
    difficulty: 'intermediate'
  },
  'diverse': {
    english: 'Diverse',
    bengali: 'বৈচিত্র্যপূর্ণ',
    pronunciation: '/daɪˈvɜːrs/',
    partOfSpeech: 'adjective',
    meaning: 'Showing a great deal of variety; very different.',
    bengaliMeaning: 'অনেক বৈচিত্র্য দেখানো; খুব আলাদা।',
    examples: [
      'Bangladesh has a diverse culture and heritage.',
      'The team consists of diverse members from different backgrounds.',
      'Our school promotes diverse learning experiences.'
    ],
    synonyms: ['varied', 'various', 'different'],
    difficulty: 'intermediate'
  },
  'vibrant': {
    english: 'Vibrant',
    bengali: 'জীবন্ত',
    pronunciation: '/ˈvaɪbrənt/',
    partOfSpeech: 'adjective',
    meaning: 'Full of energy and life; bright and striking.',
    bengaliMeaning: 'শক্তি ও জীবনপূর্ণ; উজ্জ্বল এবং আকর্ষণীয়।',
    examples: [
      'Dhaka is a vibrant and bustling city.',
      'The festival was vibrant with colors and music.',
      'She has a vibrant personality that lights up any room.'
    ],
    synonyms: ['lively', 'energetic', 'vivid'],
    difficulty: 'intermediate'
  },
  'influence': {
    english: 'Influence',
    bengali: 'প্রভাব',
    pronunciation: '/ˈɪnfluəns/',
    partOfSpeech: 'noun/verb',
    meaning: 'The capacity to have an effect on the character, development, or behavior of someone or something.',
    bengaliMeaning: 'কারও চরিত্র, বিকাশ বা আচরণে প্রভাব ফেলার ক্ষমতা।',
    examples: [
      'The teacher has a strong influence on her students.',
      'Western culture has influenced Bangladeshi traditions.',
      'Parents influence their children\'s behavior.'
    ],
    synonyms: ['impact', 'effect', 'sway'],
    difficulty: 'intermediate'
  },
  'liberation': {
    english: 'Liberation',
    bengali: 'মুক্তি',
    pronunciation: '/ˌlɪbəˈreɪʃən/',
    partOfSpeech: 'noun',
    meaning: 'The act of setting someone free from imprisonment, slavery, or oppression.',
    bengaliMeaning: 'কাউকে কারাগার, দাসত্ব বা অত্যাচার থেকে মুক্ত করার কাজ।',
    examples: [
      'The liberation war of 1971 brought independence to Bangladesh.',
      'Women fought for liberation from social restrictions.',
      'The liberation of the country was a historic event.'
    ],
    synonyms: ['freedom', 'emancipation', 'release'],
    difficulty: 'advanced'
  },
  'war': {
    english: 'War',
    bengali: 'যুদ্ধ',
    pronunciation: '/wɔːr/',
    partOfSpeech: 'noun',
    meaning: 'A state of armed conflict between different nations or states.',
    bengaliMeaning: 'বিভিন্ন জাতি বা রাষ্ট্রের মধ্যে সশস্ত্র সংঘাতের অবস্থা।',
    examples: [
      'The liberation war lasted nine months.',
      'Many lives were lost in the war.',
      'World War II ended in 1945.'
    ],
    synonyms: ['conflict', 'battle', 'combat'],
    difficulty: 'intermediate'
  },
  'independence': {
    english: 'Independence',
    bengali: 'স্বাধীনতা',
    pronunciation: '/ˌɪndɪˈpendəns/',
    partOfSpeech: 'noun',
    meaning: 'The state of being free from outside control or support.',
    bengaliMeaning: 'বাইরের নিয়ন্ত্রণ বা সমর্থন থেকে মুক্ত হওয়ার অবস্থা।',
    examples: [
      'Bangladesh gained independence in 1971.',
      'Personal independence is important for growth.',
      'The country celebrates Independence Day every year.'
    ],
    synonyms: ['freedom', 'autonomy', 'sovereignty'],
    difficulty: 'intermediate'
  },
  'gained': {
    english: 'Gained',
    bengali: 'অর্জন করেছে',
    pronunciation: '/ɡeɪnd/',
    partOfSpeech: 'verb',
    meaning: 'Obtained or secured something wanted or desirable.',
    bengaliMeaning: 'কাঙ্ক্ষিত বা কাম্য কিছু অর্জন বা নিশ্চিত করেছে।',
    examples: [
      'The country gained independence through struggle.',
      'She gained valuable experience from the job.',
      'He gained weight after the holidays.'
    ],
    synonyms: ['obtained', 'acquired', 'earned'],
    difficulty: 'intermediate'
  },
  'nation': {
    english: 'Nation',
    bengali: 'জাতি',
    pronunciation: '/ˈneɪʃən/',
    partOfSpeech: 'noun',
    meaning: 'A large body of people united by common descent, history, culture, or language.',
    bengaliMeaning: 'সাধারণ বংশ, ইতিহাস, সংস্কৃতি বা ভাষা দ্বারা ঐক্যবদ্ধ একটি বড় জনগোষ্ঠী।',
    examples: [
      'Bangladesh is a proud and resilient nation.',
      'The nation came together during the crisis.',
      'Every nation has its own unique culture.'
    ],
    synonyms: ['country', 'state', 'people'],
    difficulty: 'intermediate'
  },
  'culture': {
    english: 'Culture',
    bengali: 'সংস্কৃতি',
    pronunciation: '/ˈkʌltʃər/',
    partOfSpeech: 'noun',
    meaning: 'The arts and other manifestations of human intellectual achievement regarded collectively.',
    bengaliMeaning: 'মানব বুদ্ধিবৃত্তিক অর্জনের শিল্প এবং অন্যান্য প্রকাশ, যা একসাথে বিবেচনা করা হয়।',
    examples: [
      'Bangladeshi culture is rich and diverse.',
      'The culture of a nation shapes its people.',
      'Art and music are important parts of culture.'
    ],
    synonyms: ['heritage', 'tradition', 'civilization'],
    difficulty: 'intermediate'
  },
  'growing': {
    english: 'Growing',
    bengali: 'বর্ধনশীল',
    pronunciation: '/ˈɡroʊɪŋ/',
    partOfSpeech: 'adjective',
    meaning: 'Increasing in size, number, or importance.',
    bengaliMeaning: 'আকার, সংখ্যা বা গুরুত্বে বৃদ্ধি পাচ্ছে।',
    examples: [
      'The city has a growing population.',
      'Technology is a growing field of study.',
      'She has growing confidence in her abilities.'
    ],
    synonyms: ['increasing', 'expanding', 'developing'],
    difficulty: 'intermediate'
  },
  'vibrant': {
    english: 'Vibrant',
    bengali: 'জীবন্ত',
    pronunciation: '/ˈvaɪbrənt/',
    partOfSpeech: 'adjective',
    meaning: 'Full of energy and life; bright and striking.',
    bengaliMeaning: 'শক্তি ও জীবনপূর্ণ; উজ্জ্বল এবং আকর্ষণীয়।',
    examples: [
      'Dhaka is a vibrant and bustling city.',
      'The festival was vibrant with colors and music.',
      'She has a vibrant personality that lights up any room.'
    ],
    synonyms: ['lively', 'energetic', 'vivid'],
    difficulty: 'intermediate'
  }
};

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  // Use Zustand store for vocabulary management
  const vocabulary = useVocabulary();
  const addWord = useAddWord();
  const removeWord = useRemoveWord();

  // Check if a word is saved
  const isWordSaved = (wordKey) => {
    return vocabulary.some(word => word.word.toLowerCase() === wordKey.toLowerCase());
  };

  // Handle saving/removing words
  const handleToggleSaveWord = (wordData) => {
    if (isWordSaved(wordData.english)) {
      // Remove word
      const wordToRemove = vocabulary.find(word =>
        word.word.toLowerCase() === wordData.english.toLowerCase()
      );
      if (wordToRemove) {
        removeWord(wordToRemove.id);
      }
    } else {
      // Add word
      addWord({
        word: wordData.english,
        definition: wordData.meaning,
        pronunciation: wordData.pronunciation,
        difficulty: wordData.difficulty || 'intermediate'
      });
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(true);

    if (!term.trim()) {
      setSearchResults([]);
      setSelectedWord(null);
      setIsSearching(false);
      return;
    }

    // Simple search - can be enhanced with fuzzy search
    const results = Object.keys(wordDatabase).filter(word =>
      word.toLowerCase().includes(term.toLowerCase()) ||
      wordDatabase[word].english.toLowerCase().includes(term.toLowerCase()) ||
      wordDatabase[word].bengali.includes(term)
    );

    setSearchResults(results);
    setIsSearching(false);

    // Auto-select first result if there's an exact match
    const exactMatch = results.find(word => word.toLowerCase() === term.toLowerCase());
    if (exactMatch) {
      setSelectedWord(exactMatch);
    }
  };

  const handleWordSelect = (word) => {
    setSelectedWord(word);
    setSearchTerm(word);
  };

  const toggleSaveWord = (wordData) => {
    handleToggleSaveWord(wordData);
  };

  const playPronunciation = (word) => {
    // For now, we'll use the Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const savedWordsList = vocabulary.map(word => word.word);
  const savedWordsCount = vocabulary.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📖 Dictionary</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Search for words, learn meanings, and build your vocabulary
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for a word..."
                className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedWord(null);
                    setSearchResults([]);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="mt-4">
                {isSearching ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Search Results:</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.map((word) => (
                        <button
                          key={word}
                          onClick={() => handleWordSelect(word)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedWord === word
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                          }`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No words found for "{searchTerm}"</p>
                    <p className="text-sm mt-1">Try searching for common academic words</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Word Details */}
        {selectedWord && wordDatabase[selectedWord] && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {wordDatabase[selectedWord].english}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    wordDatabase[selectedWord].difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    wordDatabase[selectedWord].difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {wordDatabase[selectedWord].difficulty}
                  </span>
                </div>
                <p className="text-xl text-blue-600 font-medium mb-2">
                  {wordDatabase[selectedWord].bengali}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 italic">
                    {wordDatabase[selectedWord].pronunciation}
                  </span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {wordDatabase[selectedWord].partOfSpeech}
                  </span>
                  <button
                    onClick={() => playPronunciation(selectedWord)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Listen to pronunciation"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={() => toggleSaveWord(selectedWord)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  savedWords[selectedWord]
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className={`h-5 w-5 ${savedWords[selectedWord] ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {savedWords[selectedWord] ? 'Saved' : 'Save Word'}
              </button>
            </div>

            {/* Meaning */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Meaning</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-800 text-lg leading-relaxed mb-2">
                  {wordDatabase[selectedWord].meaning}
                </p>
                <p className="text-blue-700 font-medium">
                  {wordDatabase[selectedWord].bengaliMeaning}
                </p>
              </div>
            </div>

            {/* Examples */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Example Sentences</h3>
              <div className="space-y-3">
                {wordDatabase[selectedWord].examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-400">
                    <p className="text-gray-800 italic">"{example}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Synonyms */}
            {wordDatabase[selectedWord].synonyms && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🔄 Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {wordDatabase[selectedWord].synonyms.map((synonym, index) => (
                    <button
                      key={index}
                      onClick={() => handleWordSelect(synonym)}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
                    >
                      {synonym}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Words Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">⭐ Saved Words</h2>
              <p className="text-gray-600 mt-1">
                {savedWordsCount} {savedWordsCount === 1 ? 'word' : 'words'} in your vocabulary
              </p>
            </div>
            {savedWordsCount > 0 && (
              <button
                onClick={() => {
                  const confirmed = window.confirm('Are you sure you want to clear all saved words?');
                  if (confirmed) {
                    setSavedWords({});
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {savedWordsCount === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Words Yet</h3>
              <p className="text-gray-500 mb-6">
                Search for words above and click "Save Word" to build your vocabulary collection.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h4>
                <ul className="text-sm text-blue-700 text-left space-y-1">
                  <li>• Save words you find difficult</li>
                  <li>• Review saved words regularly</li>
                  <li>• Practice using words in sentences</li>
                  <li>• Group words by themes or difficulty</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedWordsList.map((word) => (
                <div
                  key={word}
                  onClick={() => handleWordSelect(word)}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {wordDatabase[word]?.english || word}
                    </h3>
                    <svg className="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-blue-600 font-medium mb-2">
                    {wordDatabase[word]?.bengali || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {wordDatabase[word]?.meaning || 'Definition not available'}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500 italic">
                      {wordDatabase[word]?.pronunciation || '/ˈwɜːrd/'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      wordDatabase[word]?.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      wordDatabase[word]?.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {wordDatabase[word]?.difficulty || 'unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
