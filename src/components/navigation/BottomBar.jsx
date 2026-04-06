import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("explore");

  const tabs = useMemo(() => [
    { id: "chat", label: "AI Chat", icon: "💬", path: "/chat" },
    { id: "explore", label: "Explore", icon: "🧭", path: "/" },
    { id: "quiz", label: "Quiz", icon: "✅", path: "/quiz" },
    { id: "practice", label: "Practice", icon: "📖", path: "/practice" },
  ], []);

  useEffect(() => {
    // Set active tab based on current path
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setActiveTab(currentTab.id);
    }
  }, [location.pathname, tabs]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-20 px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 scale-105"
                  : "text-gray-600 hover:bg-gray-50 hover:scale-105"
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && <div className="w-6 h-1 bg-blue-600 rounded-full mt-1 animate-pulse"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
