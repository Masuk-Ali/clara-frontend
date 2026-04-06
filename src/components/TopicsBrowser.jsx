import React, { useState, useEffect } from 'react';
import { ContentService } from '../services/contentService';
import { useSearch } from '../hooks';
import { getDifficultyColor, getTypeIcon } from '../utils/styleHelpers';
import { Button, Input, Badge, EmptyState } from './ui';

/**
 * Topics Browser Component
 * Demonstrates data-driven architecture in action
 * Lists all available topics and allows navigation/selection
 */
export default function TopicsBrowser({ onSelectTopic, onNavigate }) {
  const [topics, setTopics] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Load all topics on mount
  useEffect(() => {
    try {
      const allTopics = ContentService.getTopicsByType();
      setTopics(allTopics);
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  }, []);

  // Use custom search hook
  const { query: searchQuery, setQuery: setSearchQuery, results: searchResults, clearQuery } = useSearch(topics);

  // Filter topics by type
  const filteredTopics = searchResults.filter((topic) => {
    return filter === 'all' || topic.type === filter;
  });

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    if (onSelectTopic) {
      onSelectTopic(topic);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Learning Topics
          </h1>
          <p className="text-gray-600">
            Explore grammar rules, practice exercises, and reading materials
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Box */}
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics by name or keyword..."
          />

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {['all', 'grammar', 'reading'].map((type) => (
              <Button
                key={type}
                onClick={() => setFilter(type)}
                variant={filter === type ? 'primary' : 'secondary'}
                size="md"
              >
                {type === 'all' ? `All Topics (${topics.length})` :
                 type === 'grammar' ? `📝 Grammar (${topics.filter(t => t.type === 'grammar').length})` :
                 `📖 Reading (${topics.filter(t => t.type === 'reading').length})`}
              </Button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedTopic?.id === topic.id
                    ? 'bg-blue-50 border-blue-500 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                {/* Topic Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {getTypeIcon(topic.type)}
                      </span>
                      <Badge variant="primary" size="sm">
                        {topic.type.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {topic.title}
                    </h3>
                  </div>
                </div>

                {/* Topic Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {topic.description}
                </p>

                {/* Topic Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.difficulty && (
                    <Badge className={getDifficultyColor(topic.difficulty)} size="sm">
                      {topic.difficulty}
                    </Badge>
                  )}
                  {topic.category && (
                    <Badge variant="default" size="sm">
                      {topic.category}
                    </Badge>
                  )}
                </div>

                {/* Content Stats */}
                <div className="border-t pt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {topic.rules && (
                    <div className="flex items-center gap-1">
                      <span>📋</span>
                      <span>{topic.rules.length} rules</span>
                    </div>
                  )}
                  {topic.practice && (
                    <div className="flex items-center gap-1">
                      <span>✏️</span>
                      <span>{topic.practice.length} exercises</span>
                    </div>
                  )}
                  {topic.quiz && (
                    <div className="flex items-center gap-1">
                      <span>🎯</span>
                      <span>{topic.quiz.length} questions</span>
                    </div>
                  )}
                  {topic.questions && (
                    <div className="flex items-center gap-1">
                      <span>❓</span>
                      <span>{topic.questions.length} q&a</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {selectedTopic?.id === topic.id && (
                  <Button
                    onClick={() => onNavigate && onNavigate(topic)}
                    fullWidth
                    className="mt-4"
                  >
                    Learn Now
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji={searchQuery ? "❌" : "📚"}
            title={searchQuery ? "No topics found" : "No topics available"}
            message={searchQuery ? "Try a different search term" : "Topics will appear here"}
            action={searchQuery ? clearQuery : null}
            actionLabel="Clear Search"
          />
        )}
      </div>

      {/* Statistics Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {topics.length}
              </div>
              <p className="text-gray-600">Total Topics</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {topics.filter(t => t.type === 'grammar').length}
              </div>
              <p className="text-gray-600">Grammar Topics</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {topics.filter(t => t.type === 'reading').length}
              </div>
              <p className="text-gray-600">Reading Materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Usage Examples:
 * 
 * 1. Simple list view:
 *    <TopicsBrowser />
 * 
 * 2. With selection callback:
 *    <TopicsBrowser onSelectTopic={(topic) => console.log(topic)} />
 * 
 * 3. With navigation (inside Router):
 *    <TopicsBrowser 
 *      onNavigate={(topic) => navigate(`/learn/${topic.id}`)} 
 *    />
 * 
 * 4. Embedded in dashboard:
 *    <TopicsBrowser 
 *      onSelectTopic={handleSelectionForUI}
 *      onNavigate={handleNavigationToLearning}
 *    />
 */
