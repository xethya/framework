import Die from '../src/die';
import * as PresetDice from '../src/presets';

describe('Dice.Die', () => {
  it('should roll a number within the die\'s range', () => {
    const die = new Die(6);
    expect(die.faces).toEqual(6);
    const rolledNumber = die.roll();
    expect(rolledNumber).toBeGreaterThanOrEqual(1);
    expect(rolledNumber).toBeLessThanOrEqual(6);
  });

  it('should trigger events when rolling', () => {
    const beforeRollSpy = jest.fn();
    const rollSpy = jest.fn();
    const nextRollSpy = jest.fn();

    const die = new Die(6);
    die.onBeforeRoll(beforeRollSpy);
    die.onRoll(rollSpy);
    die.onNextRoll(nextRollSpy);

    let result = die.roll();

    expect(beforeRollSpy).toHaveBeenCalled();
    expect(rollSpy).toHaveBeenCalledWith(result);

    result = die.roll();

    expect(nextRollSpy).toHaveBeenCalledTimes(1);
  });

  it('should roll a dice with the static invocation', () => {
    const rolledNumber = Die.rollD(6);
    expect(rolledNumber).toBeGreaterThanOrEqual(1);
    expect(rolledNumber).toBeLessThanOrEqual(6);
  });

  describe('Presets', () => {
    it('should instantiate a CoinFlip and roll either 1 or 2', () => {
      const coinFlip = new PresetDice.CoinFlip();
      expect(coinFlip.faces).toEqual(2);

      const rolledNumber = coinFlip.roll();
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(2);
    });
    it('should instantiate a D4 and roll within the range 1-4', () => {
      const die = new PresetDice.D4();
      expect(die.faces).toEqual(4);
      const rolledNumber = die.roll();
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(4);
    });
    it('should instantiate a D6 and roll within the range 1-6', () => {
      const die = new PresetDice.D6();
      expect(die.faces).toEqual(6);
      const rolledNumber = die.roll();
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(6);
    });
    it('should instantiate a D8 and roll within the range 1-8', () => {
      const die = new PresetDice.D8();
      expect(die.faces).toEqual(8);
      const rolledNumber = die.roll();
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(8);
    });
    it('should instantiate a D10 and roll within the range 1-10', () => {
      const die = new PresetDice.D10();
      expect(die.faces).toEqual(10);
      const rolledNumber = die.roll();
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(10);
    });
    it('should instantiate a D12 and roll within the range 1-12', () => {
      const die = new PresetDice.D12();
      expect(die.faces).toEqual(12);
      const rolledNumber = die.roll();
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(12);
    });
    it('should instantiate a D20 and roll within the range 1-20', () => {
      const die = new PresetDice.D20();
      expect(die.faces).toEqual(20);
      const rolledNumber = die.roll();
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(20);
    });
    it('should instantiate a D100 and roll within the range 1-100', () => {
      const die = new PresetDice.D100();
      expect(die.faces).toEqual(100);
      const rolledNumber = die.roll();
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(100);
    });
  });
});
