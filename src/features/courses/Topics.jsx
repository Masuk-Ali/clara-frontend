import { useParams, useNavigate } from "react-router-dom";
import { educationData } from "../../data/classesData";

const class10EnglishFirstPaper = [
  {
    title: "1–2. Seen Passage 1",
    marks: 17,
    topicIndex: 0,
  },
  {
    title: "3. Seen Passage 2",
    marks: 5,
    topicIndex: 1,
  },
  {
    title: "4–5. Unseen Passage",
    marks: 15,
    topicIndex: 2,
  },
  {
    title: "6. Matching",
    marks: 5,
    topicIndex: 7,
  },
  {
    title: "7. Re-arranging Sentences",
    marks: 8,
    topicIndex: 6,
  },
  {
    title: "8. Poem Q&A",
    marks: 10,
    topicIndex: 8,
  },
  {
    title: "9. Story Q&A",
    marks: 10,
    topicIndex: 9,
  },
];

const class10EnglishFirstWriting = [
  {
    title: "10. Completing a Story",
    marks: 15,
    topicIndex: 10,
  },
  {
    title: "11. Writing Dialogue",
    marks: 15,
    topicIndex: 11,
  },
];

const secondaryEnglishSecondPaper = [
  {
    title: "PART A: GRAMMAR",
    marks: 60,
    topics: [
    { title: "1. Gap Filling with Clues / Without Clues", marks: 10, slug: "gap-filling" },
      { title: "2. Substitution Table", marks: 5 },
      { title: "3. Right Form of Verbs", marks: 10 },
      {
        title: "4. Changing Sentences",
        marks: 10,
        description: "Affirmative, Negative, Assertive, Interrogative, Exclamatory, Simple, Complex, Compound",
      },
      { title: "5. Tag Questions", marks: 5 },
      { title: "6. Suffixes and Prefixes", marks: 5 },
      { title: "7. Prepositions", marks: 5 },
      { title: "8. Connectors / Linking Words", marks: 5 },
      { title: "9. Punctuation and Capitalization", marks: 5 },
    ],
  },
  {
    title: "PART B: WRITING TEST",
    marks: 40,
    topics: [
      { title: "10. Paragraph Writing", marks: 10 },
      { title: "11. E-mail / Letter / Application Writing", marks: 10 },
      { title: "12. Short Composition / Essay", marks: 20 },
    ],
  },
];

