console.log("App rendering");
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Classes from "./pages/Classes";
import Courses from "./pages/Courses";
import Topics from "./pages/Topics";
import Content from "./pages/Content";
import GrammarPage from "./pages/GrammarPage";
import Settings from "./pages/Settings";
import MainLayout from "./layout/MainLayout";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;

  if (!user) {
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
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/courses/:classId" element={<Courses />} />
          <Route path="/topics/:classId/:courseId" element={<Topics />} />
          <Route path="/grammar/:classId/:courseId/:topicId" element={<GrammarPage />} />
          <Route path="/content/:classId/:courseId/:topicId" element={<Content />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/quiz" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">Quiz Coming Soon</div>} />
          <Route path="/practice" element={<div className="text-center text-2xl font-bold text-gray-600 mt-20">Practice Coming Soon</div>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}