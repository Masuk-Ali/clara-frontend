import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onClose }) {
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

  const renderMenuItem = (item) => {
    const isActive =
      location.pathname === item.path ||
      (item.path !== "/" && location.pathname.startsWith(item.path));

    return (
      <Link
        key={item.label}
        to={item.path}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
          isActive ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span>{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  };

  const renderSection = (title, children) => (
    <div className="space-y-2">
      <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto min-h-0 px-2 py-4">
      <div className="flex items-center justify-between px-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clara</h2>
          <p className="text-xs text-gray-500">Learning Platform</p>
        </div>
        <button
  onClick={onClose}
  className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
  </svg>
</button>
      </div>

      <nav className="space-y-6">
        {renderSection("Explore", exploreItems.map(renderMenuItem))}

        {renderSection("My Learning", [
          ...learningItems.map(renderMenuItem),
          <button
            key="question-bank-toggle"
            type="button"
            onClick={() => setQuestionBankOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100"
          >
            <span className="flex items-center gap-3">
              <span>📦</span>
              <span>Question Bank</span>
            </span>
            <span>{questionBankOpen ? "▾" : "▸"}</span>
          </button>,
          questionBankOpen && (
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
