import { useParams, useNavigate } from "react-router-dom";
import { educationData } from "../../data/classesData";

export default function Topics() {
  const { classId, courseId } = useParams();
  const navigate = useNavigate();

  const selectedClass = educationData
    .flatMap((level) => level.classes)
    .find((cls) => cls.id === classId);

  const selectedCourse = selectedClass?.courses.find((course) => course.id === courseId);

  if (!selectedClass || !selectedCourse) {
    return <div className="text-center text-red-600 mt-20">Course not found</div>;
  }

  const topics = selectedCourse.topics || [];
  const isGrammar = selectedCourse.type === "grammar";
  const sectionLabel = isGrammar ? "Grammar Topics" : "Reading Passages";
  const cardLabel = isGrammar ? "Grammar" : "Reading";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">{selectedClass.name} • {selectedCourse.name}</p>
          <h1 className="text-3xl font-bold text-gray-900">{sectionLabel}</h1>
        </div>
        <button
          onClick={() => navigate(`/courses/${classId}`)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-700 hover:bg-gray-200 transition"
        >
          ⬅️ Back to Courses
        </button>
      </div>

      <div className="bg-blue-50 rounded-3xl p-6 shadow-sm border border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">{cardLabel}</p>
            <h2 className="text-2xl font-bold text-blue-900 mt-2">{selectedCourse.name}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center md:text-right">
            <div>
              <p className="text-3xl font-bold text-blue-900">{topics.length}</p>
              <p className="text-sm text-blue-700">Total Topics</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">{isGrammar ? "Concepts" : "Passages"}</p>
              <p className="text-sm text-blue-700">Learning Style</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic, index) => (
          <button
            key={topic}
            onClick={() => navigate(isGrammar ? `/grammar/${classId}/${courseId}/${index}` : `/content/${classId}/${courseId}/${index}`)}
            className="group rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                {isGrammar ? "📝" : "📚"}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                {isGrammar ? "Grammar" : "Reading"}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{topic}</h3>
            <p className="mt-3 text-sm text-gray-600">Continue your {sectionLabel.toLowerCase()} for {selectedClass.name}.</p>
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <span>{index + 1} of {topics.length}</span>
              <span className="font-semibold text-blue-600 group-hover:text-blue-800">Start</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}