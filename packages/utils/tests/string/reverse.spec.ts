import { reverse } from '../../src/string';

describe('Utils.String', () => {
  describe('#reverse', () => {
    it('should reverse a string value "abc" to "cba"', () => {
      expect(reverse('abc')).toEqual('cba');
    });
  });
});
