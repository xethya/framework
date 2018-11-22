import { formatThousands } from '../../src/numeric';

describe('Utils.Numeric', () => {
  describe('#formatThousands', () => {
    it('should not format a single-digit number', () => {
      expect(formatThousands(1, '.')).toEqual('1');
    });
    it('should not format a two-digit number', () => {
      expect(formatThousands(22, '.')).toEqual('22');
    });
    it('should not format a three-digit number', () => {
      expect(formatThousands(333, '.')).toEqual('333');
    });
    it('should format a four-digit number', () => {
      expect(formatThousands(4444, '.')).toEqual('4.444');
    });
    it('should format an eleven-digit number', () => {
      expect(formatThousands(12345678901, '.')).toEqual('12.345.678.901');
    });
  });
});
