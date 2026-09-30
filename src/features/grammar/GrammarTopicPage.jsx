import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { grammarLessons } from '../../data/grammarLessons';
import { gapFillingExercises } from '../../data/gapFillingExercises';
import GapFillingPractice from './GapFillingPractice';
import RulesLesson from './RulesLesson';

export default function GrammarTopicPage() {
  const { classId, courseId, topicSlug } = useParams();
  const navigate = useNavigate();
  const lesson = grammarLessons[topicSlug];
  const [area, setArea] = useState('rules');

  if (!lesson) {
    return <div className="py-12 text-center text-gray-600">Grammar topic not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Class {classId} • English Second Paper</p>
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/topics/${classId}/${courseId}`)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
        >
          ← Back to Syllabus
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200">
        <div className="flex gap-2" role="tablist" aria-label="Grammar topic area">
          <button
            type="button"
            role="tab"
            aria-selected={area === 'rules'}
            onClick={() => setArea('rules')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${area === 'rules' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
          >
            Rules
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={area === 'practice'}
            onClick={() => setArea('practice')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${area === 'practice' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
          >
            Practice Exercises
          </button>
        </div>
        <span className="pb-3 text-sm font-medium text-gray-600">{lesson.marks} Marks</span>
      </div>

      {area === 'rules' ? (
        <RulesLesson lesson={lesson} />
      ) : (
        <GapFillingPractice exercises={lesson.id === 'gap-filling' ? gapFillingExercises : []} />
      )}
    </div>
  );
}