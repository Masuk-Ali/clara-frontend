import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onClose, collapsed = false, onToggleCollapse }) {
  const location = useLocation();
  const [questionBankOpen, setQuestionBankOpen] = useState(false);

  const exploreItems = [
    { icon: "🏠", label: "Dashboard", path: "/" },
    { icon: "🎓", label: "Classes", path: "/classes" },
    { icon: "📘", label: "Courses", path: "/courses" },
    { icon: "🤖", label: "AI Tutor", path: "/chat" },
    { icon: "📚", label: "Library", path: "/library" },
  ];

  const learningItems = [
    { icon: "📚", label: "My Courses", path: "/my-courses" },
    { icon: "⚔️", label: "Practice Arena", path: "/practice" },
    { icon: "📝", label: "My Notes", path: "/notes" },
    { icon: "📅", label: "Study Planner", path: "/study-planner" },
  ];

  const questionBankItems = [
    { icon: "❓", label: "MCQ Bank", path: "/question-bank/mcq" },
    { icon: "📝", label: "CQ Bank", path: "/question-bank/cq" },
  ];

  const systemItems = [
    { icon: "💳", label: "My Payments", path: "/my-payments" },
    { icon: "💬", label: "AI Chat", path: "/chat" },
    { icon: "📖", label: "Dictionary", path: "/dictionary" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
    { icon: "👤", label: "Profile", path: "/profile" },
  ];

  const isQuestionBankActive = questionBankItems.some((item) =>
    location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))
  );

const renderMenuItem = (item) => {
  const isActive =
    location.pathname === item.path ||
    (item.path !== "/" && location.pathname.startsWith(item.path));

  return (
    <Link
      key={item.label}
      to={item.path}
      onClick={onClose}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-white/20 text-gray-900"
          : "text-gray-700 hover:bg-white/10"
      }`}
      title={collapsed ? item.label : ""}
    >
      {/* Active Indicator */}
      {isActive && (
        <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></span>
      )}

      <span className="text-lg">{item.icon}</span>

      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
};
 const renderSection = (title, children) => (
  <div className="space-y-2">
    {!collapsed && (
      <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

  return (
    <div className="h-full flex flex-col px-2 py-4 overflow-y-auto">
      <div className="flex items-center justify-between px-4 mb-6">
  {!collapsed && (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Clara</h2>
      <p className="text-xs text-gray-500">Learning Platform</p>
    </div>
  )}

  <div className="flex items-center gap-2">
    {onToggleCollapse && (
      <button
        onClick={onToggleCollapse}
        className="p-2 rounded hover:bg-gray-100"
      >
        {collapsed ? "➡️" : "⬅️"}
      </button>
    )}

    {onClose && (
      <button
        onClick={onClose}
        className="p-2 rounded hover:bg-gray-100"
      >
        ✕
      </button>
    )}
  </div>
</div>

      <nav className="flex-1 space-y-6">
        {renderSection("Explore", exploreItems.map(renderMenuItem))}

        {renderSection("My Learning", [
          ...learningItems.map(renderMenuItem),
          <button
            key="question-bank-toggle"
            type="button"
            onClick={() => setQuestionBankOpen((open) => !open)}
            className={`relative flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              isQuestionBankActive ? "bg-white/20 text-gray-900" : "text-gray-700 hover:bg-white/10"
            } ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Question Bank" : ""}
          >
            {isQuestionBankActive && (
              <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></span>
            )}
            <span className="flex items-center gap-3">
              <span className="text-lg">📦</span>
              {!collapsed && <span>Question Bank</span>}
            </span>
            {!collapsed && <span>{questionBankOpen ? "▾" : "▸"}</span>}
          </button>,
          questionBankOpen && !collapsed && (
            <div key="question-bank-list" className="space-y-1 pl-8">
              {questionBankItems.map(renderMenuItem)}
            </div>
          ),
        ])}

        {renderSection("System", systemItems.map(renderMenuItem))}
      </nav>
    </div>
  );
}
