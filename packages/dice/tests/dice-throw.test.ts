import DiceThrow from '../src/dice-throw';

describe('Dice.DiceThrow', () => {
  it('should instantiate with default settings', () => {
    const diceThrow = new DiceThrow();
    const result = diceThrow.roll();
    expect(result.rolls.length).toEqual(2);
    expect(result.getRollSum()).toBeLessThanOrEqual(12);
  });
  it('should instantiate with custom settings', () => {
    const diceThrow = new DiceThrow({
      diceCount: 6,
      faces: 10,
    });
    const result = diceThrow.roll();
    expect(result.rolls.length).toEqual(6);
    expect(result.getRollSum()).toBeLessThanOrEqual(60);
  });
  it('should fail to throw single-faced dice', () => {
    expect(() => new DiceThrow({ faces: 1 })).toThrow(/at least 2/);
  });
});
