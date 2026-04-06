import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { educationData } from "../data/classesData";
import PracticeComponent from "../components/PracticeComponent";
import QuizComponent from "../components/QuizComponent";

const grammarTopicData = {
  Tense: {
    heading: "Understanding Tenses",
    description:
      "Tenses help express when actions happen. In SSC and HSC grammar, mastering tense patterns makes your writing clearer and faster.",
    rules: [
      "Use the present simple for facts and habitual actions.",
      "Use the past simple for completed actions in the past.",
      "Use the future simple to describe actions that will happen.",
    ],
    examples: [
      { sentence: "She walks to school every day.", note: "Present simple for habits." },
      { sentence: "They finished the exercise yesterday.", note: "Past simple for completed past actions." },
      { sentence: "He will study for the exam tomorrow.", note: "Future simple for a future plan." },
    ],
    practice: [
      {
        type: "fill",
        prompt: "Complete the blank: She ___ (go) to college every year.",
        answer: "goes",
      },
      {
        type: "correction",
        prompt: "Correct the sentence: He go to school yesterday.",
        answer: "He went to school yesterday.",
      },
    ],
    quiz: [
      {
        question: "Which sentence is in the past simple tense?",
        options: [
          "She writes a letter.",
          "He wrote a letter.",
          "They will write a letter.",
          "She is writing a letter.",
        ],
        correct: 1,
      },
      {
        question: "Choose the correct future simple form:",
        options: ["I will go", "I go", "I went", "I am going"],
        correct: 0,
      },
    ],
  },
  Voice: {
    heading: "Active and Passive Voice",
    description:
      "Voice changes the focus of the sentence from the doer to the receiver. SSC and HSC exams frequently test the transformation between active and passive sentences.",
    rules: [
      "In passive voice, the object becomes the subject.",
      "Use the verb 'to be' + past participle in passive sentences.",
      "Keep the original verb tense when changing voice.",
    ],
    examples: [
      { sentence: "The teacher explains the lesson.", note: "Active voice." },
      { sentence: "The lesson is explained by the teacher.", note: "Passive voice." },
    ],
    practice: [
      {
        type: "fill",
        prompt: "Fill in the blank: The book ___ (write) by the author.",
        answer: "was written",
      },
      {
        type: "correction",
        prompt: "Correct the sentence: The homework is do by him.",
        answer: "The homework is done by him.",
      },
    ],
    quiz: [
      {
        question: "Which sentence is passive?",
        options: [
          "The chef cooked the meal.",
          "The meal was cooked by the chef.",
          "The chef is cooking the meal.",
          "The meal cooks slowly.",
        ],
        correct: 1,
      },
      {
        question: "How do you form passive voice?",
        options: [
          "Verb + -ing", "To be + past participle", "Subject + verb", "Auxiliary + base verb"],
        correct: 1,
      },
    ],
  },
  Narration: {
    heading: "Direct and Indirect Speech",
    description:
      "Narration changes quoted speech into reported speech. It is a key SSC/HSC grammar topic for both reading comprehension and writing tasks.",
    rules: [
      "Change pronouns as needed when reporting speech.",
      "Shift the verb tense back when the reporting verb is past tense.",
      "Use reporting verbs such as said, told, and asked.",
    ],
    examples: [
      { sentence: "He said, 'I am tired.'", note: "Direct speech." },
      { sentence: "He said that he was tired.", note: "Indirect speech." },
    ],
    practice: [
      {
        type: "fill",
        prompt: "Complete the indirect form: She said, 'I will come.' → She said that she ___ come.",
        answer: "would",
      },
      {
        type: "correction",
        prompt: "Correct the sentence: She told me that she is going tomorrow.",
        answer: "She told me that she was going the next day.",
      },
    ],
    quiz: [
      {
        question: "Which sentence is indirect speech?",
        options: [
          "He said, 'I am ready.'", "He said that he was ready.", "He is saying that he is ready.", "He has said he is ready."],
        correct: 1,
      },
      {
        question: "In reported speech, 'will' often changes to:",
        options: ["would", "shall", "can", "may"],
        correct: 0,
      },
    ],
  },
  Transformation: {
    heading: "Sentence Transformation Rules",
    description:
      "Transformation exercises ask you to rewrite sentences while keeping the meaning. They are a reliable tool for SSC and HSC grammar practice.",
    rules: [
      "Maintain the original meaning when changing sentence structure.",
      "Use correct verbs, pronouns and connectors.",
      "Keep the required word count when specified.",
    ],
    examples: [
      { sentence: "He is too young to drive.", note: "Use 'so...that' for transformation." },
      { sentence: "He is very young; he cannot drive.", note: "Alternative expression." },
    ],
    practice: [
      {
        type: "fill",
        prompt: "Transform: He is too young to drive. → He is not old ___ drive.",
        answer: "enough to",
      },
      {
        type: "correction",
        prompt: "Correct the sentence: If I was rich, I would buy a car.",
        answer: "If I were rich, I would buy a car.",
      },
    ],
    quiz: [
      {
        question: "Which sentence is a correct transformation?",
        options: [
          "He is too young to drive.", "He is enough old to drive.", "He is not old enough to drive.", "He is old enough not to drive."],
        correct: 2,
      },
      {
        question: "The word 'too' in transformation usually means:",
        options: ["also", "so that", "more than", "not enough"],
        correct: 3,
      },
    ],
  },
  "Clause Analysis": {
    heading: "Clause Analysis",
    description:
      "Understanding clauses is essential for advanced grammar. HSC questions test your ability to identify and transform clause structures.",
    rules: [
      "A clause must contain a subject and a verb.",
      "Independent clauses can stand alone.",
      "Dependent clauses cannot stand alone and often begin with conjunctions.",
    ],
    examples: [
      { sentence: "Although she was tired, she finished her work.", note: "Dependent clause + independent clause." },
      { sentence: "She finished her work because she was tired.", note: "Cause and effect clause." },
    ],
    practice: [
      {
        type: "fill",
        prompt: "Identify the dependent clause: 'While he waited, the phone rang.' → Dependent clause: ___ .",
        answer: "While he waited",
      },
      {
        type: "correction",
        prompt: "Correct the sentence: She will come if she will finish her work.",
        answer: "She will come if she finishes her work.",
      },
    ],
    quiz: [
      {
        question: "Which clause is dependent?",
        options: ["She laughed.", "Because she was late.", "The bell rang.", "He went home."],
        correct: 1,
      },
      {
        question: "A clause must contain:",
        options: ["A subject and verb", "Only a subject", "Only a verb", "An adjective and adverb"],
        correct: 0,
      },
    ],
  },
};

