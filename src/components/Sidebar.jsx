import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { icon: "🏠", label: "Dashboard", path: "/" },
    { icon: "🎓", label: "Classes", path: "/classes" },
    { icon: "📚", label: "Courses", path: "/courses" },
    { icon: "👤", label: "Profile", path: "/profile" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-xl z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Clara</h2>
            <p className="text-xs text-gray-400 mt-1">Learning Platform</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition text-2xl"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-200 hover:bg-gray-700 hover:translate-x-1"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {isActive && <div className="w-2 h-2 bg-white rounded-full ml-auto"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6">
          <p className="text-xs text-gray-500">Version 1.0</p>
        </div>
      </div>
    </>
  );
}