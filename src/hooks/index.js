import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for loading data with loading/error states
 * Useful for ContentService.getTopic(), fetching data, etc.
 *
 * @param {function} fetchFn - Async function that fetches data
 * @param {array} dependencies - Array of dependencies to re-run fetch
 * @returns {object} { data, loading, error, retry }
 */
export const useDataLoader = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, retry: load };
};

/**
 * Hook for managing paginated/stepping through items
 * Used in PracticeEngine, QuizEngine, etc.
 *
 * @param {array} items - Array of items to paginate through
 * @param {number} initialIndex - Starting index
 * @returns {object} { currentItem, index, goNext, goPrevious, goto, reset, progress }
 */
export const usePaginatedItems = (items = [], initialIndex = 0) => {
  const [index, setIndex] = useState(initialIndex);

  const currentItem = items[index];

  const goNext = useCallback(() => {
    setIndex((prev) => Math.min(prev + 1, items.length - 1));
  }, [items.length]);

  const goPrevious = useCallback(() => {
    setIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goto = useCallback((newIndex) => {
    const clampedIndex = Math.max(0, Math.min(newIndex, items.length - 1));
    setIndex(clampedIndex);
  }, [items.length]);

  const reset = useCallback(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  const isFirst = index === 0;
  const isLast = index === items.length - 1;
  const progress = items.length > 0 ? ((index + 1) / items.length) * 100 : 0;

  return {
    currentItem,
    index,
    goNext,
    goPrevious,
    goto,
    reset,
    isFirst,
    isLast,
    progress,
    total: items.length,
  };
};

/**
 * Hook for search and filter functionality
 *
 * @param {array} items - Items to search/filter
 * @param {function} filterFn - Filter function that takes (item, query)
 * @returns {object} { query, setQuery, results, filter, hasResults }
 */
export const useSearch = (items = [], filterFn = null) => {
  const [query, setQuery] = useState('');

  const defaultFilter = (item, q) => {
    const searchableText = JSON.stringify(item).toLowerCase();
    return searchableText.includes(q.toLowerCase());
  };

  const filter = filterFn || defaultFilter;

  const results = query
    ? items.filter((item) => filter(item, query))
    : items;

  const clearQuery = () => setQuery('');

  return {
    query,
    setQuery,
    results,
    hasResults: results.length > 0,
    isEmpty: query.length > 0 && results.length === 0,
    clearQuery,
    resultCount: results.length,
  };
};

/**
 * Hook for managing tab/section state
 *
 * @param {array} tabs - Array of tab objects or IDs
 * @param {string} defaultTab - Default active tab ID
 * @returns {object} { activeTab, setActiveTab, tabs }
 */
export const useTabs = (tabs = [], defaultTab = null) => {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.id || tabs[0]));

  useEffect(() => {
    // Validate that active tab exists in tabs
    const tabIds = tabs.map((t) => (typeof t === 'string' ? t : t.id));
    if (!tabIds.includes(activeTab)) {
      setActiveTab(defaultTab || tabIds[0]);
    }
  }, [tabs, defaultTab, activeTab]);

  return { activeTab, setActiveTab };
};

/**
 * Hook for local storage persistence
 *
 * @param {string} key - Storage key
 * @param {any} initialValue - Default value
 * @returns {array} [storedValue, setStoredValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window?.localStorage?.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window?.localStorage?.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * Hook for escape key handling
 *
 * @param {function} callback - Function to call when escape is pressed
 * @returns {void}
 */
export const useEscapeKey = (callback) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        callback?.();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [callback]);
};

/**
 * Hook for Enter key handling on input
 *
 * @param {function} callback - Function to call when enter is pressed
 * @returns {function} Event handler to attach to input
 */
export const useEnterKey = (callback) => {
  return (e) => {
    if (e.key === 'Enter') {
      callback?.();
    }
  };
};

/**
 * Hook for debounced values (e.g., for search)
 *
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for tracking if component is mounted
 * Useful for preventing state updates after unmount
 *
 * @returns {object} { isMounted } - Ref that becomes false on unmount
 */
export const useIsMounted = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
};

/**
 * Hook for managing quiz/assessment scores
 *
 * @param {number} totalQuestions - Total number of questions
 * @returns {object} { correct, total, addCorrect, addIncorrect, reset, percentage }
 */
export const useScore = (totalQuestions = 0) => {
  const [correct, setCorrect] = useState(0);

  const addCorrect = useCallback(() => {
    setCorrect((prev) => Math.min(prev + 1, totalQuestions));
  }, [totalQuestions]);

  const addIncorrect = useCallback(() => {
    // Just increment without changing correct count
  }, []);

  const reset = useCallback(() => {
    setCorrect(0);
  }, []);

  const percentage = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

  return {
    correct,
    total: totalQuestions,
    addCorrect,
    addIncorrect,
    reset,
    percentage,
  };
};

/**
 * Hook for managing form input states
 *
 * @param {object} initialValues - Initial form values
 * @returns {object} { values, errors, setFieldValue, setFieldError, reset, isDirty }
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    setFieldValue,
    setFieldError,
    reset,
    isDirty,
  };
};
