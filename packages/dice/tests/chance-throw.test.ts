import ChanceThrow from '../src/dice-throw/chance-throw';
import ChanceThrowResult from '../src/dice-throw/chance-throw-result';
import { DiceThrowTypes } from '../src/types';

describe('Dice.ChanceThrow', () => {
  it('should return any number between 1 and 100', () => {
    const chanceThrow = new ChanceThrow();
    const result = chanceThrow.roll();

    expect(result.rolledNumber).toBeGreaterThanOrEqual(1);
    expect(result.rolledNumber).toBeLessThanOrEqual(100);
  });
  it('should tag the result as failure if number <= 20', () => {
    const chanceThrow = new ChanceThrow();
    chanceThrow.roll = jest.fn(() => new ChanceThrowResult(chanceThrow.chanceRanges, 10));

    const result = chanceThrow.roll();
    expect(result.throwType).toEqual(DiceThrowTypes.FAILURE);
  });
  it('should tag the result as success if 20 < number < 90', () => {
    const chanceThrow = new ChanceThrow();
    chanceThrow.roll = jest.fn(() => new ChanceThrowResult(chanceThrow.chanceRanges, 50));

    const result = chanceThrow.roll();
    expect(result.throwType).toEqual(DiceThrowTypes.SUCCESS);
  });
  it('should tag the result as success if 90 < number < 100', () => {
    const chanceThrow = new ChanceThrow();
    chanceThrow.roll = jest.fn(() => new ChanceThrowResult(chanceThrow.chanceRanges, 97));

    const result = chanceThrow.roll();
    expect(result.throwType).toEqual(DiceThrowTypes.CRITICAL_SUCCESS);
  });
});
