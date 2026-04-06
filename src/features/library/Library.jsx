import { Link } from "react-router-dom";

export default function Library() {
  const libraryItems = [
    {
      icon: "📖",
      title: "Textbooks",
      description: "Access digital textbooks and study guides",
      path: "/library/textbooks",
      color: "bg-blue-500"
    },
    {
      icon: "📝",
      title: "Test Papers",
      description: "Practice with previous years' question papers",
      path: "/library/test-papers",
      color: "bg-green-500"
    },
    {
      icon: "📚",
      title: "Reference Books",
      description: "Comprehensive reference materials and guides",
      path: "/library/reference",
      color: "bg-purple-500"
    },
    {
      icon: "📰",
      title: "Study Materials",
      description: "Additional study resources and notes",
      path: "/library/study-materials",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📚 Library
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Access all your learning resources and study materials in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {libraryItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats or Additional Info */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Library Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">150+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Textbooks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">500+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Test Papers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">75+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">References</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">200+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Study Materials</div>
          </div>
        </div>
      </div>
    </div>
  );
}