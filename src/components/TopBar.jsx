import { useState } from "react";
import { supabase } from "../supabase";

export default function TopBar({ pageTitle, onMenuToggle }) {
  const [showSearchFocus, setShowSearchFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
      {/* Left side - Menu and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 text-xl"
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
          className="bg-transparent outline-none w-48 text-sm text-gray-700 placeholder-gray-500"
          onFocus={() => setShowSearchFocus(true)}
          onBlur={() => setShowSearchFocus(false)}
        />
      </form>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 text-lg"
          title="Dictionary"
        >
          📚
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 text-lg"
          title="Settings"
        >
          ⚙️
        </button>
        <button
          onClick={logout}
          className="p-2 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 text-lg"
          title="Logout"
        >
          🚪
        </button>
      </div>
    </div>
  );
}
