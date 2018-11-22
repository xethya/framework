import { mappers } from '../../src/array';

describe('Utils.Mappers', () => {
  describe('#byKey', () => {
    const list = [
      { id: 'foo', name: 'Foo' },
      { id: 'bar', name: 'Bar' },
    ];
    it('should map an array by an attribute', () => {
      expect(list.map(mappers.byKey('name'))).toEqual(['Foo', 'Bar']);
    });
  });
});
