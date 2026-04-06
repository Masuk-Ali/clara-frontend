import React, { useState, useEffect } from 'react';
import { ContentService } from '../services/contentService';
import RuleSection from '../features/grammar/RuleSection';
import PracticeEngine from '../features/grammar/PracticeEngine';
import QuizEngine from '../features/grammar/QuizEngine';
import PassageReader from '../features/reading/PassageReader';
import QuestionEngine from '../components/ui/QuestionEngine';

/**
 * Universal Topic Viewer Component
 * Renders any topic from the unified data structure
 * Fully data-driven - works with any topic type
 */
export default function TopicViewer({ topicId, onComplete }) {
  const [topic, setTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch topic data on mount
    const loadTopic = () => {
      try {
        setLoading(true);
        const topicData = ContentService.getTopic(topicId);

        if (!topicData) {
          setError(`Topic "${topicId}" not found`);
          return;
        }

        if (!ContentService.isValidTopic(topicData)) {
          setError('Invalid topic data structure');
          return;
        }

        setTopic(topicData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      loadTopic();
    }
  }, [topicId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
        <p className="text-red-800 font-semibold">Error Loading Topic</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-600">
        No topic selected
      </div>
    );
  }

  const renderContent = () => {
    switch (topic.type) {
      case 'grammar':
        return renderGrammarTopic();
      case 'reading':
        return renderReadingTopic();
      default:
        return <p className="text-gray-600">Unknown topic type: {topic.type}</p>;
    }
  };

  const renderGrammarTopic = () => {
    const tabs = [
      { id: 'rules', label: 'Rules', available: topic.rules?.length > 0 },
      { id: 'practice', label: 'Practice', available: topic.practice?.length > 0 },
      { id: 'quiz', label: 'Quiz', available: topic.quiz?.length > 0 }
    ];

    return (
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={!tab.available}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : tab.available
                      ? 'border-transparent text-gray-600 hover:text-gray-900'
                      : 'border-transparent text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4">
          {activeTab === 'rules' && topic.rules?.length > 0 && (
            <RuleSection
              rules={topic.rules}
              examples={topic.examples || []}
            />
          )}

          {activeTab === 'practice' && topic.practice?.length > 0 && (
            <PracticeEngine
              practiceQuestions={topic.practice}
            />
          )}

          {activeTab === 'quiz' && topic.quiz?.length > 0 && (
            <QuizEngine
              quizQuestions={topic.quiz}
            />
          )}
        </div>
      </div>
    );
  };

  const renderReadingTopic = () => {
    return (
      <PassageReader
        title={topic.title}
        passage={topic.passage}
        wordData={topic.wordData}
        sentenceExplanations={topic.sentenceExplanations}
        questions={topic.questions}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                {topic.type.toUpperCase()}
              </span>
              {topic.difficulty && (
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
                    topic.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : topic.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {topic.difficulty}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
            <p className="text-gray-600 mt-2">{topic.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {renderContent()}
      </div>
    </div>
  );
}
