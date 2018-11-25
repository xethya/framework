import { IPseudoRandomNumberGenerator } from '@xethya/random-core';
import { assert } from '@xethya/utils';
/**
 * @ignore
 */
export const N: number = 624;

/**
 * @ignore
 */
export const M: number = 397;

/**
 * @ignore
 */
export const MATRIX_A: number = 0x9908b0df;

/**
 * @ignore
 */
export const UPPER_MASK: number = 0x80000000;

/**
 * @ignore
 */
export const LOWER_MASK: number = 0x7fffffff;

/**
 * @ignore
 */
export const INIT_BY_ARRAY_SEED: number = 19650218;

export interface IMersenneTwisterAlgorithmSettings {
  seedNumber?: number;
}

export default class MersenneTwister implements IPseudoRandomNumberGenerator {
  seedNumber: number;
  MT: number[];
  MTI: number;

  /**
   * Instantiates the Mersenne-Twister generator.
   *
   * @param  {Object} settings - Configuration for the generator:
   *         - seedNumber: The number for the seed.
   */
  constructor(public settings?: IMersenneTwisterAlgorithmSettings) {
    let seedNumber;
    this.settings = settings || {};

    const seed: number = this.settings.seedNumber as number;

    if (seed) {
      seedNumber = Math.abs(seed);
    } else {
      // Try seeding with a custom algorithm.
      seedNumber = Number(new Date().getTime().toString().split('')
        .sort(() => 0.5 - Math.random()).join(''));
    }

    this.MT = new Array(N);
    this.MTI = N + 1;
    this.seedNumber = seedNumber;

    this.initializeRandomGenerator(seedNumber);
  }

  /**
   * Loads the initialization vector required for the algorithm,
   * according to a given seed.
   *
   * @public
   * @method initializeRandomGenerator
   * @memberof MersenneTwisterAlgorithm
   * @instance
   * @param  {Number} seedNumber - A seed can be any non-negative integer value.
   */
  initializeRandomGenerator(seedNumber: number) {
    let seed = Math.abs(Math.floor(seedNumber));

    this.MT[0] = seed >> 0;
    for (this.MTI = 1; this.MTI < N; this.MTI += 1) {
      seed = this.MT[this.MTI - 1] ^ (this.MT[this.MTI - 1] >> 30);
      this.MT[this.MTI] = ((((seed & 0xffff0000) >> 16) * 1812433253) << 16)
                        + ((seed & 0x0000ffff) * 1812433253)
                        + this.MTI;
      this.MT[this.MTI] = this.MT[this.MTI] >> 0;
    }
  }

  /**
   * An alternative way to load the initialization vector for the algorithm.
   *
   * @public
   * @method initializeByArray
   * @memberof MersenneTwisterAlgorithm
   * @instance
   * @param  {Array.<Number>} initKeyArray - A list of non-negative integer values.
   */
  initializeByArray(initKeyArray: number[]) {
    let i = 1;
    let j = 0;
    const keyLength = initKeyArray.length;

    assert(keyLength > 0,
      'MersenneTwister#initializeByArray: initKeyArray must be an Array of at least one non-negative number.');

    // Ensure positive, integer values.
    const initKey = initKeyArray.map((v) => Math.abs(Math.floor(v)));

    this.initializeRandomGenerator(INIT_BY_ARRAY_SEED);

    let k = N > keyLength ? N : keyLength;

    while (k > 0) {
      const s = this.MT[i - 1] ^ (this.MT[i - 1] >> 30);
      this.MT[i] = (this.MT[i] ^ (((((s & 0xffff0000) >> 16) * 1664525) << 16)
        + ((s & 0x0000ffff) * 1664525)))
        + initKey[j] + j;
      this.MT[i] = this.MT[i] >> 0;
      i += 1;
      j += 1;
      if (i >= N) {
        this.MT[0] = this.MT[N - 1];
        i = 1;
      }
      if (j >= keyLength) {
        j = 0;
      }
      k -= 1;
    }
    for (k = N - 1; k > 0; k -= 1) {
      const s = this.MT[i - 1] ^ (this.MT[i - 1] >> 30);
      this.MT[i] = (this.MT[i] ^ (((((s & 0xffff0000) >> 16) * 1566083941) << 16)
        + ((s & 0x0000ffff) * 1566083941))) - i;
      this.MT[i] = this.MT[i] >> 0;
      i += 1;
      if (i >= N) {
        this.MT[0] = this.MT[N - 1];
        i = 1;
      }
    }
    this.MT[0] = 0x80000000;
  }