export default function Topics() {
  const { classId, courseId } = useParams();
  const navigate = useNavigate();

  const selectedClass = educationData
    .flatMap((level) => level.classes)
    .find((cls) => cls.id === classId);

  const selectedCourse = selectedClass?.courses.find((course) => course.id === courseId);

  if (!selectedClass || !selectedCourse) {
    return <div className="text-center text-red-600 mt-20">Course not found</div>;
  }

  const topics = selectedCourse.topics || [];
  const isGrammar = selectedCourse.type === "grammar";
  const sectionLabel = isGrammar ? "Grammar Topics" : "Reading Passages";
  const cardLabel = isGrammar ? "Grammar" : "Reading";

  if (selectedClass.level === "secondary" && courseId === "eng2") {
    return (
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">{selectedClass.name} • {selectedCourse.name}</p>
            <h1 className="text-3xl font-bold text-gray-900">English 2nd Paper</h1>
          </div>
          <button
            onClick={() => navigate(`/courses/${classId}`)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-200"
          >
            ⬅️ Back to Courses
          </button>
        </div>

        {secondaryEnglishSecondPaper.map((section) => (
          <section key={section.title} className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-gray-300 pb-3">
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              <span className="text-sm font-semibold text-gray-600">{section.marks} Marks</span>
            </div>
            <div className="divide-y divide-gray-200">
              {section.topics.map((topic) => (
                topic.slug ? (
                  <button
                    key={topic.title}
                    type="button"
                    onClick={() => navigate(`/grammar-lesson/${classId}/${courseId}/${topic.slug}`)}
                    className="flex w-full flex-col gap-1 py-4 text-left transition hover:text-blue-700 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <span className="font-semibold">{topic.title}</span>
                    <span className="shrink-0 text-sm font-medium text-gray-600">{topic.marks} Marks</span>
                  </button>
                ) : (
                  <div key={topic.title} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                      {topic.description && <p className="mt-1 text-sm text-gray-600"><em>{topic.description}</em></p>}
                    </div>
                    <span className="shrink-0 text-sm font-medium text-gray-600">{topic.marks} Marks</span>
                  </div>
                )
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (classId === "10" && courseId === "eng1") {
    const renderSyllabusSections = (title, marks, sections) => (
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-gray-300 pb-3">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <span className="text-sm font-semibold text-gray-600">{marks} Marks</span>
        </div>
        <div className="divide-y divide-gray-200">
          {sections.map((section) => (
            section.topicIndex !== undefined ? (
              <button
                key={section.title}
                type="button"
                onClick={() => navigate(`/content/${classId}/${courseId}/${section.topicIndex}`)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-gray-900 transition hover:text-blue-700"
              >
                <span>{section.title}</span>
                <span className="shrink-0 text-sm font-medium text-gray-600">{section.marks} Marks</span>
              </button>
            ) : (
              <div key={section.title} className="py-4">
                <h3 className="font-semibold text-gray-900">
                  {section.title} — {section.marks} Marks
                </h3>
                {section.questions?.map((question) => (
                <button
                  key={question.number}
                  type="button"
                  onClick={() => navigate(`/content/${classId}/${courseId}/${question.topicIndex}`)}
                  className="mt-3 flex w-full items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {question.number}. {question.title}
                  </span>
                  <span className="shrink-0 text-sm text-gray-600">{question.marks} Marks</span>
                </button>
                ))}
              </div>
            )
          ))}
        </div>
      </section>
    );

    return (
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">{selectedClass.name} • {selectedCourse.name}</p>
            <h1 className="text-3xl font-bold text-gray-900">English 1st Paper</h1>
          </div>
          <button
            onClick={() => navigate(`/courses/${classId}`)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-200"
          >
            ⬅️ Back to Courses
          </button>
        </div>

        {renderSyllabusSections("PART A: READING", 70, class10EnglishFirstPaper)}
        {renderSyllabusSections("PART B: WRITING", 30, class10EnglishFirstWriting)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">{selectedClass.name} • {selectedCourse.name}</p>
          <h1 className="text-3xl font-bold text-gray-900">{sectionLabel}</h1>
        </div>
        <button
          onClick={() => navigate(`/courses/${classId}`)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-700 hover:bg-gray-200 transition"
        >
          ⬅️ Back to Courses
        </button>
      </div>

      <div className="bg-blue-50 rounded-3xl p-6 shadow-sm border border-blue-100">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">{cardLabel}</p>
            <h2 className="text-2xl font-bold text-blue-900 mt-2">{selectedCourse.name}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center md:text-right">
            <div>
              <p className="text-3xl font-bold text-blue-900">{topics.length}</p>
              <p className="text-sm text-blue-700">Total Topics</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">{isGrammar ? "Concepts" : "Passages"}</p>
              <p className="text-sm text-blue-700">Learning Style</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic, index) => {
          const topicName = typeof topic === 'string' ? topic : topic.name;
          return (
          <button
            key={topicName}
            onClick={() => navigate(isGrammar ? `/grammar/${classId}/${courseId}/${index}` : `/content/${classId}/${courseId}/${index}`)}
            className="group rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                {isGrammar ? "📝" : typeof topic === 'object' && topic.type === 'rearrange' ? "🔀" : "📚"}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                {isGrammar ? "Grammar" : typeof topic === 'object' && topic.type === 'rearrange' ? "Rearrange" : "Reading"}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{topicName}</h3>
            <p className="mt-3 text-sm text-gray-600">Continue your {sectionLabel.toLowerCase()} for {selectedClass.name}.</p>
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <span>{index + 1} of {topics.length}</span>
              <span className="font-semibold text-blue-600 group-hover:text-blue-800">Start</span>
            </div>
          </button>
          );
        })}
      </div>
    </div>
  );
}