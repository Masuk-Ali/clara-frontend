/**
 * Unified Topic Data Structure
 * All learning content follows this standard format
 */

export const topicsDatabase = {
  // Grammar Topics
  'tense': {
    id: 'tense',
    type: 'grammar',
    title: 'Mastering English Tenses',
    description: 'Tenses are the backbone of English grammar. Understanding them helps you express time relationships clearly and accurately.',
    difficulty: 'intermediate',
    category: 'grammar',

    rules: [
      'Present Simple: Used for habits, facts, and general truths (I eat breakfast daily)',
      'Past Simple: Used for completed actions in the past (I ate breakfast yesterday)',
      'Future Simple: Used for future plans and predictions (I will eat breakfast tomorrow)',
      'Present Continuous: Used for ongoing actions (I am eating breakfast now)',
      'Past Continuous: Used for ongoing actions in the past (I was eating breakfast when you called)',
      'Future Continuous: Used for ongoing future actions (I will be eating breakfast at 8 AM)'
    ],

    examples: [
      {
        sentence: 'She walks to school every day.',
        note: 'Present Simple - Habit',
        explanation: 'This shows a regular, repeated action. The subject "she" performs the action "walks" regularly.',
        tips: ['Use base form of verb', 'Add -s for he/she/it', 'No auxiliary needed']
      },
      {
        sentence: 'They played football yesterday.',
        note: 'Past Simple - Completed Action',
        explanation: 'This describes an action that started and finished in the past. The time marker "yesterday" confirms it\'s completed.',
        tips: ['Add -ed to regular verbs', 'Use irregular verb forms', 'Don\'t use auxiliary']
      }
    ],

    practice: [
      {
        type: 'fill_blank',
        prompt: 'Complete: She ___ (go) to college every year.',
        answer: 'goes',
        explanation: 'Present simple tense for habitual actions. Add -s to the base verb "go" for third person singular.',
        hint: 'Think about daily routines or habits.'
      }
    ],

    quiz: [
      {
        type: 'mcq',
        question: 'Choose the correct form: "She ___ (read) a book every night."',
        options: ['read', 'reads', 'reading', 'readed'],
        correct: 1,
        explanation: 'Present Simple: "reads" for third person singular habit.'
      }
    ]
  },

  'passive-voice': {
    id: 'passive-voice',
    type: 'grammar',
    title: 'Active and Passive Voice',
    description: 'Voice changes focus from doer to receiver. Master this to write varied, sophisticated sentences.',
    difficulty: 'advanced',
    category: 'grammar',

    rules: [
      'Active: Subject performs the action (The chef cooked the meal)',
      'Passive: Subject receives the action (The meal was cooked by the chef)',
      'Passive formula: Object + was/were + past participle + by + subject',
      'Keep original tense when changing voice',
      'Use passive when doer is unknown or less important'
    ],

    examples: [
      {
        sentence: 'The teacher explains the lesson.',
        note: 'Active Voice',
        explanation: 'The subject "teacher" is performing the action "explains" on the object "lesson".',
        transformation: 'Passive: The lesson is explained by the teacher.',
        tips: ['Subject does the action', 'Focus on the doer', 'More direct']
      }
    ],

    practice: [
      {
        type: 'fill_blank',
        prompt: 'Change to passive: The students ___ (write) the exam.',
        answer: 'wrote',
        explanation: 'Passive voice: The exam was written by the students. Keep the past tense.',
        hint: 'What tense is the active sentence in?'
      }
    ],

    quiz: [
      {
        type: 'mcq',
        question: 'Which is the passive form of "They built this house in 1990"?',
        options: [
          'This house was built in 1990.',
          'This house is built in 1990.',
          'This house built in 1990.',
          'This house will be built in 1990.'
        ],
        correct: 0,
        explanation: 'Passive: Object becomes subject, add "was/were + past participle", keep original tense.'
      }
    ]
  }
};

/**
 * READING TOPICS
 */
export const readingsDatabase = {
  'the-doting-mother': {
    id: 'the-doting-mother',
    type: 'reading',
    title: 'The Doting Mother',
    description: 'A heartwarming story about a mother\'s love and dedication.',
    difficulty: 'intermediate',
    category: 'reading',

    passage: `A mother is the most precious gift in this world. She sacrifices everything for her children. From the moment a child is born, a mother\'s life revolves around the child\'s happiness and well-being. She works tirelessly to provide food, shelter, and education. A mother\'s love is unconditional and boundless. She never expects anything in return. Her greatest reward is seeing her children grow into responsible adults. Every culture recognizes the importance of mothers. Mother\'s Day is celebrated worldwide to honor this sacred relationship. Children should always respect and care for their mothers. A mother\'s blessing is the most powerful force in the world.`,

    wordData: {
      'precious': {
        definition: 'Of very high worth; valuable',
        pronunciation: 'PRESH-us',
        partOfSpeech: 'adjective',
        example: 'Diamonds are precious stones.',
        synonyms: ['valuable', 'priceless', 'treasured']
      },
      'sacrifices': {
        definition: 'Gives up something valued for someone else\'s benefit',
        pronunciation: 'SAK-ri-fys',
        partOfSpeech: 'verb',
        example: 'Parents sacrifice for their children.',
        synonyms: ['surrender', 'relinquish', 'forego']
      },
      'unconditional': {
        definition: 'Not subject to any conditions; absolute',
        pronunciation: 'un-kun-DISH-un-ul',
        partOfSpeech: 'adjective',
        example: 'A mother\'s love is unconditional.',
        synonyms: ['absolute', 'unlimited', 'unqualified']
      }
    },

    sentenceExplanations: {
      0: {
        bengali: 'এই বিশ্বে মা সবচেয়ে মূল্যবান উপহার।',
        grammar: 'Simple present tense with "is" (linking verb). Subject: "A mother", Predicate: "is the most precious gift."'
      }
    },

    questions: [
      {
        type: 'mcq',
        question: 'What does the passage say about a mother\'s love?',
        options: [
          'It is conditional',
          'It is unconditional and boundless',
          'It changes over time',
          'It depends on children\'s success'
        ],
        correct: 1,
        explanation: 'The passage explicitly states "A mother\'s love is unconditional and boundless."'
      },
      {
        type: 'fill_blank',
        question: 'A mother expects ___ in return for her sacrifices.',
        answer: 'nothing',
        explanation: 'The passage states "She never expects anything in return."'
      }
    ]
  }
};

/**
 * Combined database for easy lookup
 */
export const contentDatabase = {
  ...topicsDatabase,
  ...readingsDatabase
};
