export const educationData = [
  {
    id: "primary",
    name: "Primary (Classes 6-8)",
    classes: [
      {
        id: "6",
        name: "Class 6",
        level: "primary",
        courses: [
          {
            id: "eng1",
            name: "English First Paper",
            type: "reading",
            topics: ["Story 1", "Story 2", "Poem 1", "Poem 2"],
          },
          {
            id: "eng2",
            name: "English Second Paper",
            type: "grammar",
            topics: ["Nouns", "Verbs", "Adjectives", "Tenses"],
          },
        ],
      },
      {
        id: "7",
        name: "Class 7",
        level: "primary",
        courses: [
          {
            id: "eng1",
            name: "English First Paper",
            type: "reading",
            topics: ["Story 1", "Story 2", "Poem 1", "Poem 2"],
          },
          {
            id: "eng2",
            name: "English Second Paper",
            type: "grammar",
            topics: ["Nouns", "Verbs", "Adjectives", "Tenses"],
          },
        ],
      },
      {
        id: "8",
        name: "Class 8",
        level: "primary",
        courses: [
          {
            id: "eng1",
            name: "English First Paper",
            type: "reading",
            topics: ["Story 1", "Story 2", "Poem 1", "Poem 2"],
          },
          {
            id: "eng2",
            name: "English Second Paper",
            type: "grammar",
            topics: ["Nouns", "Verbs", "Adjectives", "Tenses"],
          },
        ],
      },
    ],
  },
  {
    id: "secondary",
    name: "Secondary (Class 9-10)",
    classes: [
      {
        id: "9",
        name: "Class 9",
        level: "secondary",
        courses: [
          {
            id: "eng1",
            name: "English First Paper",
            type: "reading",
            topics: [
              {
                name: "Seen Passage 1",
                passage: "The history of Bangladesh is rich and diverse. From ancient times, the region has been influenced by various cultures. The Bengal Sultanate and Mughal Empire left lasting impacts. In 1971, Bangladesh gained independence through a liberation war. Today, it is a developing nation with a growing economy and vibrant culture.",
                bengaliTranslation: "বাংলাদেশের ইতিহাস সমৃদ্ধ এবং বৈচিত্র্যপূর্ণ। প্রাচীনকাল থেকে, এই অঞ্চলটি বিভিন্ন সংস্কৃতির দ্বারা প্রভাবিত হয়েছে। বাংলা সুলতানাত এবং মুঘল সাম্রাজ্য স্থায়ী প্রভাব ফেলেছে। ১৯৭১ সালে, বাংলাদেশ একটি মুক্তিযুদ্ধের মাধ্যমে স্বাধীনতা লাভ করে। আজ, এটি একটি উন্নয়নশীল দেশ যেখানে ক্রমবর্ধমান অর্থনীতি এবং প্রাণবন্ত সংস্কৃতি রয়েছে।",
                wordData: {
                  "history": {
                    english: "the study of past events, particularly in human affairs",
                    bengali: "ইতিহাস",
                    pronunciation: "/ˈhɪstəri/",
                    example: "The history of ancient Rome fascinates many scholars.",
                    saved: false
                  },
                  "diverse": {
                    english: "showing a great deal of variety; very different",
                    bengali: "বৈচিত্র্যপূর্ণ",
                    pronunciation: "/daɪˈvɜːrs/",
                    example: "The city has a diverse population from many countries.",
                    saved: false
                  },
                  "influenced": {
                    english: "have an effect on the way someone or something develops",
                    bengali: "প্রভাবিত",
                    pronunciation: "/ˈɪnfluənst/",
                    example: "Her teacher greatly influenced her career choice.",
                    saved: false
                  },
                  "independence": {
                    english: "the state of being free from outside control",
                    bengali: "স্বাধীনতা",
                    pronunciation: "/ˌɪndɪˈpendəns/",
                    example: "The country celebrated its independence day with fireworks.",
                    saved: false
                  },
                  "vibrant": {
                    english: "full of energy and life",
                    bengali: "প্রাণবন্ত",
                    pronunciation: "/ˈvaɪbrənt/",
                    example: "The vibrant colors of the sunset amazed everyone.",
                    saved: false
                  }
                },
                sentenceExplanations: {
                  0: {
                    bengali: "বাংলাদেশের ইতিহাস সমৃদ্ধ এবং বৈচিত্র্যপূর্ণ।",
                    grammar: "Subject-verb agreement: 'history' (singular) takes 'is' (singular verb). Adjective 'rich and diverse' describes the noun 'history'."
                  },
                  1: {
                    bengali: "প্রাচীনকাল থেকে, এই অঞ্চলটি বিভিন্ন সংস্কৃতির দ্বারা প্রভাবিত হয়েছে।",
                    grammar: "Present perfect tense: 'has been influenced' shows an action that started in the past and continues. Passive voice construction."
                  },
                  2: {
                    bengali: "বাংলা সুলতানাত এবং মুঘল সাম্রাজ্য স্থায়ী প্রভাব ফেলেছে।",
                    grammar: "Compound subject: 'Sultanate and Empire' connected by 'and'. Past tense 'left' indicates completed action."
                  },
                  3: {
                    bengali: "১৯৭১ সালে, বাংলাদেশ একটি মুক্তিযুদ্ধের মাধ্যমে স্বাধীনতা লাভ করে।",
                    grammar: "Prepositional phrase 'through a liberation war' shows means. Past tense 'gained' for completed historical event."
                  },
                  4: {
                    bengali: "আজ, এটি একটি উন্নয়নশীল দেশ যেখানে ক্রমবর্ধমান অর্থনীতি এবং প্রাণবন্ত সংস্কৃতি রয়েছে।",
                    grammar: "Relative clause 'where...culture' modifies 'nation'. Present continuous 'growing' and 'vibrant' describe current state."
                  }
                },
                questions: [
                  {
                    type: "mcq",
                    question: "What is the main topic of the passage?",
                    options: ["Geography of Bangladesh", "History of Bangladesh", "Economy of Bangladesh", "Culture of Bangladesh"],
                    correct: 1,
                    explanation: "The passage discusses the historical development, cultural influences, and independence of Bangladesh."
                  },
                  {
                    type: "short",
                    question: "When did Bangladesh gain independence?",
                    answer: "1971",
                    explanation: "The passage states: 'In 1971, Bangladesh gained independence through a liberation war.'"
                  },
                  {
                    type: "fill_blank_no_clue",
                    question: "The history of Bangladesh is rich and ______.",
                    answer: "diverse",
                    explanation: "'Diverse' means showing variety, which fits the context of Bangladesh having different cultural influences."
                  },
                  {
                    type: "fill_blank_with_clue",
                    question: "Complete the sentence: 'From ancient times, the region has been ______ by various cultures.'",
                    clue: "influenced",
                    words: ["influenced", "affected", "changed", "modified"],
                    answer: "influenced",
                    explanation: "'Influenced' means to have an effect on development, which matches the historical context."
                  },
                  {
                    type: "matching",
                    question: "Match the empires with their descriptions:",
                    pairs: [
                      { left: "Bengal Sultanate", right: "Left lasting impacts on the region" },
                      { left: "Mughal Empire", right: "Left lasting impacts on the region" }
                    ],
                    explanation: "Both the Bengal Sultanate and Mughal Empire are mentioned as having left lasting impacts on Bangladesh's history."
                  },
                  {
                    type: "rearrangement",
                    question: "Rearrange the sentences to form a logical paragraph:",
                    sentences: [
                      "In 1971, Bangladesh gained independence through a liberation war.",
                      "The history of Bangladesh is rich and diverse.",
                      "From ancient times, the region has been influenced by various cultures.",
                      "Today, it is a developing nation with a growing economy and vibrant culture.",
                      "The Bengal Sultanate and Mughal Empire left lasting impacts."
                    ],
                    correctOrder: [1, 2, 4, 0, 3],
                    explanation: "The logical flow starts with the general statement about history, then chronological development, empires, independence, and current status."
                  }
                ]
              },
              "Seen Passage 2",
              "Drama 1",
              "Drama 2"
            ],
          },
          {
            id: "eng2",
            name: "English Second Paper",
            type: "grammar",
            topics: ["Tense", "Voice", "Narration", "Transformation"],
          },
        ],
      },
      {
        id: "10",
        name: "Class 10 (SSC)",
        level: "secondary",
        courses: [
          {
            id: "eng1",
            name: "English First Paper",
            type: "reading",
            topics: ["Seen Passage 1", "Seen Passage 2", "Drama 1", "Drama 2"],
          },
          {
            id: "eng2",
            name: "English Second Paper",
            type: "grammar",
            topics: ["Tense", "Voice", "Narration", "Transformation"],
          },
        ],
      },
    ],
  },
  {
    id: "higher",
    name: "Higher Secondary (Class 11-12)",
    classes: [
      {
        id: "11",
        name: "Class 11",
        level: "higher",
        courses: [
          {
            id: "eng1",
            name: "English First Paper",
            type: "reading",
            topics: ["Unseen Passage 1", "Unseen Passage 2", "Novel 1", "Novel 2"],
          },
          {
            id: "eng2",
            name: "English Second Paper",
            type: "grammar",
            topics: ["Tense", "Voice", "Narration", "Clause Analysis"],
          },
        ],
      },
      {
        id: "12",
        name: "Class 12 (HSC)",
        level: "higher",
        courses: [
          {
            id: "eng1",
            name: "English First Paper",
            type: "reading",
            topics: ["Unseen Passage 1", "Unseen Passage 2", "Novel 1", "Novel 2"],
          },
          {
            id: "eng2",
            name: "English Second Paper",
            type: "grammar",
            topics: ["Tense", "Voice", "Narration", "Clause Analysis"],
          },
        ],
      },
    ],
  },
];

export const classesData = educationData.flatMap(edu => edu.classes);