import { useState } from 'react';

function getYouTubeEmbedUrl(url) {
  const videoId = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

export default function RulesLesson({ lesson }) {
  const [mode, setMode] = useState('textbook');
  const video = lesson.video || {};
  const youtubeUrl = video.sourceType === 'youtube' ? getYouTubeEmbedUrl(video.url) : null;

  return (
    <section className="space-y-6">
      <div className="inline-flex gap-2 border-b border-gray-200" role="tablist" aria-label="Lesson mode">
        {[
          { id: 'textbook', label: 'Textbook Mode' },
          { id: 'video', label: 'Video Mode' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={mode === tab.id}
            onClick={() => setMode(tab.id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${mode === tab.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === 'textbook' ? (
        <article className="space-y-8">
          <header className="max-w-3xl space-y-3">
            {lesson.instruction && <p className="font-medium text-gray-800">{lesson.instruction}</p>}
            {(lesson.textbook?.introduction || []).map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-gray-700">{paragraph}</p>
            ))}
          </header>

          {(lesson.textbook?.sections || []).map((section) => (
            <section key={section.id} className="max-w-3xl space-y-4 border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900">{section.heading}</h3>
              {(section.paragraphs || []).map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-gray-700">{paragraph}</p>
              ))}

              {section.examples?.length > 0 && (
                <div className="space-y-3 border-l-2 border-blue-300 pl-4">
                  {section.examples.map((example, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-medium text-gray-900">{example.prompt}</p>
                      <p className="text-sm text-blue-800">Answer: {example.answer}</p>
                      <p className="text-sm leading-relaxed text-gray-600">{example.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.comparison?.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.comparison.map((item) => (
                    <div key={item.label} className="border-l-2 border-gray-300 pl-4">
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-gray-700">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </article>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {youtubeUrl ? (
            <div className="aspect-video">
              <iframe
                src={youtubeUrl}
                title={`${lesson.title} video lesson`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : video.sourceType === 'file' && video.url ? (
            <video controls className="aspect-video w-full" src={video.url}>
              Your browser does not support embedded videos.
            </video>
          ) : (
            <div className="flex aspect-video items-center justify-center p-6 text-center text-gray-600">
              <p>{video.placeholder || 'A video lesson will be added here.'}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}