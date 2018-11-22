import { reducers } from '../../src/array';

describe('Utils.Reducers', () => {
  describe('#bySum', () => {
    const sampleData = [1, 2, 3, 4, 5, 6];

    it('should left-reduce a numeric array by sum', () => {
      expect(sampleData.reduce(reducers.bySum)).toEqual(21);
    });
    it('should right-reduce a numeric array by sum', () => {
      expect(sampleData.reduceRight(reducers.bySum)).toEqual(21);
    });
  });
});
