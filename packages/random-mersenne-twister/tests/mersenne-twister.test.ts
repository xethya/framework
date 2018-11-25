import { MersenneTwister, N } from '../src/mersenne-twister';

describe('Random.MersenneTwister', () => {

  it('should initialize correctly with either method', () => {
    const mt = new MersenneTwister();

    expect(mt.MT.every((num) => !isNaN(num))).toBe(true);
    expect(mt.MTI).not.toEqual(0);

    mt.initializeByArray([15, 17, 3, 58]);
    expect(mt.MT[0]).toEqual(0x80000000);
  });

  it('should initialize correctly with either method, '
    + 'with an explicitly-set undefined value', () => {
    const mt = new MersenneTwister({
      seedNumber: undefined,
    });

    expect(mt.MT.every((num) => !isNaN(num))).toBe(true);
    expect(mt.MTI).not.toEqual(0);

    mt.initializeByArray([15, 17, 3, 58]);
    expect(mt.MT[0]).toEqual(0x80000000);
  });

  it('should trim the init vector to N if it has more values than N', () => {
    const mt = new MersenneTwister();
    const numbers: number[] = [];

    for (let i: number = 0; i <= N + 10; i += 1) {
      numbers.push(i + 1);
    }

    mt.initializeByArray(numbers);
    expect(mt.MT[0]).toEqual(0x80000000);
  });

  it('should initialize correctly with a positive seed', () => {
    const mt = new MersenneTwister({ seedNumber: Math.abs(Math.floor(Math.random() * 10000)) });
    expect(mt.MT.every((num) => !isNaN(num))).toBe(true);
    expect(mt.MTI).not.toEqual(0);
  });

  it('should initialize correctly with a negative seed (it becomes Math.abs()\'ed)', () => {
    const mt = new MersenneTwister({ seedNumber: -Math.abs(Math.floor(Math.random() * 10000)) });
    expect(mt.MT.every((num) => !isNaN(num))).toBe(true);
    expect(mt.MTI).not.toEqual(0);
  });

  it('should fail to initialize correctly with an empty list', () => {
    const mt = new MersenneTwister();
    expect(() => mt.initializeByArray([])).toThrow(/initKeyArray/);
  });

  it('should allow to reinitialize the generator at any given time without '
    + 'reinstantiating, with a positive seed', () => {
    const mt = new MersenneTwister();
    expect(mt.MT.every((num) => !isNaN(num))).toBe(true);
    expect(mt.MTI).not.toEqual(0);
    const newSeed = Math.abs(Math.floor(Math.random() * 10000));
    mt.initializeRandomGenerator(newSeed);
    expect(mt.MT[0]).toEqual(newSeed >> 0);
  });

  it('should allow to reinitialize the generator at any given time without '
    + 'reinstantiating, with a negative seed', () => {
    const mt = new MersenneTwister();
    expect(mt.MT.every((num) => !isNaN(num))).toBe(true);
    expect(mt.MTI).not.toEqual(0);
    const newSeed = -Math.abs(Math.floor(Math.random() * 10000));
    mt.initializeRandomGenerator(newSeed);
    expect(mt.MT[0]).toEqual(Math.abs(newSeed) >> 0);
  });
  it('should reinitialize the generator with the 5489 magic seed if MTI = N + 1', () => {
    const mt = new MersenneTwister();
    const spy = jest.spyOn(mt, 'initializeRandomGenerator');

    mt.MTI = 625;
    mt.generateRandomInteger();

    expect(spy).toHaveBeenCalledWith(5489);
  });

  it('should generate non-negative numbers', () => {
    const mt = new MersenneTwister();
    expect(mt.generateRandomInteger31()).toBeGreaterThanOrEqual(0);
    expect(mt.generateRandomReal()).toBeGreaterThanOrEqual(0);
    expect(mt.generateRandom()).toBeGreaterThanOrEqual(0);
    expect(mt.generateRandomReal3()).toBeGreaterThanOrEqual(0);
    expect(mt.generateRandomReal53BitResolution()).toBeGreaterThanOrEqual(0);
  });

  it('should generate random numbers between 0 and 1', () => {
    const mt = new MersenneTwister();
    const randomReal = mt.generateRandomReal();
    const random = mt.generateRandom();
    const randomReal3 = mt.generateRandomReal3();

    [randomReal, random, randomReal3].forEach((num) => {
      expect(num).toBeGreaterThan(0);
      expect(num).toBeLessThan(1);
    });
  });

  it('testing distribution for generateRandom', () => {
    const mt = new MersenneTwister();
    const rolled = [];
    const distribution = { lower: 0, middle: 0, upper: 0 };
    for (let i = 0; i < 100; i += 1) {
      const r = mt.generateRandom();
      rolled.push(r);
      if (r >= 0 && r < 1 / 3) {
        distribution.lower += 1;
      } else if (r >= 1 / 3 && r < 2 / 3) {
        distribution.middle += 1;
      } else if (r > 2 / 3) {
        distribution.upper += 1;
      }
    }
    // tslint:disable-next-line:no-console
    console.log('Distribution:', distribution);
  });

  it('testing distribution for generateRandomReal', () => {
    const mt = new MersenneTwister();
    const rolled = [];
    const distribution = { lower: 0, middle: 0, upper: 0 };
    for (let i = 0; i < 100; i += 1) {
      const r = mt.generateRandomReal();
      rolled.push(r);
      if (r >= 0 && r < 1 / 3) {
        distribution.lower += 1;
      } else if (r >= 1 / 3 && r < 2 / 3) {
        distribution.middle += 1;
      } else if (r > 2 / 3) {
        distribution.upper += 1;
      }
    }
    // tslint:disable-next-line:no-console
    console.log('Distribution:', distribution);
  });

  it('testing distribution for generateRandomReal3', () => {
    const mt = new MersenneTwister();
    const rolled = [];
    const distribution = { lower: 0, middle: 0, upper: 0 };
    for (let i = 0; i < 100; i += 1) {
      const r = mt.generateRandomReal3();
      rolled.push(r);
      if (r >= 0 && r < 1 / 3) {
        distribution.lower += 1;
      } else if (r >= 1 / 3 && r < 2 / 3) {
        distribution.middle += 1;
      } else if (r > 2 / 3) {
        distribution.upper += 1;
      }
    }
    // tslint:disable-next-line:no-console
    console.log('Distribution:', distribution);
  });
});
