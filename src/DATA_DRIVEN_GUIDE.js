/**
 * DATA-DRIVEN ARCHITECTURE GUIDE
 * 
 * This document explains how to use the refactored data-driven system
 * for a fully decoupled content and presentation layer architecture.
 */

// ============================================================================
// 1. USING THE CONTENT SERVICE
// ============================================================================

import { ContentService } from '../services/contentService';

// Get a single topic by ID
const topic = ContentService.getTopic('tense');
// Returns: { id, type, title, description, rules, examples, practice, quiz, ... }

// Get all topics of a specific type
const grammarTopics = ContentService.getTopicsByType('grammar');
// Returns: Array of all grammar topics

const readingTopics = ContentService.getTopicsByType('reading');
// Returns: Array of all reading topics

// Get all topic IDs
const allIds = ContentService.getTopicIds();
const grammarIds = ContentService.getTopicIds('grammar');

// Search topics
const results = ContentService.search('tense');
// Returns: Topics matching 'tense' in title, description, or ID

// Validate topic structure
const isValid = ContentService.isValidTopic(topic);
// Returns: boolean


// ============================================================================
// 2. COMPONENT USAGE EXAMPLES
// ============================================================================

// EXAMPLE 1: Using TopicViewer (Most Common)
// This component handles everything automatically

import TopicViewer from '../components/TopicViewer';

function Page() {
  return (
    <TopicViewer 
      topicId="tense"
      onComplete={() => console.log('Topic completed')}
    />
  );
}
// That's it! TopicViewer fetches the topic, renders it, and manages all state


// ============================================================================
// 3. CUSTOM COMPONENT - GRAMMAR TOPIC
// ============================================================================

import React, { useState, useEffect } from 'react';
import RuleSection from '../features/grammar/RuleSection';
import PracticeEngine from '../features/grammar/PracticeEngine';
import QuizEngine from '../features/grammar/QuizEngine';

function CustomGrammarPage({ topicId }) {
  const [topic, setTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('rules');

  useEffect(() => {
    // Fetch topic data using service
    const topic = ContentService.getTopic(topicId);
    setTopic(topic);
  }, [topicId]);

  if (!topic) return <div>Loading...</div>;

  return (
    <div>
      <h1>{topic.title}</h1>
      
      {/* Tab navigation */}
      <button onClick={() => setActiveTab('rules')}>Rules</button>
      <button onClick={() => setActiveTab('practice')}>Practice</button>
      <button onClick={() => setActiveTab('quiz')}>Quiz</button>

      {/* Tab content */}
      {activeTab === 'rules' && (
        <RuleSection 
          rules={topic.rules} 
          examples={topic.examples || []} 
        />
      )}
      
      {activeTab === 'practice' && (
        <PracticeEngine 
          practiceQuestions={topic.practice} 
        />
      )}
      
      {activeTab === 'quiz' && (
        <QuizEngine 
          quizQuestions={topic.quiz} 
        />
      )}
    </div>
  );
}


// ============================================================================
// 4. CUSTOM COMPONENT - READING TOPIC
// ============================================================================

function CustomReadingPage({ topicId }) {
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const topic = ContentService.getTopic(topicId);
    setTopic(topic);
  }, [topicId]);

  if (!topic) return <div>Loading...</div>;

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.description}</p>
      
      <PassageReader
        title={topic.title}
        passage={topic.passage}
        wordData={topic.wordData}
        sentenceExplanations={topic.sentenceExplanations}
        questions={topic.questions}
      />
    </div>
  );
}


// ============================================================================
// 5. LISTING ALL TOPICS
// ============================================================================

