import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ pageTitle, onMenuToggle }) {
  const [showSearchFocus, setShowSearchFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
      {/* Left side - Menu and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 text-xl"
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h1 className="text-2xl font-bold text-gray-800 truncate">{pageTitle}</h1>
      </div>

      {/* Middle - Search Bar */}
      <form onSubmit={handleSearch} className={`flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 transition-all duration-200 ${
        showSearchFocus ? 'ring-2 ring-blue-500 bg-white shadow-md' : ''
      }`}>
        <span className="text-gray-600">🔍</span>
        <input
          type="text"
          placeholder="Search topics, lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSearchFocus(true)}
          onBlur={() => setShowSearchFocus(false)}
          className="bg-transparent outline-none text-gray-700 placeholder-gray-500 w-48"
        />
      </form>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => navigate('/dictionary')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 text-lg"
          title="Dictionary"
        >
          📖
        </button>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 text-lg"
          title="Profile"
        >
          👤
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <button
              onClick={() => {
                navigate('/profile');
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => {
                navigate('/settings');
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              Settings
            </button>
            <hr className="my-1" />
            <button
              onClick={() => {
                // TODO: Implement logout
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
