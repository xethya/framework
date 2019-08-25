import { Point } from "../src/point";

describe("Point", () => {
  let healthPoints: Point;

  beforeEach(() => {
    healthPoints = new Point({
      name: "Health Points",
      unit: "HP",
      initialScore: 100,
      minimumScore: 0,
      maximumScore: 150,
    });
  });

  it("can be instantiated", () => {
    expect(healthPoints.name).toEqual("Health Points");
    expect(healthPoints.unit).toEqual("HP");
    expect(healthPoints.initialScore).toEqual(100);
    expect(healthPoints.range.lowerBound).toEqual(0);
    expect(healthPoints.range.upperBound).toEqual(150);
    expect(healthPoints.score).toEqual(100);
  });

  it("can't be affected with a negative number", () => {
    expect(() => healthPoints.boostPermanentlyBy(-10, "I'm crazy")).toThrow(/greater than zero/);
    expect(() => healthPoints.dropPermanentlyBy(-10, "I'm crazy")).toThrow(/greater than zero/);
    expect(() => healthPoints.boostTemporarilyBy(-10, "I'm crazy")).toThrow(/greater than zero/);
    expect(() => healthPoints.dropTemporarilyBy(-10, "I'm crazy")).toThrow(/greater than zero/);
  });

  it("can't be affected with zero", () => {
    expect(() => healthPoints.boostPermanentlyBy(0, "I'm crazy")).toThrow(/greater than zero/);
    expect(() => healthPoints.dropPermanentlyBy(0, "I'm crazy")).toThrow(/greater than zero/);
    expect(() => healthPoints.boostTemporarilyBy(0, "I'm crazy")).toThrow(/greater than zero/);
    expect(() => healthPoints.dropTemporarilyBy(0, "I'm crazy")).toThrow(/greater than zero/);
  });

  it("can be boosted permanently", () => {
    healthPoints.boostPermanentlyBy(10);
    expect(healthPoints.score).toEqual(110);
  });

  it("can be boosted temporarily", () => {
    const boost = healthPoints.boostTemporarilyBy(10);
    expect(healthPoints.score).toEqual(110);

    healthPoints.revertTemporaryEffect(boost);
    expect(healthPoints.score).toEqual(100);
  });

  it("can be dropped permanently", () => {
    healthPoints.dropPermanentlyBy(10);
    expect(healthPoints.score).toEqual(90);
  });

  it("can be dropped temporarily", () => {
    const drop = healthPoints.dropTemporarilyBy(10);
    expect(healthPoints.score).toEqual(90);

    healthPoints.revertTemporaryEffect(drop);
    expect(healthPoints.score).toEqual(100);
  });

  it("can have a million modifiers", () => {
    for (let i = 0; i < 1000000; i += 1) {
      if (i % 2 === 0) {
        healthPoints.boostPermanentlyBy(0.2);
      } else {
        healthPoints.dropTemporarilyBy(0.2);
      }
    }
    expect(healthPoints.score).toEqual(100);
  });
});
