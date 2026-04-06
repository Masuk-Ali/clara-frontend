import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TopicCard from "./TopicCard";

export default function SubjectPage() {
  const { classId, courseId } = useParams();
  const navigate = useNavigate();
  const [syllabusData, setSyllabusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSyllabus = async () => {
      try {
        // Map classId and courseId to syllabus file path
        const syllabusPath = getSyllabusPath(classId, courseId);
        if (!syllabusPath) {
          setLoading(false);
          return;
        }

        const response = await fetch(syllabusPath);
        const data = await response.json();
        setSyllabusData(data);
      } catch (error) {
        console.error("Error loading syllabus:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSyllabus();
  }, [classId, courseId]);

  const getSyllabusPath = (classId, courseId) => {
    // Map class and course IDs to syllabus file paths
    const mappings = {
      // JSC
      "6": { "eng1": "/data/Syllabus/JSC/English1st&2nd.json" },
      "7": { "eng1": "/data/Syllabus/JSC/English1st&2nd.json" },
      "8": { "eng1": "/data/Syllabus/JSC/English1st&2nd.json" },
      // SSC
      "9": { "eng1": "/data/Syllabus/SSC/English1st.json", "eng2": "/data/Syllabus/SSC/English2nd.json" },
      "10": { "eng1": "/data/Syllabus/SSC/English1st.json", "eng2": "/data/Syllabus/SSC/English2nd.json" },
      // HSC
      "11": { "eng1": "/data/Syllabus/HSC/English1st.json", "eng2": "/data/Syllabus/HSC/English2nd.json" },
      "12": { "eng1": "/data/Syllabus/HSC/English1st.json", "eng2": "/data/Syllabus/HSC/English2nd.json" }
    };

    return mappings[classId]?.[courseId];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading syllabus...</p>
        </div>
      </div>
    );
  }

  if (!syllabusData) {
    return (
      <div className="text-center text-red-600 mt-20">
        Syllabus not found for this subject
      </div>
    );
  }

  const isGrammar = courseId.includes('eng2'); // English 2nd Paper is grammar

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Class {classId} • {syllabusData.subject}
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            {isGrammar ? "Grammar Syllabus" : "Reading & Writing Syllabus"}
          </h1>
        </div>
        <button
          onClick={() => navigate(`/courses/${classId}`)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-700 hover:bg-gray-200 transition"
        >
          ⬅️ Back to Courses
        </button>
      </div>

      {/* Subject Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 shadow-sm border border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
              {isGrammar ? "Grammar" : "Reading & Writing"}
            </p>
            <h2 className="text-2xl font-bold text-blue-900 mt-2">
              {syllabusData.subject}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center md:text-right">
            <div>
              <p className="text-3xl font-bold text-blue-900">
                {syllabusData.total_marks}
              </p>
              <p className="text-sm text-blue-700">Total Marks</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">
                {syllabusData.sections.reduce((total, section) => total + section.topics.length, 0)}
              </p>
              <p className="text-sm text-blue-700">Topics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      {syllabusData.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">
                {sectionIndex + 1}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {section.section_title}
              </h2>
              <p className="text-sm text-gray-600">
                {section.section_marks} marks • {section.topics.length} topics
              </p>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                classId={classId}
                courseId={courseId}
                isGrammar={isGrammar}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Progress Summary */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Syllabus Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {syllabusData.sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">{section.section_title}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Topics: {section.topics.length}</p>
                <p>Marks: {section.section_marks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}