function TopicsListing() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    // Get all topics from the database
    const allTopics = ContentService.getTopicsByType(); // Gets all
    setTopics(allTopics);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {topics.map((topic) => (
        <div 
          key={topic.id}
          className="p-4 border rounded cursor-pointer hover:shadow-lg"
          onClick={() => navigate(`/topic/${topic.id}`)}
        >
          <h3 className="font-bold">{topic.title}</h3>
          <p className="text-sm text-gray-600">{topic.description}</p>
          <div className="mt-2 flex gap-2">
            <span className="px-2 py-1 text-xs bg-blue-100 rounded">
              {topic.type}
            </span>
            <span className="px-2 py-1 text-xs bg-gray-100 rounded">
              {topic.difficulty}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}


// ============================================================================
// 6. TOPIC STRUCTURE REFERENCE
// ============================================================================

/*
GRAMMAR TOPIC STRUCTURE:
{
  id: 'tense',
  type: 'grammar',
  title: 'English Tenses',
  description: 'Master all English tenses...',
  difficulty: 'intermediate',
  category: 'grammar',
  rules: [
    { id: 1, title: 'Present Simple', explanation: '...' },
    ...
  ],
  examples: [
    { rule: 'present_simple', original: 'I eat', explanation: '...' },
    ...
  ],
  practice: [
    { type: 'fill_blank', question: 'I ___ (eat) every day', answer: 'eat' },
    ...
  ],
  quiz: [
    { type: 'mcq', question: '...', options: ['A', 'B', 'C', 'D'], correct: 0 },
    ...
  ]
}

READING TOPIC STRUCTURE:
{
  id: 'the-doting-mother',
  type: 'reading',
  title: 'The Doting Mother',
  description: 'A short story by...',
  difficulty: 'beginner',
  category: 'reading',
  passage: 'Long paragraph of text...',
  wordData: {
    'word': {
      'definition': 'meaning',
      'pronunciation': 'pron',
      'partOfSpeech': 'noun',
      'examples': ['...'],
      'synonyms': ['...']
    }
  },
  sentenceExplanations: {
    0: 'Explanation of first sentence...',
    ...
  },
  questions: [
    { type: 'mcq', question: '...?' },
    { type: 'fill_blank', question: 'The story is about ___' },
    ...
  ]
}
*/


// ============================================================================
// 7. MIGRATING FROM OLD HARDCODED CONTENT
// ============================================================================

// OLD WAY (Hardcoded):
import grammarContent from '../data/grammarContent';

function OldComponent() {
  const topic = grammarContent['tense']; // Direct import
  return <RuleSection rules={topic.rules} />;
}

// NEW WAY (Data-driven):
function NewComponent() {
  const topic = ContentService.getTopic('tense'); // Service layer
  return <RuleSection rules={topic.rules} />;
}

// Benefits:
// - Service layer can be swapped with API calls
// - All data goes through one validation point
// - Easy to add caching, filtering, searching
// - Backend integration requires only service layer change


// ============================================================================
// 8. ADDING NEW TOPICS
// ============================================================================

// 1. Add topic to topicsDatabase.js:
export const contentDatabase = {
  'new-topic-id': {
    id: 'new-topic-id',
    type: 'grammar', // or 'reading'
    title: 'Topic Title',
    description: 'Topic description...',
    difficulty: 'intermediate',
    category: 'grammar',
    // ... topic-specific fields
  },
  // ... other topics
};

// 2. Use immediately - no code changes needed:
const topic = ContentService.getTopic('new-topic-id');
// Works instantly!


// ============================================================================
// 9. BACKEND INTEGRATION
// ============================================================================

// When ready to use a backend API, update ContentService:

static async getTopic(topicId) {
  // Option 1: Use API
  const response = await fetch(`/api/topics/${topicId}`);
  const topic = await response.json();
  return topic;

  // Option 2: Use local database (current)
  // const topic = contentDatabase[topicId];
  // return topic;
}

// All components automatically work with the API - no changes needed!
// This is why the service layer pattern is powerful.


// ============================================================================
// 10. VALIDATION AND ERROR HANDLING
// ============================================================================

function SafeComponent({ topicId }) {
  const [topic, setTopic] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const topicData = ContentService.getTopic(topicId);
      
      if (!topicData) {
        setError('Topic not found');
        return;
      }

      if (!ContentService.isValidTopic(topicData)) {
        setError('Invalid topic data');
        return;
      }

      setTopic(topicData);
    } catch (err) {
      setError(err.message);
    }
  }, [topicId]);

  if (error) return <div className="error">{error}</div>;
  if (!topic) return <div>Loading...</div>;

  return <YourComponent topic={topic} />;
}
