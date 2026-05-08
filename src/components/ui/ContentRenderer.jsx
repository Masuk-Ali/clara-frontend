import { useState } from 'react';
import { getRearrangeContent, rearrangeBank } from '../../data/classesData';
import RuleSection from '../../features/grammar/RuleSection';
import PracticeEngine from '../../features/grammar/PracticeEngine';
import QuizEngine from '../../features/grammar/QuizEngine';
import RearrangeList from './RearrangeList';
import QuestionEngine from './QuestionEngine';

export default function ContentRenderer({ content, contentType, metadata }) {
  // Prioritize the specific type defined in the content object (e.g., 'rearrange')
  // Fall back to the generic contentType passed from the course level.
  const activeType = (content && typeof content === 'object' && content.type) || metadata?.type || contentType;

  switch (activeType) {
    case 'grammar':
      return <GrammarContentRenderer content={content} metadata={metadata} />;
    case 'reading':
      return <ReadingContentRenderer content={content} metadata={metadata} />;
    case 'practice':
      return <PracticeContentRenderer content={content} metadata={metadata} />;
    case 'quiz':
      return <QuizContentRenderer content={content} metadata={metadata} />;
    case 'rearrange':
      return <RearrangeContentRenderer content={content} metadata={metadata} />;
    default:
      return <UnsupportedContentRenderer contentType={contentType} />;
  }
}

function GrammarContentRenderer({ content, metadata }) {
  const [activeTab, setActiveTab] = useState('rules');

  const tabs = [
    { id: 'rules', label: '📋 Rules', component: RuleSection, props: { rules: content.rules, examples: [] } },
    { id: 'examples', label: '💡 Examples', component: ExampleSection, props: { examples: content.examples } },
    { id: 'practice', label: '🎯 Practice', component: PracticeEngine, props: { practiceQuestions: content.practice } },
    { id: 'quiz', label: '🧠 Quiz', component: QuizEngine, props: { quizQuestions: content.quiz } }
  ].filter(tab => {
    // Only show tabs that have content
    if (tab.id === 'practice' && !content.practice?.length) return false;
    if (tab.id === 'quiz' && !content.quiz?.length) return false;
    return true;
  });

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || RuleSection;
  const activeProps = tabs.find(tab => tab.id === activeTab)?.props || {};

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <ActiveComponent {...activeProps} />
      </div>
    </div>
  );
}

function ExampleSection({ examples }) {
  return (
    <div className="space-y-6">
      {examples.map((example, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {example.sentence}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                {example.note}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {example.explanation}
              </p>
              {example.tips && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">💡 Tips:</h4>
                  <ul className="space-y-1">
                    {example.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-green-700 dark:text-green-300 text-sm">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReadingContentRenderer({ content, metadata }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {content.title || content.name || "Reading Material"}
        </h2>
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {content.content || content.passage || (typeof content === 'string' ? content : "")}
        </div>
        {content.author && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Author:</strong> {content.author}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RearrangeContentRenderer({ content, metadata }) {
  const classId = metadata?.classData?.id;

  let tasks = [];

  if (content.items && Array.isArray(content.items)) {
    tasks = content.items;
  } else if (content.storyIds && Array.isArray(content.storyIds) && classId) {
    // Fallback: if storyIds is empty or has only one item, show all rearrange stories
    const storyIds = content.storyIds.length <= 1 
      ? rearrangeBank.map((story) => story.id)
      : content.storyIds;

    tasks = storyIds
      .map((storyId) => getRearrangeContent(storyId, classId))
      .filter(Boolean);
  }

  return <RearrangeList items={tasks} classId={classId} />;
}

function PracticeContentRenderer({ content, metadata }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
          🎯 Practice Exercises
        </h2>
        <p className="text-blue-700 dark:text-blue-300">
          Complete these exercises to reinforce your understanding.
        </p>
      </div>
      <PracticeEngine practiceQuestions={content} />
    </div>
  );
}

function QuizContentRenderer({ content, metadata }) {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-2">
          🧠 Knowledge Check
        </h2>
        <p className="text-purple-700 dark:text-purple-300">
          Test your understanding with this quiz.
        </p>
      </div>
      <QuizEngine quizQuestions={content} />
    </div>
  );
}

function UnsupportedContentRenderer({ contentType }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📄</div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Content Type Not Supported
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        This content type ({contentType}) is not yet implemented.
      </p>
    </div>
  );
}