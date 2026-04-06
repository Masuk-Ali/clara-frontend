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
                explanations: {
                  0: "Introduction to Bangladesh's history.",
                  1: "Cultural influences from different periods.",
                  2: "Historical empires that shaped the region.",
                  3: "The independence struggle in 1971.",
                  4: "Current status as a developing nation."
                },
                questions: [
                  {
                    type: "mcq",
                    question: "When did Bangladesh gain independence?",
                    options: ["1947", "1952", "1971", "1980"],
                    correct: 2
                  },
                  {
                    type: "short",
                    question: "Name one empire that influenced Bangladesh.",
                    answer: "Mughal Empire"
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