export default function GrammarPage() {
  const { classId, courseId, topicId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Explanation");

  const selectedClass = educationData
    .flatMap((level) => level.classes)
    .find((cls) => cls.id === classId);

  const selectedCourse = selectedClass?.courses.find((course) => course.id === courseId);
  const topic = selectedCourse?.topics[parseInt(topicId, 10)];
  const topicData = grammarTopicData[topic] || grammarTopicData["Tense"];

  if (!selectedClass || !selectedCourse || selectedCourse.type !== "grammar" || !topic) {
    return (
      <div className="text-center text-red-600 mt-20">
        Grammar lesson not found. Please choose a valid grammar topic.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">{selectedClass.name} • {selectedCourse.name}</p>
          <h1 className="text-4xl font-bold text-gray-900">{topic}</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">A structured grammar lesson built for SSC and HSC students. Learn rules, complete practice exercises, and test yourself with a quiz.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
        >
          ← Back to topic list
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          "Explanation",
          "Practice",
          "Quiz",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg border border-gray-200">
        {activeTab === "Explanation" && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-blue-50 p-6 border border-blue-100">
              <h2 className="text-2xl font-semibold text-blue-900">{topicData.heading}</h2>
              <p className="mt-4 text-gray-700 leading-7">{topicData.description}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Core rules</h3>
                <ul className="space-y-3 text-gray-700">
                  {topicData.rules.map((rule, index) => (
                    <li key={index} className="rounded-2xl bg-gray-50 p-4">
                      <span className="font-semibold text-gray-800">Rule {index + 1}:</span> {rule}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Examples</h3>
                <div className="space-y-4">
                  {topicData.examples.map((example, index) => (
                    <div key={index} className="rounded-2xl bg-blue-50 p-4">
                      <p className="font-semibold text-gray-900">{example.sentence}</p>
                      <p className="text-sm text-gray-600 mt-2">{example.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Practice" && (
          <PracticeComponent exercises={topicData.practice} />
        )}

        {activeTab === "Quiz" && (
          <QuizComponent questions={topicData.quiz} />
        )}
      </div>
    </div>
  );
}
