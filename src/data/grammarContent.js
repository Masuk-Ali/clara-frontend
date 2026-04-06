export const grammarContent = {
  "Tense": {
    title: "Mastering English Tenses",
    description: "Tenses are the backbone of English grammar. Understanding them helps you express time relationships clearly and accurately.",
    difficulty: "intermediate",

    rules: [
      "Present Simple: Used for habits, facts, and general truths (I eat breakfast daily)",
      "Past Simple: Used for completed actions in the past (I ate breakfast yesterday)",
      "Future Simple: Used for future plans and predictions (I will eat breakfast tomorrow)",
      "Present Continuous: Used for ongoing actions (I am eating breakfast now)",
      "Past Continuous: Used for ongoing actions in the past (I was eating breakfast when you called)",
      "Future Continuous: Used for ongoing future actions (I will be eating breakfast at 8 AM)"
    ],

    examples: [
      {
        sentence: "She walks to school every day.",
        note: "Present Simple - Habit",
        explanation: "This shows a regular, repeated action. The subject 'she' performs the action 'walks' regularly.",
        tips: ["Use base form of verb", "Add -s for he/she/it", "No auxiliary needed"]
      },
      {
        sentence: "They played football yesterday.",
        note: "Past Simple - Completed Action",
        explanation: "This describes an action that started and finished in the past. The time marker 'yesterday' confirms it's completed.",
        tips: ["Add -ed to regular verbs", "Use irregular verb forms", "Don't use auxiliary"]
      },
      {
        sentence: "I will visit my grandmother next week.",
        note: "Future Simple - Future Plan",
        explanation: "This expresses a future intention or plan. 'Will' + base verb is the most common future form.",
        tips: ["Will + base verb", "Use for spontaneous decisions", "Use for predictions"]
      }
    ],

    practice: [
      {
        type: "fill_blank",
        prompt: "Complete: She ___ (go) to college every year.",
        answer: "goes",
        explanation: "Present simple tense for habitual actions. Add -s to the base verb 'go' for third person singular.",
        hint: "Think about daily routines or habits."
      },
      {
        type: "multiple_choice",
        question: "Which tense is used in: 'I am studying English now'?",
        options: ["Present Simple", "Present Continuous", "Past Simple", "Future Simple"],
        correctAnswer: 1,
        explanation: "Present Continuous uses 'am/is/are + verb-ing' for actions happening right now."
      },
      {
        type: "sentence_correction",
        incorrect: "I go to school yesterday.",
        correct: "I went to school yesterday.",
        explanation: "Use Past Simple for completed actions in the past."
      }
    ],

    quiz: [
      {
        question: "Choose the correct form: 'She ___ (read) a book every night.'",
        options: ["read", "reads", "reading", "readed"],
        correctAnswer: 1,
        explanation: "Present Simple: 'reads' for third person singular habit."
      },
      {
        question: "Which sentence is in Past Continuous?",
        options: [
          "I eat dinner.",
          "I ate dinner.",
          "I was eating dinner.",
          "I will eat dinner."
        ],
        correctAnswer: 2,
        explanation: "Past Continuous: 'was/were + verb-ing' for ongoing past actions."
      },
      {
        question: "Complete: 'They ___ (play) football when it started raining.'",
        options: ["play", "played", "were playing", "will play"],
        correctAnswer: 2,
        explanation: "Past Continuous for ongoing action interrupted by another past action."
      }
    ]
  },

  "Nouns": {
    title: "Understanding Nouns",
    description: "Nouns are naming words that identify people, places, things, and ideas. They form the foundation of English sentences.",
    difficulty: "beginner",

    rules: [
      "Common Nouns: General names (book, city, teacher)",
      "Proper Nouns: Specific names (London, Shakespeare, Monday) - Always capitalized",
      "Countable Nouns: Can be counted (one book, two books)",
      "Uncountable Nouns: Cannot be counted (water, music, information)",
      "Abstract Nouns: Ideas and concepts (love, happiness, freedom)",
      "Concrete Nouns: Physical objects (table, car, flower)"
    ],

    examples: [
      {
        sentence: "The teacher explained the lesson clearly.",
        note: "Common nouns in context",
        explanation: "'Teacher' and 'lesson' are common nouns naming general things.",
        tips: ["Not capitalized", "Can be plural", "General names"]
      },
      {
        sentence: "Shakespeare wrote Romeo and Juliet.",
        note: "Proper nouns",
        explanation: "'Shakespeare' and 'Romeo and Juliet' are specific names, so they are capitalized.",
        tips: ["Always capitalized", "Specific names", "Unique identifiers"]
      }
    ],

    practice: [
      {
        type: "classification",
        prompt: "Classify these words as Common or Proper nouns: London, book, teacher, Monday",
        answer: "London (Proper), book (Common), teacher (Common), Monday (Proper)",
        explanation: "Proper nouns are specific names and are capitalized. Common nouns are general names."
      },
      {
        type: "fill_blank",
        prompt: "Complete: ___ is the capital of Bangladesh. (Use proper noun)",
        answer: "Dhaka",
        explanation: "Capital cities are proper nouns and must be capitalized."
      }
    ],

    quiz: [
      {
        question: "Which word is a proper noun?",
        options: ["book", "Dhaka", "teacher", "school"],
        correctAnswer: 1,
        explanation: "'Dhaka' is the name of a specific city, so it's a proper noun."
      },
      {
        question: "Which is NOT a countable noun?",
        options: ["book", "water", "pen", "table"],
        correctAnswer: 1,
        explanation: "'Water' is an uncountable noun - you can't say 'one water' or 'two waters'."
      }
    ]
  },

  "Verbs": {
    title: "Action Words: Verbs",
    description: "Verbs are action or state words that drive the sentence. They express what the subject does or is.",
    difficulty: "beginner",

    rules: [
      "Action Verbs: Express physical or mental actions (run, think, eat)",
      "State Verbs: Express states or conditions (be, have, seem)",
      "Transitive Verbs: Take direct objects (I ate an apple)",
      "Intransitive Verbs: Don't take direct objects (I sleep)",
      "Regular Verbs: Add -ed in past (walk → walked)",
      "Irregular Verbs: Change form in past (go → went)"
    ],

    examples: [
      {
        sentence: "She runs every morning.",
        note: "Action verb",
        explanation: "'Runs' shows physical action performed by the subject.",
        tips: ["Shows what someone does", "Can be past/present/future", "Main action of sentence"]
      },
      {
        sentence: "He seems happy today.",
        note: "State verb",
        explanation: "'Seems' expresses a state or condition, not an action.",
        tips: ["Shows condition/state", "Often not used in continuous", "Mental states"]
      }
    ],

    practice: [
      {
        type: "identification",
        prompt: "Identify the verbs in: 'The students study English every day.'",
        answer: "study",
        explanation: "'Study' is the main verb showing the action the students perform."
      },
      {
        type: "multiple_choice",
        question: "Which verb is irregular?",
        options: ["play → played", "go → went", "clean → cleaned", "help → helped"],
        correctAnswer: 1,
        explanation: "'Go' changes to 'went' in past tense, not 'goed'."
      }
    ],

    quiz: [
      {
        question: "Which sentence has a transitive verb?",
        options: [
          "She sleeps.",
          "He runs fast.",
          "I ate an apple.",
          "They arrived."
        ],
        correctAnswer: 2,
        explanation: "'Ate' takes a direct object 'an apple', making it transitive."
      }
    ]
  },

  "Adjectives": {
    title: "Descriptive Words: Adjectives",
    description: "Adjectives describe or modify nouns and pronouns, adding detail and color to your writing.",
    difficulty: "beginner",

    rules: [
      "Descriptive Adjectives: Describe qualities (big, red, happy)",
      "Quantitative Adjectives: Show quantity (some, many, few)",
      "Demonstrative Adjectives: Point out (this, that, these, those)",
      "Possessive Adjectives: Show ownership (my, your, his, her)",
      "Comparative: Compare two things (bigger, happier)",
      "Superlative: Compare more than two (biggest, happiest)"
    ],

    examples: [
      {
        sentence: "The beautiful garden was full of colorful flowers.",
        note: "Descriptive adjectives",
        explanation: "'Beautiful' describes the garden, 'colorful' describes the flowers.",
        tips: ["Come before nouns", "Answer 'what kind?'", "Can be comparative/superlative"]
      },
      {
        sentence: "This is my favorite book.",
        note: "Possessive and demonstrative",
        explanation: "'My' shows ownership, 'favorite' shows preference, 'this' points out.",
        tips: ["Possessive: my/your/his/her", "Demonstrative: this/that/these/those"]
      }
    ],

    practice: [
      {
        type: "ordering",
        prompt: "Put adjectives in correct order: house / wooden / old / beautiful",
        answer: "beautiful old wooden house",
        explanation: "Opinion adjectives come first, then age, then material."
      },
      {
        type: "fill_blank",
        prompt: "Complete: The elephant is ___ than the mouse. (big)",
        answer: "bigger",
        explanation: "Comparative form for comparing two things: add -er to short adjectives."
      }
    ],

    quiz: [
      {
        question: "Choose the correct comparative: 'My house is ___ than yours.'",
        options: ["big", "bigger", "biggest", "more big"],
        correctAnswer: 1,
        explanation: "For short adjectives, add -er: big → bigger."
      },
      {
        question: "Which is a demonstrative adjective?",
        options: ["beautiful", "my", "this", "many"],
        correctAnswer: 2,
        explanation: "'This' points out a specific noun and acts as an adjective."
      }
    ]
  }
};