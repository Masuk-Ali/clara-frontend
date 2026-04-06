import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import { educationData } from "../../data/classesData";

export default function Dashboard() {
  const navigate = useNavigate();

  // Sample user data
  const selectedClass = "10";
  const selectedCourse = "eng1";
  const userProgress = 65;

  const selectedClassData = educationData.flatMap(level => level.classes).find((c) => c.id === selectedClass);
  const selectedCourseData = selectedClassData?.courses.find(
    (c) => c.id === selectedCourse
  );

  const continueLearningTopics = [
    { name: "Seen Passage 1", progress: 80 },
    { name: "Drama Analysis", progress: 65 },
    { name: "Novel Reading", progress: 45 },
  ];

  const newFeatures = [
    {
      title: "AI Tutor",
      description: "Get personalized help from AI",
      icon: "⚡",
    },
    {
      title: "Adaptive Learning",
      description: "Content that adapts to your pace",
      icon: "📈",
    },
    {
      title: "Gamification",
      description: "Earn badges and compete",
      icon: "⭐",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Section - Selected Class & Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selected Class & Course */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
          <p className="text-blue-100 text-sm mb-2">Currently Learning</p>
          <h2 className="text-3xl font-bold mb-2">{selectedClassData?.name}</h2>
          <p className="text-blue-100 text-lg mb-6">{selectedCourseData?.name}</p>

          <button
            onClick={() =>
              navigate(`/topics/${selectedClass}/${selectedCourse}`)
            }
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2"
          >
            Continue Learning →
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Overall Progress</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  {selectedCourseData?.name}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {userProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${userProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">12</p>
                <p className="text-xs text-gray-600">Topics Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">5</p>
                <p className="text-xs text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Continue Learning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {continueLearningTopics.map((topic, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition cursor-pointer"
              onClick={() =>
                navigate(`/content/${selectedClass}/${selectedCourse}/${idx}`)
              }
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{topic.name}</h4>
                <span className="text-2xl">📖</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-blue-600">{topic.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${topic.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Features / Courses Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Explore New Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newFeatures.map((feature) => (
            <DashboardCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              variant="primary"
              onClick={() => {
                if (feature.title === "AI Tutor") navigate("/chat");
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Quick Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="All Classes"
            description="Browse all classes from 6 to 12"
            icon="📚"
            onClick={() => navigate("/classes")}
            variant="default"
          />
          <DashboardCard
            title="My Progress"
            description="View detailed progress analytics"
            icon="📈"
            variant="success"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-3xl font-bold text-blue-600">8</p>
          <p className="text-sm text-gray-600 mt-2">Total Courses</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-3xl font-bold text-green-600">42</p>
          <p className="text-sm text-gray-600 mt-2">Total Topics</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-3xl font-bold text-purple-600">5hr 30m</p>
          <p className="text-sm text-gray-600 mt-2">Learning Time</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-3xl font-bold text-amber-600">156</p>
          <p className="text-sm text-gray-600 mt-2">Total Points</p>
        </div>
      </div>
    </div>
  );
}