import { educationData } from '../data/classesData';
import { grammarContent } from '../data/grammarContent';

export class ContentService {
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