import Range from '../../src/range';

describe('Utils.Range', () => {

  describe('#constructor', () => {
    it('should instantiate correctly with expected input', () => {
      const range = new Range(1, 10);
      expect(range.lowerBound).toEqual(1);
      expect(range.upperBound).toEqual(10);
    });
    it('should instantiate correctly even if lowerBound > upperBound', () => {
      const range = new Range(10, 1);
      expect(range.lowerBound).toEqual(1);
      expect(range.upperBound).toEqual(10);
    });
    it('should fail to instantiate if lowerBound === upperBound', () => {
      expect(() => new Range(1, 1)).toThrow(/lowerBound and upperBound cannot be equal/);
    });
  });

  describe('#includes', () => {
    const range = new Range(0, 1);
    it('should find a number in a range', () => {
      expect(range.includes(Math.random())).toBe(true);
      expect(range.includes(range.lowerBound)).toBe(true);
      expect(range.includes(range.upperBound)).toBe(true);
    });
    it('should not find a number not belonging to the range', () => {
      expect(range.includes(-1)).toBe(false);
      expect(range.includes(2)).toBe(false);
      expect(range.includes(Infinity)).toBe(false);
      expect(range.includes(-Infinity)).toBe(false);
    });
  });

  describe('#toString', () => {
    const range = new Range(1, 100);
    it('should provide a text representation of the range', () => {
      expect(range.toString()).toEqual('1 ~ 100');
    });
    it('should be possible to recreate the Range from its text representation', () => {
      const rebuiltRange = Range.fromNotation(range.toString()) as Range;
      expect(rebuiltRange.lowerBound).toEqual(range.lowerBound);
      expect(rebuiltRange.upperBound).toEqual(range.upperBound);
    });
  });

  describe('#fromArray', () => {
    it('should create a Range from a numeric Array', () => {
      const range = Range.fromArray([1, 100]);
      expect(range.lowerBound).toEqual(1);
      expect(range.upperBound).toEqual(100);
    });
    it('should create a Range from a numeric Array, regardless of bound order', () => {
      const range = Range.fromArray([100, 1]);
      expect(range.lowerBound).toEqual(1);
      expect(range.upperBound).toEqual(100);
    });
    it('should fail to create a Range from an Array with less or more than 2 elements', () => {
      expect(() => Range.fromArray([1])).toThrow(/must be an Array/);
      expect(() => Range.fromArray([])).toThrow(/must be an Array/);
      expect(() => Range.fromArray([1, 34, 2])).toThrow(/must be an Array/);
    });
  });

  describe('#fromNotation', () => {
    it('should instantiate correctly Range objects for every notation type', () => {
      [',', ';', ':', '~',
      ' ,', ' ;', ' :', ' ~',
      ', ', '; ', ': ', '~ ',
      ' , ', ' ; ', ' : ', ' ~ '].forEach((delimiter) => {
        const range = Range.fromNotation(`1${delimiter}10`) as Range;
        expect(range.lowerBound).toEqual(1);
        expect(range.upperBound).toEqual(10);
      });
    });
    it('should fail if an invalid delimiter is used', () => {
      expect(() => Range.fromNotation('1$50')).toThrow(/notedRange/);
    });
    it('should fail if less or more than 2 elements are found in the string', () => {
      expect(() => Range.fromNotation('1,2,3')).toThrow(/notedRange/);
    });
  });
});
