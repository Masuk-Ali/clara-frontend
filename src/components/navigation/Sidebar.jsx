import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const mainMenuItems = [
    { icon: "🏠", label: "Dashboard", path: "/" },
    { icon: "🎓", label: "Classes", path: "/classes" },
    { icon: "📚", label: "Library", path: "/library" },
  ];

  const libraryItems = [
    { icon: "📖", label: "Textbooks", path: "/library/textbooks" },
    { icon: "📝", label: "Test Papers", path: "/library/test-papers" },
    { icon: "📚", label: "Reference Books", path: "/library/reference" },
    { icon: "📰", label: "Study Materials", path: "/library/study-materials" },
  ];

  const accountItems = [
    { icon: "📚", label: "My Courses", path: "/my-courses" },
    { icon: "💳", label: "My Payments", path: "/my-payments" },
    { icon: "📊", label: "Progress", path: "/progress" },
    { icon: "🏆", label: "Achievements", path: "/achievements" },
  ];

  const usefulLinks = [
    { icon: "💬", label: "AI Chat", path: "/chat" },
    { icon: "📖", label: "Dictionary", path: "/dictionary" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
    { icon: "👤", label: "Profile", path: "/profile" },
  ];

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path ||
      (item.path !== '/' && location.pathname.startsWith(item.path));

    return (
      <Link
        key={item.label}
        to={item.path}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        } hover:translate-x-1`}
      >
        <span className="text-xl">{item.icon}</span>
        <span className="font-medium">{item.label}</span>
        {isActive && (
          <div className="w-2 h-2 bg-white rounded-full ml-auto"></div>
        )}
      </Link>
    );
  };

  const renderMenuSection = (title, items, showTitle = true) => (
    <div className="space-y-1">
      {showTitle && (
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {items.map(renderMenuItem)}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Clara</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Learning Platform</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6">
        {/* Main Navigation */}
        {renderMenuSection("", mainMenuItems, false)}

        {/* My Account */}
        {renderMenuSection("My Account", accountItems)}

        {/* Useful Links */}
        {renderMenuSection("Useful Links", usefulLinks)}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}