  /**
   * Returns a random non-negative integer value.
   *
   * @public
   * @function generateRandomInteger
   * @memberof MersenneTwisterAlgorithm
   * @instance
   * @return {Number}
   */
  generateRandomInteger(): number {
    let y;
    const mag01 = [0x0, MATRIX_A];

    if (this.MTI >= N) {
      let kk;
      if (this.MTI === N + 1) {
        this.initializeRandomGenerator(5489);
      }
      for (kk = 0; kk < N - M; kk += 1) {
        y = (this.MT[kk] & UPPER_MASK) | (this.MT[kk + 1] & LOWER_MASK);
        this.MT[kk] = this.MT[kk + M] ^ (y >> 1) ^ mag01[y & 0x1];
      }
      while (kk < N - 1) {
        y = (this.MT[kk] & UPPER_MASK) | (this.MT[kk + 1] & LOWER_MASK);
        this.MT[kk] = this.MT[kk + M - N] ^ (y >> 1) ^ mag01[y & 0x1];
        kk += 1;
      }
      y = (this.MT[N - 1] & UPPER_MASK) | (this.MT[0] & LOWER_MASK);
      this.MT[N - 1] = this.MT[M - 1] ^ (y >> 1) ^ mag01[y & 0x1];

      this.MTI = 0;
    }

    this.MTI += 1;
    y = this.MT[this.MTI];

    y ^= (y >> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >> 18);

    return y >> 0;
  }

  /**
   * Returns a non-negative random integer value, within
   * the range of Int31.
   *
   * @public
   * @function generateRandomInteger31
   * @memberof MersenneTwisterAlgorithm
   * @instance
   * @return {Number}
   */
  generateRandomInteger31(): number {
    return this.generateRandomInteger() >> 1;
  }

  /**
   * Returns a non-negative random real number between 0 and 1.
   *
   * @public
   * @function generateRandomReal
   * @memberof MersenneTwisterAlgorithm
   * @instance
   * @return {Number}
   */
  generateRandomReal(): number {
    return this.generateRandomInteger() * (1.0 / 4294967295.0);
  }

  /**
   * Returns a non-negative random number between 0 and 1.
   *
   * @public
   * @function generateRandom
   * @memberof MersenneTwisterAlgorithm
   * @instance
   * @return {Number}
   */
  generateRandom(): number {
    return this.generateRandomInteger() * (1.0 / 4294967296.0);
  }

  /**
   * Returns a non-negative random real number between 0 and 1.
   *
   * @public
   * @function generateRandomReal3
   * @memberof MersenneTwisterAlgorithm
   * @instance
   * @return {Number}
   */
  generateRandomReal3(): number {
    return (this.generateRandomInteger() + 0.5) * (1.0 / 4294967296.0);
  }

  /**
   * Returns a non-negative random rumber with a resolution
   * of 53 bits.
   *
   * @public
   * @function generateRandomReal53BitResolution
   * @memberof MersenneTwisterAlgorithm
   * @instance
   * @return {Number}
   */
  generateRandomReal53BitResolution(): number {
    const a = this.generateRandomInteger() >> 5;
    const b = this.generateRandomInteger() >> 6;
    return (a * 671084464.0 + b) * (1.0 / 9007199254740992.0);
  }
}
