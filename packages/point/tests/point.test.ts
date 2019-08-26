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
    expect(healthPoints.getScore()).toEqual(100);
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
    expect(healthPoints.getScore()).toEqual(110);
  });

  it("can be boosted temporarily", () => {
    const boost = healthPoints.boostTemporarilyBy(10);
    expect(healthPoints.getScore()).toEqual(110);

    healthPoints.revertTemporaryEffect(boost);
    expect(healthPoints.getScore()).toEqual(100);
  });

  it("can be dropped permanently", () => {
    healthPoints.dropPermanentlyBy(10);
    expect(healthPoints.getScore()).toEqual(90);
  });

  it("can be dropped temporarily", () => {
    const drop = healthPoints.dropTemporarilyBy(10);
    expect(healthPoints.getScore()).toEqual(90);

    healthPoints.revertTemporaryEffect(drop);
    expect(healthPoints.getScore()).toEqual(100);
  });

  it("can't be affected by out of range boosts/drops", () => {
    expect(() => healthPoints.boostPermanentlyBy(110, "I'm crazy")).toThrow(/out of the range/);
    expect(() => healthPoints.dropPermanentlyBy(110, "I'm crazy")).toThrow(/out of the range/);
    expect(() => healthPoints.boostTemporarilyBy(110, "I'm crazy")).toThrow(/out of the range/);
    expect(() => healthPoints.dropTemporarilyBy(110, "I'm crazy")).toThrow(/out of the range/);
  });

  it("can be printed as a string", () => {
    /**
     * @todo This shouldn't be possible.
     * @see https://github.com/xethya/framework/issues/43
     */
    healthPoints.range.upperBound = 1000;
    healthPoints.boostPermanentlyBy(900);

    expect(healthPoints.toString()).toEqual("1.000 HP");
    expect(healthPoints.toString({ showUnit: false })).toEqual("1.000");
    expect(healthPoints.toString({ showUnit: false, formatScoreInThousands: false })).toEqual("1000");
    expect(healthPoints.toString({ thousandSeparator: "," })).toEqual("1,000 HP");
  });

  it("can be calculated with external dependencies", () => {
    let foo = 30;
    const boostWithFoo = () => foo / 2;

    healthPoints.addCalculation(boostWithFoo);

    expect(healthPoints.getScore()).toEqual(115);

    foo = 50;
    expect(healthPoints.getScore()).toEqual(125);
  });

  it("can't overflow the range with calculations", () => {
    const foo = 200;
    const dropWithFoo = () => -foo;

    healthPoints.addCalculation(dropWithFoo);
    expect(() => healthPoints.getScore()).toThrow(/exceeds score range/);
  });

  it("can return the score without calculations", () => {
    const foo = 30;
    const boostWithFoo = () => foo / 2;

    healthPoints.addCalculation(boostWithFoo);

    expect(healthPoints.getScore()).toEqual(115);
    expect(healthPoints.getLastScore()).toEqual(100);
  });
});
