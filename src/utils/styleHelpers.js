/**
 * Utility Functions for Styling and Data Mapping
 * Centralized place for common functions used across components
 */

/**
 * Get Tailwind color classes based on difficulty level
 * @param {string} difficulty - 'beginner', 'intermediate', 'advanced'
 * @returns {string} Tailwind class string
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800';
};

/**
 * Get icon based on topic/content type
 * @param {string} type - 'grammar', 'reading', etc.
 * @returns {string} Emoji or icon
 */
export const getTypeIcon = (type) => {
  const icons = {
    grammar: '📝',
    reading: '📖',
    dictionary: '📚',
    quiz: '🎯',
    practice: '✏️',
  };
  return icons[type] || '📄';
};

/**
 * Normalize and validate answer
 * Case-insensitive comparison for fill-in-the-blank answers
 * @param {string} userAnswer - Answer from user
 * @param {string} correctAnswer - Expected answer
 * @returns {boolean} Whether answer is correct
 */
export const validateAnswer = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return false;
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
};

/**
 * Sanitize and format user input
 * @param {string} input - Raw input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  return input.trim().toLowerCase();
};

/**
 * Get current item and its index from array
 * @param {array} items - Array of items
 * @param {number} currentIndex - Current index
 * @returns {object} { item, index, isFirst, isLast, total }
 */
export const getCurrentItem = (items = [], currentIndex = 0) => {
  const item = items[currentIndex];
  return {
    item,
    index: currentIndex,
    isFirst: currentIndex === 0,
    isLast: currentIndex === items.length - 1,
    total: items.length,
    hasNext: currentIndex < items.length - 1,
    hasPrevious: currentIndex > 0,
  };
};

/**
 * Get progress percentage
 * @param {number} current - Current item index (0-based)
 * @param {number} total - Total items
 * @returns {number} Percentage (0-100)
 */
export const getProgressPercentage = (current, total) => {
  if (total === 0) return 0;
  return Math.round(((current + 1) / total) * 100);
};

/**
 * Calculate score percentage
 * @param {number} correct - Correct answers
 * @param {number} total - Total questions
 * @returns {number} Percentage
 */
export const calculateScorePercentage = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

/**
 * Get performance label based on percentage
 * @param {number} percentage - Score percentage (0-100)
 * @returns {object} { label, color, emoji }
 */
export const getPerformanceLabel = (percentage) => {
  if (percentage >= 90) return { label: 'Excellent', color: 'text-green-600', emoji: '🌟' };
  if (percentage >= 75) return { label: 'Good', color: 'text-blue-600', emoji: '👍' };
  if (percentage >= 60) return { label: 'Fair', color: 'text-yellow-600', emoji: '👌' };
  return { label: 'Needs Practice', color: 'text-red-600', emoji: '💪' };
};

/**
 * Clamp number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Format position for popups (keep within viewport)
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} elementWidth - Width of element
 * @param {number} elementHeight - Height of element
 * @returns {object} { x, y } Safe coordinates
 */
export const formatPopupPosition = (x, y, elementWidth = 320, elementHeight = 300) => {
  const padding = 20;
  
  return {
    x: clamp(x - elementWidth / 2, padding, window.innerWidth - elementWidth - padding),
    y: clamp(y - elementHeight, padding, window.innerHeight - elementHeight - padding),
  };
};

/**
 * Group items by property
 * @param {array} items - Items to group
 * @param {string} property - Property to group by
 * @returns {object} Grouped object
 */
export const groupBy = (items = [], property) => {
  return items.reduce((acc, item) => {
    const key = item[property];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Sort items by property
 * @param {array} items - Items to sort
 * @param {string} property - Property to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {array} Sorted array
 */
export const sortBy = (items = [], property, direction = 'asc') => {
  const sorted = [...items].sort((a, b) => {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
};
