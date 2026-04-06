import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types are defined in types.js for reference

// Create the store with persistence
export const useAppStore = create()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      vocabulary: [],
      progress: {},

      // User actions
      setUser: (user) => set({ user }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      clearUser: () => set({ user: null }),

      // Vocabulary actions
      addWord: (wordData) => set((state) => ({
        vocabulary: [
          ...state.vocabulary,
          {
            ...wordData,
            id: `word_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            addedAt: new Date()
          }
        ]
      })),

      removeWord: (wordId) => set((state) => ({
        vocabulary: state.vocabulary.filter(word => word.id !== wordId)
      })),

      updateWord: (wordId, updates) => set((state) => ({
        vocabulary: state.vocabulary.map(word =>
          word.id === wordId ? { ...word, ...updates } : word
        )
      })),

      clearVocabulary: () => set({ vocabulary: [] }),

      // Progress actions
      updateProgress: (courseId, progressUpdate) => set((state) => ({
        progress: {
          ...state.progress,
          [courseId]: {
            ...state.progress[courseId],
            ...progressUpdate,
            lastAccessedAt: new Date()
          }
        }
      })),

      completeTopic: (courseId, topicId) => set((state) => {
        const currentProgress = state.progress[courseId] || {
          courseId,
          completedTopics: [],
          totalTopics: 0,
          lastAccessedAt: new Date()
        };

        const completedTopics = currentProgress.completedTopics.includes(topicId)
          ? currentProgress.completedTopics
          : [...currentProgress.completedTopics, topicId];

        return {
          progress: {
            ...state.progress,
            [courseId]: {
              ...currentProgress,
              completedTopics,
              lastAccessedAt: new Date()
            }
          }
        };
      }),

      resetProgress: (courseId) => set((state) => {
        const newProgress = { ...state.progress };
        delete newProgress[courseId];
        return { progress: newProgress };
      }),

      clearAllProgress: () => set({ progress: {} }),

      // Utility actions
      reset: () => set({
        user: null,
        vocabulary: [],
        progress: {}
      })
    }),
    {
      name: 'clara-app-store', // Key for localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist certain parts of the state
      partialize: (state) => ({
        user: state.user,
        vocabulary: state.vocabulary,
        progress: state.progress
      })
    }
  )
);

// Selectors for better performance (optional but recommended)
export const useUser = () => useAppStore((state) => state.user);
export const useVocabulary = () => useAppStore((state) => state.vocabulary);
export const useProgress = () => useAppStore((state) => state.progress);

// Computed selectors
export const useIsAuthenticated = () => useAppStore((state) => !!state.user);
export const useVocabularyCount = () => useAppStore((state) => state.vocabulary.length);
export const useCourseProgress = (courseId) =>
  useAppStore((state) => state.progress[courseId]);
export const useCompletedTopicsCount = (courseId) =>
  useAppStore((state) => state.progress[courseId]?.completedTopics?.length || 0);

// Actions selectors for better tree-shaking
export const useSetUser = () => useAppStore((state) => state.setUser);
export const useUpdateUser = () => useAppStore((state) => state.updateUser);
export const useClearUser = () => useAppStore((state) => state.clearUser);

export const useAddWord = () => useAppStore((state) => state.addWord);
export const useRemoveWord = () => useAppStore((state) => state.removeWord);
export const useUpdateWord = () => useAppStore((state) => state.updateWord);
export const useClearVocabulary = () => useAppStore((state) => state.clearVocabulary);

export const useUpdateProgress = () => useAppStore((state) => state.updateProgress);
export const useCompleteTopic = () => useAppStore((state) => state.completeTopic);
export const useResetProgress = () => useAppStore((state) => state.resetProgress);
export const useClearAllProgress = () => useAppStore((state) => state.clearAllProgress);

export default useAppStore;