import { useNavigate } from "react-router-dom";
import { educationData } from "../data/classesData";

export default function Classes() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Classes</h1>
        <p className="text-gray-600">Select your class to view available courses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educationData.flatMap((level) => level.classes).map((cls) => (
          <button
            key={cls.id}
            onClick={() => navigate(`/courses/${cls.id}`)}
            className="text-left bg-white rounded-3xl shadow-lg px-6 py-8 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-4xl">🎓</span>
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {cls.level === "secondary" ? "SSC" : cls.level === "higher" ? "HSC" : "Primary"}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{cls.name}</h2>
            <p className="text-sm text-gray-600 mt-3">{cls.courses.length} courses available</p>
          </button>
        ))}
      </div>
    </div>
  );
}