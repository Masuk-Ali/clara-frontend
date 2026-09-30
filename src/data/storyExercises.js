const storyExercise = {
  id: 'story_qa',
  name: 'Story Q&A',
  type: 'story_qa',
  title: 'Question 9: Story Q&A',
  marks: 10,
  stories: [
    {
      id: 'mr-moti',
      title: 'Mr. Moti',
      author: 'Rahad Abir'
    },
    {
      id: 'purple-jar-part-1',
      title: 'The Purple Jar (Part-1)',
      author: 'Maria Edgeworth',
      storyText: 'Read the story and answer the following questions.\n\nRosamond, a little girl about seven years old, was walking with her mother in the streets of London. As she passed along she looked in at the windows of several shops, and saw a great variety of things. She wanted to stop to look at them and buy them all, without knowing their uses or even without knowing their names.\n\nAt first they stopped at a milliner’s shop. The windows of the shop were decorated with ribbons, lace and festoons of artificial flowers.\n\n“Oh, Mamma, what beautiful roses! Won’t you buy some of them?”\n\n“No, my dear.”\n\n“Why?”\n\n“Because I don’t want them. They are not real flowers.”\n\nThey went a little further and came to a jeweller’s shop. In it were a great many pretty, bright ornaments of little value, set beautifully behind the glass.\n\n“Mamma, will you buy some of these?”\n\n“Which of them, Rosamond?”\n\n“Which? I don’t know which. Look at those earrings, that necklace, those pendants! Any of them will do, they are so pretty!”\n\n“Yes, they are all pretty, but of what use would they be to me?”\n\n“I am sure, Mamma, you could find some use if you only bought them first.”\n\n“But I would rather find out the use first.”\n\nThough a little disheartened, Rosamond kept on looking at the shops and tried to persuade her mother to buy this or that.\n\n“Mamma, buckles are very useful things. Please buy some.”\n\n“I have a pair of buckles. I don’t need any now.” So saying, her mother walked on.',
      questions: [
        {
          id: 'purple-1-q1',
          question: 'What did Rosamond want to do when she saw the shop windows?',
          clue: 'Look at what she wanted to do with the things in the shops.',
          answer: 'She wanted to stop, look at the things, and buy them all, although she did not know their uses or names.'
        },
        {
          id: 'purple-1-q2',
          question: 'Why did Rosamond’s mother refuse to buy the roses?',
          clue: 'The mother explains why she does not want the roses.',
          answer: 'Her mother refused because the roses were artificial, not real flowers.'
        },
        {
          id: 'purple-1-q3',
          question: 'Which ornaments did Rosamond notice at the jeweller’s shop?',
          clue: 'Rosamond names three kinds of ornaments.',
          answer: 'She noticed earrings, a necklace, and pendants.'
        },
        {
          id: 'purple-1-q4',
          question: 'Why did Rosamond’s mother prefer to find out the use of an item before buying it?',
          clue: 'Look at the mother’s reply about usefulness.',
          answer: 'She wanted to know what an item was useful for before deciding to buy it.'
        },
        {
          id: 'purple-1-q5',
          question: 'Why did Rosamond’s mother not buy the buckles?',
          clue: 'Read the final exchange in the story.',
          answer: 'She already had a pair of buckles and did not need another pair.'
        }
      ]
    },
    { id: 'purple-jar-part-2', title: 'The Purple Jar (Part-2)', author: 'Maria Edgeworth' },
    { id: 'purple-jar-part-3', title: 'The Purple Jar (Part-3)', author: 'Maria Edgeworth' },
    { id: 'pound-of-flesh', title: 'A Pound of Flesh' },
    { id: 'three-caskets', title: 'The Three Caskets' },
    { id: 'the-trial', title: 'The Trial' }
  ]
};

export default storyExercise;