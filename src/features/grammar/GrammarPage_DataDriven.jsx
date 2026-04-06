import { useEffect } from "react";
import { ContentService } from "../../services/contentService";
import { useDataLoader, useTabs } from "../../hooks";
import { getDifficultyColor } from "../../utils/styleHelpers";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  TabNavigation,
  Badge
} from "../../components/ui";
import RuleSection from "./RuleSection";
import PracticeEngine from "./PracticeEngine";
import QuizEngine from "./QuizEngine";

/**
 * GrammarPage - Refactored for Data-Driven Architecture
 * 
 * Usage 1 (Original - props):
 *   <GrammarPage topic={topic} />
 * 
 * Usage 2 (Data-driven):
 *   <GrammarPage topicId="tense" />
 * 
 * The component automatically fetches topic data if topicId is provided
 */
export default function GrammarPage({ topic: propTopic, topicId }) {
  // Use data loader hook for fetching topic
  const { data: topic, loading, error, retry } = useDataLoader(
    () => {
      if (propTopic) return Promise.resolve(propTopic);
      if (topicId) {
        const t = ContentService.getTopic(topicId);
        if (!t) throw new Error(`Topic "${topicId}" not found`);
        return Promise.resolve(t);
      }
      return Promise.resolve(null);
    },
    [topicId, propTopic]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message={`Loading ${topicId}...`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorMessage
          title="Error"
          message={error}
          onRetry={retry}
        />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <EmptyState emoji="📘" title="No Topic Selected" message="Please select a topic to get started." />
      </div>
    );
  }

  // Determine available tabs based on topic data
  const tabs = [
    { id: "rules", label: "Rules", available: topic.rules && topic.rules.length > 0 },
    { id: "practice", label: "Practice", available: topic.practice && topic.practice.length > 0 },
    { id: "quiz", label: "Quiz", available: topic.quiz && topic.quiz.length > 0 }
  ];

  // Use tabs hook for state management
  const { activeTab, setActiveTab } = useTabs(tabs, "rules");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {topic.difficulty && (
                  <Badge variant={
                    topic.difficulty === 'beginner' ? 'success' :
                    topic.difficulty === 'intermediate' ? 'warning' :
                    'danger'
                  } size="sm">
                    {topic.difficulty}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {topic.title}
              </h1>
              {topic.description && (
                <p className="text-gray-600 mt-2">{topic.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "rules" && topic.rules && (
          <RuleSection
            rules={topic.rules}
            examples={topic.examples || []}
          />
        )}
        
        {activeTab === "practice" && topic.practice && (
          <PracticeEngine
            practiceQuestions={topic.practice}
          />
        )}
        
        {activeTab === "quiz" && topic.quiz && (
          <QuizEngine
            quizQuestions={topic.quiz}
          />
        )}
      </div>
    </div>
  );
}
