import { useParams, useNavigate } from "react-router-dom";
import { educationData } from "../data/classesData";
import PassageReader from "../components/PassageReader";

export default function Content() {
  const { classId, courseId, topicId } = useParams();
  const navigate = useNavigate();

  // Find the class, course, and topic
  const classData = educationData
    .flatMap((level) => level.classes)
    .find((c) => c.id === classId);

  const courseData = classData?.courses.find((c) => c.id === courseId);
  const topic = courseData?.topics[parseInt(topicId)];

  // For syllabus-based navigation, create a topic object with syllabus info
  let syllabusTopic = null;
  if (!topic && courseData) {
    syllabusTopic = { 
      name: `Syllabus Topic ${topicId}`, 
      id: topicId,
      marks: 'TBD' // Could be loaded from syllabus data
    };
  }

  const displayTopic = topic || syllabusTopic;

  if (!classData || !courseData || !displayTopic) {
    return (
      <div className="text-center text-red-600">
        Content not found
      </div>
    );
  }

  const isReading = courseData.type === "reading";
  const topicName = displayTopic.name;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition text-2xl"
        >
          ⬅️
        </button>
        <div>
          <p className="text-sm text-gray-600">
            {classData.name} • {courseData.name}
          </p>
          <h1 className="text-3xl font-bold text-gray-800">{topicName}</h1>
        </div>
      </div>

      {/* Content Area */}
      {isReading && typeof topic === "object" ? (
        <PassageReader
          passage={topic.passage}
          bengaliTranslation={topic.bengaliTranslation}
          wordData={topic.wordData}
          sentenceExplanations={topic.sentenceExplanations}
          questions={topic.questions}
        />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📖</span>
                <h2 className="text-xl font-bold text-gray-800">Content</h2>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
                <p>
                  This section contains the learning material for <strong>{topicName}</strong>.
                </p>
                <p>
                  Detailed explanations, examples, and exercises related to this topic will be
                  displayed here.
                </p>
                {displayTopic.marks && displayTopic.marks !== 'TBD' && (
                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                    <p className="font-semibold text-green-900">Marks: {displayTopic.marks}</p>
                  </div>
                )}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <p className="font-semibold text-blue-900">Key Points:</p>
                  <ul className="list-disc list-inside text-blue-800 mt-2 space-y-1">
                    <li>Point 1 about the topic</li>
                    <li>Point 2 about the topic</li>
                    <li>Point 3 about the topic</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Examples Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Examples</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="font-semibold text-gray-800">Example 1</p>
                  <p className="text-gray-600 mt-2">Example content goes here...</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="font-semibold text-gray-800">Example 2</p>
                  <p className="text-gray-600 mt-2">Example content goes here...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Lesson Progress</span>
                    <span className="text-sm font-bold text-blue-600">65%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-xs text-gray-600">Estimated Time</p>
                  <p className="font-bold text-gray-800">15 minutes</p>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                Mark as Complete
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium">
                Download Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
