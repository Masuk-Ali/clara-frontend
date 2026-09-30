import seenPassage2 from './passages/class10/seenPassage_2.json';

export const seenPassage2Exercises = [
  {
    ...seenPassage2,
    listTitle: seenPassage2.title.replace(/^Seen Passage 2:\s*/, ''),
  },
];

const seenPassage2List = {
  id: 'seen_passage_2_list',
  name: 'Seen Passage 2',
  type: 'seen_passage_2_list',
  passages: seenPassage2Exercises,
};

export default seenPassage2List;