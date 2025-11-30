const activities = [
  {
    id: 1,
    type: 'match-picture-to-word',
    instruction: 'Dra bildet til riktig ord',
    items: [
      { id: 'cat', image: '🐱', word: 'KATT' },
      { id: 'dog', image: '🐶', word: 'HUND' },
      { id: 'fish', image: '🐟', word: 'FISK' },
    ],
  },
  {
    id: 2,
    type: 'match-picture-to-word',
    instruction: 'Dra bildet til riktig ord',
    items: [
      { id: 'sun', image: '☀️', word: 'SOL' },
      { id: 'moon', image: '🌙', word: 'MÅNE' },
      { id: 'star', image: '⭐', word: 'STJERNE' },
    ],
  },
  {
    id: 3,
    type: 'arrange-letters',
    instruction: 'Sett bokstavene i riktig rekkefølge',
    word: 'HUND',
    shuffledLetters: ['N', 'H', 'D', 'U'],
  },
  {
    id: 4,
    type: 'arrange-letters',
    instruction: 'Sett bokstavene i riktig rekkefølge',
    word: 'KATT',
    shuffledLetters: ['T', 'K', 'A', 'T'],
  },
];

export default activities;