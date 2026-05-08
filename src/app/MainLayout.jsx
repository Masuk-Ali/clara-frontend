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
    <div className="relative h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
        <TopBar
          pageTitle={pageTitle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="relative flex flex-1 min-h-0 overflow-hidden">
          <aside
            className={`fixed inset-y-0 left-0 z-[1000] w-64 flex flex-col bg-white shadow-lg transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex-1 min-h-0 overflow-y-auto">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </aside>

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6 pb-24">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>

        <BottomBar />
      </div>
    </div>
  );
}
