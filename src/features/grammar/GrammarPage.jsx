import { useState } from "react";
import RuleSection from "./RuleSection";
import PracticeEngine from "./PracticeEngine";
import QuizEngine from "./QuizEngine";

export default function GrammarPage({ topic }) {
  const [activeTab, setActiveTab] = useState("rules");

  const tabs = [
    { id: "rules", label: "Rules" },
    { id: "practice", label: "Practice" },
    { id: "quiz", label: "Quiz" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {topic.title}
          </h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "rules" && (
          <RuleSection
            rules={topic.rules || []}
            examples={topic.examples || []}
          />
        )}

        {activeTab === "practice" && (
          <PracticeEngine
            practiceQuestions={topic.practice || []}
          />
        )}

        {activeTab === "quiz" && (
          <QuizEngine
            quizQuestions={topic.quiz || []}
          />
        )}
      </div>
    </div>
  );
}
