import { useState } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../navigation/TopBar";
import Sidebar from "../navigation/Sidebar";
import BottomBar from "../navigation/BottomBar";

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-generate page title if not provided
  const getPageTitle = (pathname) => {
    if (title) return title;

    // Main navigation
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/classes') return 'Classes';
    if (pathname === '/library') return 'Library';

    // Library
    if (pathname === '/library/textbooks') return 'Textbooks';
    if (pathname === '/library/test-papers') return 'Test Papers';
    if (pathname === '/library/reference') return 'Reference Books';
    if (pathname === '/library/study-materials') return 'Study Materials';

    // My Account
    if (pathname === '/my-courses') return 'My Courses';
    if (pathname === '/my-payments') return 'My Payments';
    if (pathname === '/progress') return 'Progress';
    if (pathname === '/achievements') return 'Achievements';

    // Useful Links
    if (pathname === '/chat') return 'AI Chat';
    if (pathname === '/profile') return 'Profile';
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/dictionary') return 'Dictionary';

    return 'Clara';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <TopBar
          pageTitle={pageTitle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-20 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomBar />
      </div>
    </div>
  );
}