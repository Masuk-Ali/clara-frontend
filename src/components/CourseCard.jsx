import { useNavigate } from "react-router-dom";

export default function CourseCard({ course, classId }) {
  const navigate = useNavigate();
  const icon = course.type === "reading" ? "📖" : "🏆";

  return (
    <div
      onClick={() => navigate(`/topics/${classId}/${course.id}`)}
      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg cursor-pointer transition transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{course.type}</p>
            <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
          </div>
        </div>
        <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {course.topics?.length || 0} Topics
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
        Start learning {course.type === "reading" ? "passages" : "grammar topics"} for this class.
      </div>
    </div>
  );
}
