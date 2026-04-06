import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useVocabularyCount, useCompletedTopicsCount } from '../../store';

// Mock data for demonstration
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  joinDate: 'January 2024',
  avatar: '👤'
};

const mockProgressData = {
  totalCourses: 5,
  completedCourses: 2,
  totalTopics: 150,
  completedTopics: 45,
  vocabularyWords: 127,
  studyStreak: 12
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const user = useUser();
  const vocabularyCount = useVocabularyCount();

  // Use real data if available, otherwise fall back to mock data
  const displayUser = user || mockUserData;
  const progress = mockProgressData;

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    // TODO: Implement edit functionality
  };

  const completedTopics = useCompletedTopicsCount('all'); // This might need adjustment based on actual implementation

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">👤 Profile</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your account and view your learning progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {displayUser.avatar && !displayUser.avatar.includes('lh3.googleusercontent.com') ? displayUser.avatar : '👤'}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{displayUser.name}</h2>
                <p className="text-gray-600">{displayUser.email}</p>
                <p className="text-sm text-gray-500 mt-2">Member since {displayUser.joinDate}</p>
              </div>

              <button
                onClick={handleEditProfile}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Learning Progress</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Courses Progress */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Courses</h4>
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span className="font-medium">{progress.completedCourses}/{progress.totalCourses}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.completedCourses / progress.totalCourses) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {Math.round((progress.completedCourses / progress.totalCourses) * 100)}% complete
                    </p>
                  </div>
                </div>

                {/* Topics Progress */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Topics</h4>
                    <span className="text-2xl">📖</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span className="font-medium">{completedTopics || progress.completedTopics}/{progress.totalTopics}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((completedTopics || progress.completedTopics) / progress.totalTopics) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {Math.round(((completedTopics || progress.completedTopics) / progress.totalTopics) * 100)}% complete
                    </p>
                  </div>
                </div>

                {/* Vocabulary Progress */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Vocabulary</h4>
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Words Saved</span>
                      <span className="font-medium">{vocabularyCount || progress.vocabularyWords}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Keep building your vocabulary!
                    </div>
                  </div>
                </div>

                {/* Study Streak */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Study Streak</h4>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-orange-600">
                      {progress.studyStreak}
                    </div>
                    <div className="text-sm text-gray-600">
                      days in a row
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">🏆 Achievements</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    📚 First Course Completed
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    🔥 7-Day Streak
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    📝 Vocabulary Builder
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}