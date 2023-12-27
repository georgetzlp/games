export type LetterParams = {
  letter: string,
  type: 'active' |   // the current guess
        'inactive' | // future
        'correct' |
        'present' |
        'absent',
  i: number,
};
