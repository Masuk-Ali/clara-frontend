import { useState } from 'react';
import RearrangePlayer from './RearrangePlayer';
import { canGuestAccess } from '../../services/accessControl';
import { useGuestMode } from '../../store';
import GuestAccessPrompt from '../../components/ui/GuestAccessPrompt';

export default function RearrangeList({ items, classId }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const isGuest = useGuestMode();
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Rearrange Activities Available
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          There are no sentence arrangement exercises for this topic yet.
        </p>
      </div>
    );
  }

  if (selectedStory) {
    return (
      <RearrangePlayer 
        story={selectedStory} 
        onBack={() => setSelectedStory(null)}
        classId={classId}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg">
        <h3 className="text-amber-800 dark:text-amber-200 font-semibold mb-1">
          🔀 Rearrange Activities
        </h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm">
          Select a story and arrange sentences in the correct order by clicking them one by one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <button
            key={item.id || index}
            onClick={() => {
  if (isGuest && !canGuestAccess('rearrange', index)) {
    console.log('Guest access restricted:', item.id);
    setShowGuestPrompt(true);
    return;
  }

  setSelectedStory(item);
}}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-amber-500 text-left group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-1">
                  Story {index + 1}
                </p>
              </div>
              <div className="text-2xl">📖</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2">
              <span>📝</span>
              <span>{item.sentences.length} sentences to organize</span>
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Click to start</span>
              <span className="font-semibold text-amber-600 group-hover:text-amber-700">→</span>
            </div>
          </button>
        ))}
      </div>
      {showGuestPrompt && (
  <GuestAccessPrompt
    onClose={() => setShowGuestPrompt(false)}
    onSignUp={() => {
      setShowGuestPrompt(false);
    }}
  />
)}
    </div>
    
  );
}
