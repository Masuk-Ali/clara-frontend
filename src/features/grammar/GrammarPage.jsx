import { useState } from "react";
import RuleSection from "./RuleSection";
import PracticeEngine from "./PracticeEngine";
import QuizEngine from "./QuizEngine";

export default function GrammarPage({ topicData }) {
  const [activeTab, setActiveTab] = useState('rules');
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const tabs = [
    { id: 'rules', label: '📚 Rules', component: RuleSection },
    { id: 'practice', label: '✏️ Practice', component: PracticeEngine },
    { id: 'quiz', label: '📝 Quiz', component: QuizEngine }
  ];

  const handlePracticeComplete = () => {
    setPracticeCompleted(true);
  };

  const handleQuizComplete = (results) => {
    setQuizCompleted(true);
    console.log('Quiz completed with results:', results);
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {topicData.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {topicData.description}
            </p>
            {topicData.difficulty && (
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${
                topicData.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                topicData.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {topicData.difficulty.charAt(0).toUpperCase() + topicData.difficulty.slice(1)} Level
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.id === 'practice' && practiceCompleted && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
                {tab.id === 'quiz' && quizCompleted && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'rules' && (
          <RuleSection
            rules={topicData.rules}
            examples={topicData.examples}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeEngine
            practiceQuestions={topicData.practice}
            onPracticeComplete={handlePracticeComplete}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizEngine
            quizQuestions={topicData.quiz}
            onQuizComplete={handleQuizComplete}
          />
        )}
      </div>
    </div>
  );
}
      },
      {
        type: "fill_blank",
        prompt: "Complete: They ___ (finish) their homework yesterday.",
        answer: "finished",
        explanation: "Past simple tense for completed actions. Add -ed to regular verbs for past form.",
        hint: "What do you do when something is completely done?"
      },
      {
        type: "fill_blank",
        words: ["will visit", "visited", "visits", "visiting"],
        prompt: "Complete: I ___ my friend tomorrow.",
        answer: "will visit",
        explanation: "Future simple tense uses 'will' + base verb for future plans and arrangements.",
        hint: "Which word shows future time?"
      }
    ],

    quiz: [
      {
        question: "Which sentence is in present continuous tense?",
        options: ["She reads books.", "She is reading a book.", "She read a book.", "She will read a book."],
        correct: 1,
        explanation: "Present continuous uses 'is/am/are + verb-ing' for ongoing actions happening now.",
        topic: "Present Continuous"
      },
      {
        question: "Choose the correct past simple form:",
        options: ["I goed home.", "I went home.", "I go home.", "I will go home."],
        correct: 1,
        explanation: "Past simple uses irregular verb forms. 'Go' becomes 'went' in past simple.",
        topic: "Past Simple"
      },
      {
        question: "Which sentence shows future continuous?",
        options: ["I will eat lunch.", "I am eating lunch.", "I ate lunch.", "I will be eating lunch."],
        correct: 3,
        explanation: "Future continuous uses 'will be + verb-ing' for ongoing future actions.",
        topic: "Future Continuous"
      }
    ]
  },

  Voice: {
    title: "Active and Passive Voice Transformation",
    description: "Voice changes focus from doer to receiver. Master this to write varied, sophisticated sentences.",

    rules: [
      "Active: Subject performs the action (The chef cooked the meal)",
      "Passive: Subject receives the action (The meal was cooked by the chef)",
      "Passive formula: Object + was/were + past participle + by + subject",
      "Keep original tense when changing voice",
      "Use passive when doer is unknown or less important"
    ],

    examples: [
      {
        sentence: "The teacher explains the lesson.",
        note: "Active Voice",
        explanation: "The subject 'teacher' is performing the action 'explains' on the object 'lesson'.",
        transformation: "Passive: The lesson is explained by the teacher.",
        tips: ["Subject does the action", "Focus on the doer", "More direct"]
      },
      {
        sentence: "The lesson is explained by the teacher.",
        note: "Passive Voice",
        explanation: "The subject 'lesson' is receiving the action. The doer comes after 'by'.",
        transformation: "Active: The teacher explains the lesson.",
        tips: ["Subject receives action", "Use 'by' for doer", "More formal"]
      }
    ],

    practice: [
      {
        type: "fill_blank",
        prompt: "Change to passive: The students ___ (write) the exam.",
        answer: "wrote",
        explanation: "Passive voice: The exam was written by the students. Keep the past tense.",
        hint: "What tense is the active sentence in?"
      },
      {
        type: "fill_blank",
        prompt: "Change to passive: Someone ___ (steal) my bicycle.",
        answer: "has stolen",
        explanation: "Passive voice: My bicycle has been stolen. Use present perfect tense.",
        hint: "The active sentence uses 'has stolen' - present perfect."
      }
    ],

    quiz: [
      {
        question: "Which is the passive form of 'They built this house in 1990'?",
        options: [
          "This house was built in 1990.",
          "This house is built in 1990.",
          "This house built in 1990.",
          "This house will be built in 1990."
        ],
        correct: 0,
        explanation: "Passive: Object becomes subject, add 'was/were + past participle', keep original tense.",
        topic: "Passive Formation"
      },
      {
        question: "When should you use passive voice?",
        options: [
          "When the doer is unknown",
          "When the action is more important than the doer",
          "In formal writing",
          "All of the above"
        ],
        correct: 3,
        explanation: "Passive voice is used when doer is unknown, action is more important, or in formal contexts.",
        topic: "Passive Usage"
      }
    ]
  }
};

const GrammarPage = () => {
  const { classId, courseId, topicId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("rules");
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  // Find the topic data
  const classData = educationData.flatMap(level => level.classes).find(c => c.id === classId);
  const courseData = classData?.courses.find(c => c.id === courseId);
  const topic = courseData?.topics[parseInt(topicId)];

  // Get grammar topic data (fallback to Tense if not found)
  const grammarData = grammarTopics[topic?.name] || grammarTopics.Tense;

  const tabs = [
    { id: "rules", label: "📚 Rules", icon: "📖" },
    { id: "practice", label: "🎯 Practice", icon: "✏️" },
    { id: "quiz", label: "🧠 Quiz", icon: "✅" }
  ];

  const handlePracticeComplete = () => {
    setPracticeCompleted(true);
    setActiveTab("quiz");
  };

  const handleQuizComplete = (results) => {
    // Could save results to localStorage or send to backend
    navigate(-1); // Go back to topics page
  };

  if (!classData || !courseData || !topic) {
    return (
      <div className="text-center text-red-600 py-8">
        Topic not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{grammarData.title}</h1>
              <p className="text-gray-600">{grammarData.description}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "rules" && (
          <RuleSection
            rules={grammarData.rules}
            examples={grammarData.examples}
            title={grammarData.title}
          />
        )}

        {activeTab === "practice" && (
          <PracticeEngine
            practiceQuestions={grammarData.practice}
            onPracticeComplete={handlePracticeComplete}
          />
        )}

        {activeTab === "quiz" && (
          <QuizEngine
            quizQuestions={grammarData.quiz}
            onQuizComplete={handleQuizComplete}
          />
        )}
      </div>
    </div>
  );
};

export default GrammarPage;
