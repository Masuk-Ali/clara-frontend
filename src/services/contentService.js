import { educationData, getRearrangeContent, rearrangeBank } from '../data/classesData';
import { grammarContent } from '../data/grammarContent';
import { contentDatabase } from '../data/topicsDatabase';

// Static imports for syllabus data
import hscEnglish1st from '../data/Syllabus/HSC/English1st.json';
import hscEnglish2nd from '../data/Syllabus/HSC/English2nd.json';
import sscEnglish1st from '../data/Syllabus/SSC/English1st.json';
import sscEnglish2nd from '../data/Syllabus/SSC/English2nd.json';
import jscEnglish from '../data/Syllabus/JSC/English1st&2nd.json';

// Create a lookup map for syllabus data
const syllabusDataMap = {
  'HSC': {
    'English1st': hscEnglish1st,
    'English2nd': hscEnglish2nd
  },
  'SSC': {
    'English1st': sscEnglish1st,
    'English2nd': sscEnglish2nd
  },
  'JSC': {
    'English1st&2nd': jscEnglish
  }
};

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

      // --- TOPIC RESOLUTION ---
      // 1. Try to find the topic in courseData.topics first
      const topicIndex = parseInt(topicId, 10);
      const candidateTopics = [];

      if (!isNaN(topicIndex)) {
        const exactTopic = courseData.topics[topicIndex];
        if (exactTopic !== undefined) {
          candidateTopics.push(exactTopic);
        }

        if (topicIndex > 0) {
          const oneBasedTopic = courseData.topics[topicIndex - 1];
          if (oneBasedTopic !== undefined && oneBasedTopic !== exactTopic) {
            candidateTopics.push(oneBasedTopic);
          }
        }
      }

      const nameTopic = courseData.topics.find(t => 
        (typeof t === 'object' ? t.name : t).toLowerCase() === topicId.toLowerCase()
      );

      if (nameTopic && !candidateTopics.includes(nameTopic)) {
        candidateTopics.push(nameTopic);
      }

      let topicContent = null;
      let topicName = '';
      let metadata = {};
      let lastError = null;

      const tryLoadCandidate = (directTopic) => {
        if (!directTopic) return false;

        if (typeof directTopic === 'object') {
          topicName = directTopic.name || topicId;
          metadata = {
            type: directTopic.type || courseData.type || contentType,
            topicName,
            classData,
            courseData,
            topicId
          };

          if (directTopic.type === 'rearrange' && Array.isArray(directTopic.storyIds)) {
            const storyIds = directTopic.storyIds.length <= 1
              ? rearrangeBank.map((story) => story.id)
              : directTopic.storyIds;

            const items = storyIds
              .map((storyId) => getRearrangeContent(storyId, classData.id))
              .filter(Boolean);

            topicContent = {
              ...directTopic,
              items
            };
          } else {
            topicContent = directTopic;
          }

          return true;
        }

        if (contentType === 'grammar' || courseData.type === 'grammar') {
          const grammarTopic = directTopic;
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
          return true;
        }

        if (contentType === 'reading' || courseData.type === 'reading') {
          const levelMap = {
            'primary': 'JSC',
            'secondary': 'SSC',
            'higher': 'HSC'
          };
          const levelKey = levelMap[classData.level] || classData.level.toUpperCase();

          let courseKey = courseData.name.includes('First') ? 'English1st' : 'English2nd';
          if (levelKey === 'JSC') courseKey = 'English1st&2nd';

          const syllabusData = syllabusDataMap[levelKey]?.[courseKey];

          if (!syllabusData) {
            throw new Error('Reading content not available');
          }

          const lookupId = directTopic;
          topicContent = syllabusData[lookupId];
          if (!topicContent && !isNaN(topicIndex)) {
            topicContent = Object.values(syllabusData)[topicIndex];
          }

          topicName = topicContent?.title || lookupId;

          if (!topicContent) {
            throw new Error('Reading content not found');
          }

          metadata = {
            type: 'reading',
            hasQuestions: !!topicContent.questions?.length,
            wordCount: topicContent.content?.split(' ').length || 0
          };
          return true;
        }

        return false;
      };

      for (const candidate of candidateTopics) {
        try {
          if (tryLoadCandidate(candidate)) {
            break;
          }
        } catch (error) {
          lastError = error;
          topicContent = null;
          topicName = '';
          metadata = {};
        }
      }

      if (!topicContent) {
        throw lastError || new Error('Topic not found');
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

    return courseData.topics.map((topic, index) => {
      const isObject = typeof topic === 'object';
      const name = isObject ? topic.name : topic;
      const type = isObject ? (topic.type || courseData.type) : courseData.type;
      
      return {
        id: index.toString(),
        name: name,
        type: type,
        available: type === 'grammar' ? !!grammarContent[name] : true
      };
    });
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