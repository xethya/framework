import { DefaultSeeds, P, Q } from '../src/blum-blum-shub';
import BlumBlumShub from '../src/blum-blum-shub';

const p = 246721;
const q = 137181;
const seedNumber = 248165;

describe('Random.BlumBlumShub', () => {

  describe('#constructor', () => {

    it('should instantiate correctly with default parameters', () => {
      const bbs = new BlumBlumShub();
      expect(bbs.P).toEqual(P);
      expect(bbs.Q).toEqual(Q);
      expect(bbs.M).toEqual(P * Q);
      expect(DefaultSeeds).toContain(bbs.seedNumber);
    });

    it('should instantiate correctly with P assigned', () => {
      const bbs = new BlumBlumShub({ p });
      expect(bbs.P).toEqual(p);
      expect(bbs.Q).toEqual(Q);
      expect(bbs.M).toEqual(p * Q);
      expect(DefaultSeeds).toContain(bbs.seedNumber);
    });

    it('should instantiate correctly with Q assigned', () => {
      const bbs = new BlumBlumShub({ q });
      expect(bbs.P).toEqual(P);
      expect(bbs.Q).toEqual(q);
      expect(bbs.M).toEqual(P * q);
      expect(DefaultSeeds).toContain(bbs.seedNumber);
    });

    it('should instantiate correctly with seedNumber assigned', () => {
      const bbs = new BlumBlumShub({ seedNumber });
      expect(bbs.P).toEqual(P);
      expect(bbs.Q).toEqual(Q);
      expect(bbs.M).toEqual(P * Q);
      expect(bbs.seedNumber).toEqual(seedNumber);
    });

    it('should instantiate correctly with P assigned, Q skipped and seedNumber assigned', () => {
      const bbs = new BlumBlumShub({ p, seedNumber });
      expect(bbs.P).toEqual(p);
      expect(bbs.Q).toEqual(Q);
      expect(bbs.M).toEqual(p * Q);
      expect(bbs.seedNumber).toEqual(seedNumber);
    });

    it('should instantiate correctly with P assigned, Q assigned and seedNumber skipped', () => {
      const bbs = new BlumBlumShub({ p, q });
      expect(bbs.P).toEqual(p);
      expect(bbs.Q).toEqual(q);
      expect(bbs.M).toEqual(p * q);
      expect(DefaultSeeds).toContain(bbs.seedNumber);
    });

    it('should instantiate correctly with P, Q and seedNumber assigned', () => {
      const bbs = new BlumBlumShub({ p, q, seedNumber });
      expect(bbs.P).toEqual(p);
      expect(bbs.Q).toEqual(q);
      expect(bbs.M).toEqual(p * q);
      expect(bbs.seedNumber).toEqual(seedNumber);
    });

    it('should instantiate correctly with P skipped, and Q and seedNumber assigned', () => {
      const bbs = new BlumBlumShub({ q, seedNumber });
      expect(bbs.P).toEqual(P);
      expect(bbs.Q).toEqual(q);
      expect(bbs.M).toEqual(P * q);
      expect(bbs.seedNumber).toEqual(seedNumber);
    });

  });

  describe('#generateRandom', () => {
    it('should generate random numbers', () => {
      const bbs = new BlumBlumShub();
      const rolled = [];
      const distribution = { lower: 0, middle: 0, upper: 0 };
      for (let i = 0; i < 100; i += 1) {
        const randomIndex = bbs.randomIndex;
        const r = bbs.generateRandom();
        expect(r).toEqual(randomIndex * randomIndex % bbs.M / bbs.M);
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

  describe('#generateRandom', () => {
    it('should generate random integer numbers', () => {
      const bbs = new BlumBlumShub();
      const rolled = [];
      for (let i = 0; i < 100; i += 1) {
        const randomIndex = bbs.randomIndex;
        const r = bbs.generateRandomInteger();
        expect(r).toEqual(Number(Math.abs(randomIndex * randomIndex % bbs.M / bbs.M)
          .toString().replace(/\./, '')));
        rolled.push(r);
      }
    });
  });
});
