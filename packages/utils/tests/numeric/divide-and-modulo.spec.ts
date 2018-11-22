import { divideAndModulo } from '../../src/numeric';

describe('Utils.Numeric', () => {
  describe('#divideAndModulo', () => {
    it('should always return positive values', () => {
      expect(divideAndModulo(-10, -2)).toEqual({
        remainder: 0,
        result: 5,
      });
    });
    it('should return { remainder: 0 } for integer divisions', () => {
      expect(divideAndModulo(10, 2)).toEqual({
        remainder: 0,
        result: 5,
      });
      expect(divideAndModulo(-10, 2)).toEqual({
        remainder: 0,
        result: 5,
      });
    });
    it('should return { remainder > 0 } for decimal divisions', () => {
      expect(divideAndModulo(11, 2)).toEqual({
        remainder: 1,
        result: 5,
      });
      expect(divideAndModulo(-11, 2)).toEqual({
        remainder: 1,
        result: 5,
      });
    });
  });
});
