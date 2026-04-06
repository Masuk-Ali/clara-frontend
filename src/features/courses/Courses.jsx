import { useParams, useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import { educationData } from "../../data/classesData";

export default function Courses() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const selectedClass = educationData
    .flatMap((level) => level.classes)
    .find((cls) => cls.id === classId);

  if (!selectedClass) {
    return <div className="text-center text-red-600 mt-20">Class not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/classes")}
          className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition text-xl"
        >
          ⬅️
        </button>
        <div>
          <p className="text-sm text-gray-500">Class {selectedClass.name}</p>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedClass.courses.map((course) => (
          <CourseCard key={course.id} course={course} classId={classId} />
        ))}
      </div>
    </div>
  );
}