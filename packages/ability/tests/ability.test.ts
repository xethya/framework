import Ability from '../src/ability';

const controlTable = [
  [[[1], -5]],
  [[[2, 3], -4]],
  [[[4, 5], -3]],
  [[[6, 7], -2]],
  [[[8, 9], -1]],
  [[[10, 11], 0]],
  [[[12, 13], 1]],
  [[[14, 15], 2]],
  [[[16, 17], 3]],
  [[[18, 19], 4]],
  [[[20, 21], 5]],
  [[[22, 23], 6]],
  [[[24, 25], 7]],
  [[[26, 27], 8]],
  [[[28, 29], 9]],
  [[[30], 10]],
];

describe('Ability', () => {
  it('should instantiate', () => {
    const ability = new Ability({ id: 'foo', score: 10 });
    expect(ability.id).toEqual('foo');
    expect(ability.score).toEqual(10);
    expect(ability.modifier).toEqual(0);
  });
  it.each(controlTable)('should calculate the modifier for case %j', (data: number[][]) => {
    const [ scores, modifier ] = data;
    scores.forEach((score) => {
      const ability = new Ability({ id: 'foo', score });
      expect(ability.modifier).toEqual(modifier);
    });
  });
});
