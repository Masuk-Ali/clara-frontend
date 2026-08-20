import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useClearUser, useGuestMode, useSetGuestMode } from "../../store";

export default function TopBar({ pageTitle, onMenuToggle }) {
  const [showSearchFocus, setShowSearchFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const clearUser = useClearUser();
  const guestMode = useGuestMode();
  const setGuestMode = useSetGuestMode();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = async () => {
    try {
      if (guestMode) {
        setGuestMode(false);
        navigate("/");
        return;
      }

      await supabase.auth.signOut();
      clearUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }

    setShowProfileMenu(false);
  };

  return (
    <div className="relative flex items-center justify-between px-3 py-3 md:px-6 md:py-4 bg-white shadow-md border-b border-gray-200">

      {/* Left side - Menu and Title */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 text-xl shrink-0"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <h1 className="text-lg md:text-2xl font-bold text-gray-800 truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Desktop Search */}
      <form
        onSubmit={handleSearch}
        className={`hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 transition-all duration-200 ${
          showSearchFocus ? "ring-2 ring-blue-500 bg-white shadow-md" : ""
        }`}
      >
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
      <div className="flex items-center gap-1 md:gap-3 relative">

        {/* Mobile Search Button */}
        <button
          onClick={() => setShowSearchFocus(!showSearchFocus)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 text-lg"
          aria-label="Search"
        >
          🔍
        </button>

        {/* Dictionary */}
        <button
          onClick={() => navigate("/dictionary")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 text-lg"
          title="Dictionary"
          aria-label="Dictionary"
        >
          📖
        </button>

        {/* Profile */}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 text-lg"
          title="Profile"
          aria-label="Profile"
        >
          👤
        </button>

        {/* Mobile Search Panel */}
        {showSearchFocus && (
          <form
            onSubmit={handleSearch}
            className="md:hidden absolute right-0 top-full mt-2 w-[calc(100vw-24px)] max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50"
          >
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <span className="text-gray-600">🔍</span>

              <input
                autoFocus
                type="text"
                placeholder="Search topics, lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
              />
            </div>
          </form>
        )}

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <button
              onClick={() => {
                navigate("/profile");
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              Profile
            </button>

            <button
              onClick={() => {
                navigate("/settings");
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              Settings
            </button>

            <hr className="my-1" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
            >
              {guestMode ? "Exit Guest Mode" : "Logout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}