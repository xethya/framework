import { shuffle } from '../../src/array';

const arrayOfNumbers = [10, 10, 3, 3, -5, 9, 2, 14, 1, 0, 0, -58, 13, 2, 8, 8];

describe('Utils.Shuffle', () => {
  it('should shuffle an array', () => {
    const shuffledArrayOfNumbers = shuffle(arrayOfNumbers);

    expect(arrayOfNumbers.every((num) => shuffledArrayOfNumbers.includes(num))).toBe(true);
    expect(arrayOfNumbers).not.toEqual(shuffledArrayOfNumbers);
  });
  it('should not appear to alter order for same elements', () => {
    const elements = [0, 0, 0, 0];
    expect(shuffle(elements)).toEqual(elements);
  });
});
