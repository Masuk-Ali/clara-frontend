import { useState } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../components/navigation/TopBar";
import Sidebar from "../components/navigation/Sidebar";
import BottomBar from "../components/navigation/BottomBar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathname === '/') return 'Dashboard';
    if (pathname === '/chat') return 'AI Chat';
    if (pathname === '/classes') return 'Classes';
    if (pathname === '/profile') return 'Profile';
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/quiz') return 'Quiz';
    if (pathname === '/practice') return 'Practice';

    // For dynamic routes
    if (pathSegments[0] === 'courses' && pathSegments.length >= 2) return 'Courses';
    if (pathSegments[0] === 'topics' && pathSegments.length >= 3) return 'Topics';
    if (pathSegments[0] === 'content' && pathSegments.length >= 4) return 'Content';
    if (pathSegments[0] === 'grammar' && pathSegments.length >= 4) return 'Grammar';

    return 'Clara';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar
        pageTitle={pageTitle}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pb-24 relative">
        {/* Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomBar />
    </div>
  );
}