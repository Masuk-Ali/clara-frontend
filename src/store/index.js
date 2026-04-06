// Store index - Main entry point for the app store
export { useAppStore, default } from './appStore';

// Export individual hooks for better tree-shaking
export {
  useUser,
  useVocabulary,
  useProgress,
  useIsAuthenticated,
  useVocabularyCount,
  useCourseProgress,
  useCompletedTopicsCount,
  useSetUser,
  useUpdateUser,
  useClearUser,
  useAddWord,
  useRemoveWord,
  useUpdateWord,
  useClearVocabulary,
  useUpdateProgress,
  useCompleteTopic,
  useResetProgress,
  useClearAllProgress
} from './appStore';