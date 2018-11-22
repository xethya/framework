import assert from '../../src/assert';
import { AssertionError } from '../../src/assert/errors';

describe('Utils.assert', () => {
  it('should run silent if condition is true', () => {
    expect(() => {
      assert(true, 'Should not see me');
    }).not.toThrow(/Should not see me/);
  });
  it('should throw an AssertionError with the message if condition is false', () => {
    try {
      assert(false, 'Should see me');
    } catch (error) {
      const exception: AssertionError = error as AssertionError;
      expect(exception.message).toContain('Should see me');
    }
  });
});
