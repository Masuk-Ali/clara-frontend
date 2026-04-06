import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ContentService } from '../../services/contentService';
import ContentRenderer from '../../components/ui/ContentRenderer';

export default function TopicContent() {
  const { classId, courseId, topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
  }, [classId, courseId, topicId, location.search]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get content type from URL search params
      const urlParams = new URLSearchParams(location.search);
      const contentType = urlParams.get('type') || 'reading';

      const result = await ContentService.loadContent(classId, courseId, topicId, contentType);

      setContentData(result);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    if (!contentData) return null;

    const { content, metadata } = contentData;
    const { type, topicName, classData, courseData } = metadata;

    if (type === 'grammar') {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                📚 {content.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mt-2">
                {content.description}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              content.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              content.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {content.difficulty}
            </span>
            {metadata.hasPractice && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                🎯 Practice Available
              </span>
            )}
            {metadata.hasQuiz && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                🧠 Quiz Available
              </span>
            )}
          </div>
        </div>
      );
    }

    // Default header for other content types
    return (
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {type === 'reading' ? '📖' : '📄'} {topicName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {courseData.name} • {classData.name}
          </p>
          {metadata.wordCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Approximately {metadata.wordCount} words
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Content Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
}

