import { CreatureAlignment, CreatureSize } from "@xethya/definitions";
import { Race } from "../src/race";

describe("Race", () => {
  it("should create a race without options", () => {
    const race = new Race();
    expect(race.age).not.toBeDefined();
    expect(race.alignment).toEqual(CreatureAlignment.Neutral);
    expect(race.size).toEqual(CreatureSize.Medium);
    expect(race.languages).toEqual([]);
    expect(race.speed).not.toBeDefined();
    expect(race.parentRace).not.toBeDefined();
  });

  it("should create a race with age", () => {
    const race = new Race({
      age: 120,
    });
    expect(race.age).toEqual(120);
  });

  it("should create a race with alignment", () => {
    const race = new Race({
      alignment: CreatureAlignment.LawfulEvil,
    });
    expect(race.alignment).toEqual(CreatureAlignment.LawfulEvil);
  });

  it("should create a race with alignment", () => {
    const race = new Race({
      size: CreatureSize.Colossal,
    });
    expect(race.size).toEqual(CreatureSize.Colossal);
  });

  it("should create a race with languages", () => {
    const race = new Race({
      languages: ["vulcan", "klingon"],
    });
    expect(race.languages).toEqual(["vulcan", "klingon"]);
  });

  it("should create a race with speed", () => {
    const race = new Race({
      speed: 5,
    });
    expect(race.speed).toEqual(5);
  });

  it("should create a race with a parent race and combine the inherited traits", () => {
    const ancestralRace = new Race({
      languages: ["latin"],
    });

    const race = new Race({
      languages: ["english"],
      parentRace: ancestralRace,
    });

    expect(race.languages).toEqual(["latin", "english"]);
    expect(race.parentRace).toEqual(ancestralRace);
  });
});
