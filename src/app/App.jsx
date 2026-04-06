import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useSetUser, useIsAuthenticated, useUser } from "../store";

import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";

import Dashboard from "../features/dashboard/Dashboard";
import Chat from "../features/ai/Chat";
import Profile from "../features/auth/Profile";
import Classes from "../features/courses/Classes";
import Courses from "../features/courses/Courses";
import Topics from "../features/courses/Topics";
import SubjectPage from "../features/courses/SubjectPage";
import TopicContent from "../features/courses/TopicContent";
import Settings from "../features/settings/Settings";
import Dictionary from "../features/dictionary/Dictionary";
import Library from "../features/library/Library";
import Layout from "../components/ui/Layout";

console.log("App rendering");

export default function App() {
  const [loading, setLoading] = useState(true);
  const setUser = useSetUser();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email,
          name: data.session.user.user_metadata?.name || data.session.user.email,
          avatar: data.session.user.user_metadata?.avatar_url
        });
      }
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url
        });
      } else {
        setUser(null);
      }
    });
  }, []); // Removed setUser from dependencies since Zustand actions are stable

  if (loading) return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/courses/:classId" element={<Courses />} />
          <Route path="/topics/:classId/:courseId" element={<SubjectPage />} />
          <Route path="/content/:classId/:courseId/:topicId" element={<TopicContent />} />
          <Route path="/grammar/:classId/:courseId/:topicId" element={<TopicContent />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/library" element={<Library />} />

          {/* Library Routes */}
          <Route path="/library/textbooks" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">📖 Textbooks Coming Soon</div>} />
          <Route path="/library/test-papers" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">📝 Test Papers Coming Soon</div>} />
          <Route path="/library/reference" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">📚 Reference Books Coming Soon</div>} />
          <Route path="/library/study-materials" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">📰 Study Materials Coming Soon</div>} />

          {/* My Account Routes */}
          <Route path="/my-courses" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">📚 My Courses Coming Soon</div>} />
          <Route path="/my-payments" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">💳 My Payments Coming Soon</div>} />
          <Route path="/progress" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">📊 Progress Coming Soon</div>} />
          <Route path="/achievements" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">🏆 Achievements Coming Soon</div>} />

          <Route path="/quiz" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">Quiz Coming Soon</div>} />
          <Route path="/practice" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">Practice Coming Soon</div>} />
          <Route path="*" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">Page Not Found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}