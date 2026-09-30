export const grammarLessons = {
  'gap-filling': {
    id: 'gap-filling',
    title: '1. Gap Filling with Clues / Without Clues',
    marks: 10,
    instruction: 'Use the meaning and grammar of the complete sentence to decide which word or form belongs in each gap.',
    textbook: {
      introduction: [
        'A gap-filling task asks you to complete a sentence or passage by supplying words that have been left out. These words may be articles, prepositions, verbs, connectors, or vocabulary items.',
        'The blank is not an isolated puzzle. The words around it, the meaning of the whole sentence, and the grammar of the passage all work together to point toward a suitable answer.'
      ],
      sections: [
        {
          id: 'read-for-meaning',
          heading: 'Begin with the complete idea',
          paragraphs: [
            'Read the sentence from beginning to end before choosing a word. Then read the sentence before and after it when the exercise is a passage. This gives you the context: who or what the sentence is about, what is happening, and how the ideas connect.',
            'Do not fill a blank just because one word seems familiar. First ask what kind of meaning the sentence needs: a person or thing, an action, a time, a place, a reason, or a contrast.'
          ],
          examples: [
            {
              prompt: 'She is interested ___ music.',
              answer: 'in',
              explanation: 'The phrase “interested in” is followed by the subject or activity that attracts someone.'
            },
            {
              prompt: 'He was tired, ___ he continued working.',
              answer: 'but',
              explanation: 'The second clause contrasts with the first, so a contrasting connector is needed.'
            }
          ]
        },
        {
          id: 'check-grammar',
          heading: 'Check the grammar around the blank',
          paragraphs: [
            'After identifying the likely meaning, inspect the words around the gap. A verb may need to agree with its subject. A tense may be signalled by a time expression. An article depends on the noun and its sound, while a preposition often belongs to a familiar phrase or expresses a relationship such as place, time, or direction.',
            'Read your completed sentence aloud in your mind. Check that the word fits both the meaning and the grammatical pattern.'
          ],
          examples: [
            {
              prompt: 'The sun ___ in the east.',
              answer: 'rises',
              explanation: 'The sentence states a general truth, so the simple present is used. The singular subject “sun” takes “rises”.'
            },
            {
              prompt: 'We arrived ___ the station before noon.',
              answer: 'at',
              explanation: '“At” is commonly used for arrival at a particular point or place.'
            }
          ]
        },
        {
          id: 'clues-and-context',
          heading: 'Use clues when they are provided',
          paragraphs: [
            'Some exercises provide a word bank, a clue, or a word in brackets. Treat it as a guide, not as permission to guess. You may need to change the word’s form so that it fits the sentence.',
            'Without clues, use the same process: understand the context, identify the grammatical role, and test a suitable word in the complete sentence.'
          ],
          comparison: [
            { label: 'With a clue', text: 'Use the given word or clue as a starting point, then choose the form that fits the sentence.' },
            { label: 'Without a clue', text: 'Work from context and grammar to determine what kind of word and meaning the gap requires.' }
          ]
        },
        {
          id: 'common-mistakes',
          heading: 'Common mistakes to avoid',
          paragraphs: [
            'Avoid choosing a word by looking at the blank alone. A grammatically possible word may still make the passage illogical. Also check verb tense and agreement, singular and plural forms, articles, spelling, and whether a connector expresses the intended relationship.',
            'When an answer seems right, reread the entire sentence with the word inserted. For a passage, reread the surrounding sentences as well.'
          ]
        },
        {
          id: 'exam-guidance',
          heading: 'A steady exam method',
          paragraphs: [
            'Read the full passage once for its main idea. Work through the blanks in order, using context and grammar for each one. If a blank is uncertain, leave it temporarily and continue; a later sentence may provide a useful clue. Return to it, then review every completed sentence and the passage as a whole.',
            'Leave a little time at the end to check that each answer fits the meaning, grammar, and spelling of the passage.'
          ]
        }
      ]
    },
    video: {
      sourceType: null,
      url: null,
      placeholder: 'A video lesson for Gap Filling will be added here.'
    }
  }
};