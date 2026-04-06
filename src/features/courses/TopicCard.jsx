import { useNavigate } from "react-router-dom";

export default function TopicCard({ topic, classId, courseId, isGrammar }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const contentType = isGrammar ? 'grammar' : 'reading';
    navigate(`/content/${classId}/${courseId}/${topic.id}?type=${contentType}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <span className="text-blue-600 font-semibold text-sm">
              {topic.id}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
              {topic.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {isGrammar ? "Grammar Concept" : "Reading Passage"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {topic.marks} marks
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className={isGrammar ? "text-purple-600" : "text-blue-600"}>
            {isGrammar ? "📝" : "📖"}
          </span>
          <span>{isGrammar ? "Practice" : "Read & Answer"}</span>
        </div>
        <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}