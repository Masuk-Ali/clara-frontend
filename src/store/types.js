// Type definitions for the app store
// These can be used for better TypeScript support

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  pronunciation?: string;
  addedAt: Date;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface CourseProgress {
  courseId: string;
  completedTopics: string[];
  totalTopics: number;
  lastAccessedAt: Date;
  score?: number;
  timeSpent?: number; // in minutes
}

export interface AppState {
  // State
  user: User | null;
  vocabulary: VocabularyWord[];
  progress: Record<string, CourseProgress>;

  // User actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;

  // Vocabulary actions
  addWord: (word: Omit<VocabularyWord, 'id' | 'addedAt'>) => void;
  removeWord: (wordId: string) => void;
  updateWord: (wordId: string, updates: Partial<VocabularyWord>) => void;
  clearVocabulary: () => void;

  // Progress actions
  updateProgress: (courseId: string, progress: Partial<CourseProgress>) => void;
  completeTopic: (courseId: string, topicId: string) => void;
  resetProgress: (courseId: string) => void;
  clearAllProgress: () => void;

  // Utility actions
  reset: () => void;
}