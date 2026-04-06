import { educationData } from '../data/classesData';
import { grammarContent } from '../data/grammarContent';
import { contentDatabase } from '../data/topicsDatabase';

export class ContentService {
  /**
   * Legacy method - Load content by class/course/topic
   */
  static async loadContent(classId, courseId, topicId, contentType) {
    try {
      // Find the class and course
      const classData = educationData
        .flatMap(level => level.classes)
        .find(c => c.id === classId);

      const courseData = classData?.courses.find(c => c.id === courseId);

      if (!classData || !courseData) {
        throw new Error('Course not found');
      }

      let topicContent = null;
      let topicName = '';
      let metadata = {};

      if (contentType === 'grammar') {
        // Load grammar content
        const grammarTopic = courseData.topics.find(t => t.id === topicId) || topicId;
        topicContent = grammarContent[grammarTopic];
        topicName = grammarTopic;

        if (!topicContent) {
          throw new Error('Grammar topic not found');
        }

        metadata = {
          difficulty: topicContent.difficulty,
          type: 'grammar',
          hasPractice: !!topicContent.practice?.length,
          hasQuiz: !!topicContent.quiz?.length
        };

      } else if (contentType === 'reading') {
        // Load reading content from syllabus
        const syllabusPath = `../data/Syllabus/${classData.level.toUpperCase()}/${courseData.name.replace(/\s+/g, '')}.json`;

        try {
          const syllabusModule = await import(syllabusPath);
          const syllabusData = syllabusModule.default;
          topicContent = syllabusData[topicId];
          topicName = topicContent?.title || `Reading ${topicId}`;

          if (!topicContent) {
            throw new Error('Reading content not found');
          }

          metadata = {
            type: 'reading',
            hasQuestions: !!topicContent.questions?.length,
            wordCount: topicContent.content?.split(' ').length || 0
          };

        } catch (err) {
          throw new Error('Reading content not available');
        }
      }

      return {
        content: topicContent,
        metadata: {
          ...metadata,
          topicName,
          classData,
          courseData,
          topicId
        }
      };

    } catch (error) {
      throw new Error(`Failed to load content: ${error.message}`);
    }
  }

  static getAvailableTopics(classId, courseId) {
    const classData = educationData
      .flatMap(level => level.classes)
      .find(c => c.id === classId);

    const courseData = classData?.courses.find(c => c.id === courseId);

    if (!courseData) return [];

    // For grammar courses, return available grammar topics
    if (courseData.type === 'grammar') {
      return courseData.topics.map(topic => ({
        id: topic,
        name: topic,
        type: 'grammar',
        available: !!grammarContent[topic]
      }));
    }

    // For reading courses, we'd need to check syllabus data
    // For now, return basic topic structure
    return courseData.topics.map((topic, index) => ({
      id: index.toString(),
      name: topic,
      type: 'reading',
      available: true
    }));
  }

  static validateContent(content, contentType) {
    if (!content) return false;

    switch (contentType) {
      case 'grammar':
        return !!(
          content.title &&
          content.description &&
          content.rules &&
          Array.isArray(content.rules)
        );

      case 'reading':
        return !!(
          content.title &&
          content.content &&
          typeof content.content === 'string'
        );

      default:
        return false;
    }
  }

  /**
   * NEW: Data-driven methods for unified content structure
   */

  /**
   * Fetch a single topic by ID from the unified database
   * @param {string} topicId - The topic identifier
   * @returns {object} Topic data object
   */
  static getTopic(topicId) {
    if (!topicId) {
      console.warn('ContentService: No topic ID provided');
      return null;
    }

    const topic = contentDatabase[topicId.toLowerCase()];
    if (!topic) {
      console.warn(`ContentService: Topic "${topicId}" not found`);
      return null;
    }

    return topic;
  }

  /**
   * Fetch topics by type
   * @param {string} type - Topic type ('grammar', 'reading', etc.)
   * @returns {array} Array of topics matching the type
   */
  static getTopicsByType(type) {
    if (!type) {
      return Object.values(contentDatabase);
    }

    return Object.values(contentDatabase).filter(
      (topic) => topic.type === type.toLowerCase()
    );
  }

  /**
   * Get all topic IDs of a specific type
   * @param {string} type - Topic type
   * @returns {array} Array of topic IDs
   */
  static getTopicIds(type) {
    const topics = type
      ? this.getTopicsByType(type)
      : Object.values(contentDatabase);
    return topics.map((t) => t.id);
  }

  /**
   * Search topics
   * @param {string} query - Search query
   * @returns {array} Matching topics
   */
  static search(query) {
    if (!query) return Object.values(contentDatabase);

    const q = query.toLowerCase();
    return Object.values(contentDatabase).filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.id.toLowerCase().includes(q)
    );
  }

  /**
   * Validate topic data structure
   * @param {object} topic - Topic object to validate
   * @returns {boolean} Whether the topic is valid
   */
  static isValidTopic(topic) {
    return (
      topic &&
      topic.id &&
      topic.type &&
      topic.title &&
      topic.description
    );
  }
}

// Content type constants
export const CONTENT_TYPES = {
  GRAMMAR: 'grammar',
  READING: 'reading',
  PRACTICE: 'practice',
  QUIZ: 'quiz'
};

// Content difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};