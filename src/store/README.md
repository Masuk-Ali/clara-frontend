# App Store (Zustand)

Global state management for the Clara educational app using Zustand.

## Features

- **Persistent State**: Automatically saves to localStorage
- **Type Safety**: Full TypeScript support with defined interfaces
- **Performance**: Optimized with selectors and computed values
- **Scalable**: Easy to extend with new state and actions

## State Structure

```javascript
{
  user: User | null,           // Current user information
  vocabulary: VocabularyWord[], // Saved vocabulary words
  progress: Record<string, CourseProgress> // Course progress tracking
}
```

## Basic Usage

### Import the store

```javascript
import { useAppStore } from '../store';
// or import specific hooks
import { useUser, useVocabulary, useProgressActions } from '../store';
```

### Using state in components

```javascript
import { useAppStore } from '../store';

function MyComponent() {
  const user = useAppStore(state => state.user);
  const vocabulary = useAppStore(state => state.vocabulary);
  const { setUser, addWord } = useAppStore(state => state);

  // Use state...
}
```

### Using specific hooks (recommended for better performance)

```javascript
import { useUser, useVocabularyActions } from '../store';

function MyComponent() {
  const user = useUser();
  const { addWord, removeWord } = useVocabularyActions();

  const handleAddWord = () => {
    addWord({
      word: 'hello',
      definition: 'a greeting',
      difficulty: 'easy'
    });
  };
}
```

## Available Hooks

### State Hooks
- `useUser()` - Get current user
- `useVocabulary()` - Get vocabulary array
- `useProgress()` - Get progress object
- `useIsAuthenticated()` - Boolean for authentication status
- `useVocabularyCount()` - Number of saved words
- `useCourseProgress(courseId)` - Progress for specific course
- `useCompletedTopicsCount(courseId)` - Number of completed topics

### Action Hooks
- `useUserActions()` - User-related actions
- `useVocabularyActions()` - Vocabulary management actions
- `useProgressActions()` - Progress tracking actions

## Actions

### User Actions
```javascript
setUser(user)           // Set current user
updateUser(updates)     // Update user properties
clearUser()             // Clear user (logout)
```

### Vocabulary Actions
```javascript
addWord(wordData)       // Add new word to vocabulary
removeWord(wordId)      // Remove word by ID
updateWord(wordId, updates) // Update word properties
clearVocabulary()       // Clear all vocabulary
```

### Progress Actions
```javascript
updateProgress(courseId, progress) // Update course progress
completeTopic(courseId, topicId)   // Mark topic as completed
resetProgress(courseId)            // Reset progress for course
clearAllProgress()                 // Clear all progress
```

## Examples

### User Authentication
```javascript
import { useUserActions, useUser } from '../store';

function LoginComponent() {
  const { setUser } = useUserActions();
  const user = useUser();

  const handleLogin = async (credentials) => {
    const userData = await loginAPI(credentials);
    setUser(userData);
  };

  return (
    <div>
      {user ? `Welcome ${user.name}!` : 'Please login'}
    </div>
  );
}
```

### Vocabulary Management
```javascript
import { useVocabulary, useVocabularyActions } from '../store';

function VocabularyList() {
  const vocabulary = useVocabulary();
  const { addWord, removeWord } = useVocabularyActions();

  return (
    <div>
      {vocabulary.map(word => (
        <div key={word.id}>
          <h3>{word.word}</h3>
          <p>{word.definition}</p>
          <button onClick={() => removeWord(word.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

### Progress Tracking
```javascript
import { useProgressActions, useCompletedTopicsCount } from '../store';

function CourseProgress({ courseId }) {
  const { completeTopic } = useProgressActions();
  const completedCount = useCompletedTopicsCount(courseId);

  const handleCompleteTopic = (topicId) => {
    completeTopic(courseId, topicId);
  };

  return (
    <div>
      <p>Completed topics: {completedCount}</p>
      <button onClick={() => handleCompleteTopic('topic-1')}>
        Complete Topic 1
      </button>
    </div>
  );
}
```

## Persistence

The store automatically persists the following data to localStorage:
- User information
- Vocabulary list
- Course progress

Data is restored when the app reloads.

## Extending the Store

To add new state or actions:

1. Update the `AppState` interface in `types.js`
2. Add the state property and actions to the store in `appStore.js`
3. Export any new selectors or action hooks
4. Update this README

## Best Practices

1. **Use specific hooks** instead of the general `useAppStore` for better performance
2. **Avoid deep object updates** - use immutable patterns
3. **Keep actions simple** - complex logic should be in services
4. **Use selectors** for computed values to avoid unnecessary re-renders
5. **Test actions** thoroughly, especially those that modify state