export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-sm shadow-gray-200/50 backdrop-blur-sm">
        <h1 className="text-3xl font-semibold text-slate-900">About Clara</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Clara is designed to help learners explore courses, practice grammar, and access study resources in a clean, responsive interface.
        </p>
        <div className="mt-6 space-y-4 text-slate-700">
          <p>
            This page provides a quick overview of the platform and the tools available for students to stay organized and focused.
          </p>
          <p>
            Navigate through the dashboard, library, dictionary, and chat features to find the content you need.
          </p>
        </div>
      </div>
    </div>
  );
}
