const educationMatchingExercise = {
  id: 'education_matching',
  name: 'Matching',
  type: 'matching',
  title: 'The Importance of Education',
  instructions: 'Drag one part from each column into the active sentence row. On a phone, tap a part and then its cell.',
  columns: {
    A: [
      { id: 'a', label: '(a)', text: 'Regular reading' },
      { id: 'b', label: '(b)', text: 'Teamwork' },
      { id: 'c', label: '(c)', text: 'Clear goals' },
      { id: 'd', label: '(d)', text: 'Careful planning' },
      { id: 'e', label: '(e)', text: 'Learning a new language' },
    ],
    B: [
      { id: 'i', label: '(i)', text: 'develops strong habits' },
      { id: 'ii', label: '(ii)', text: 'encourages cooperation' },
      { id: 'iii', label: '(iii)', text: 'provide direction' },
      { id: 'iv', label: '(iv)', text: 'makes difficult tasks manageable' },
      { id: 'v', label: '(v)', text: 'expands opportunities' },
    ],
    C: [
      { id: 'i', label: '(i)', text: 'over time.' },
      { id: 'ii', label: '(ii)', text: 'towards a shared result.' },
      { id: 'iii', label: '(iii)', text: 'during a project.' },
      { id: 'iv', label: '(iv)', text: 'for future study and work.' },
      { id: 'v', label: '(v)', text: 'when challenges arise.' },
    ],
  },
  targets: [
    { id: 'sentence-1', label: 'Sentence 1' },
    { id: 'sentence-2', label: 'Sentence 2' },
    { id: 'sentence-3', label: 'Sentence 3' },
    { id: 'sentence-4', label: 'Sentence 4' },
    { id: 'sentence-5', label: 'Sentence 5' },
  ],
  correctCombinations: {
    'sentence-1': { A: 'a', B: 'i', C: 'i' },
    'sentence-2': { A: 'b', B: 'ii', C: 'ii' },
    'sentence-3': { A: 'c', B: 'iii', C: 'v' },
    'sentence-4': { A: 'd', B: 'iv', C: 'iii' },
    'sentence-5': { A: 'e', B: 'v', C: 'iv' },
  },
};

export const matchingExercises = [educationMatchingExercise];

export const matchingExerciseList = {
  id: 'matching_exercise_list',
  name: 'Matching',
  type: 'matching_list',
  exercises: matchingExercises,
};

export default educationMatchingExercise;