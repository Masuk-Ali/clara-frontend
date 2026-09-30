import unseenPassageMilton from './passages/unseenPassageMilton.json';

export const unseenPassages = [
  {
    ...unseenPassageMilton,
    informationTransfer: {
      ...unseenPassageMilton.informationTransfer,
      questionNumber: 4,
      marks: 5,
    },
    summaryWriting: {
      ...unseenPassageMilton.summaryWriting,
      questionNumber: 5,
      marks: 10,
    },
  },
];

const unseenPassageList = {
  id: 'unseen_passage_list',
  name: 'Unseen Passage',
  type: 'unseen_passage_list',
  passages: unseenPassages,
};

export default unseenPassageList;