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
  useUserActions,
  useVocabularyActions,
  useProgressActions
} from './appStore';