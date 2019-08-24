import { CreatureAlignment, CreatureSize } from "@xethya/definitions";
import { Race } from "../src/race";

describe("Race", () => {
  it("should create a race without options", () => {
    const race = new Race();
    expect(race.age).not.toBeDefined();
    expect(race.alignment).toEqual(CreatureAlignment.Neutral);
    expect(race.size).toEqual(CreatureSize.Medium);
    expect(race.languages).toEqual(["common"]);
    expect(race.speed).not.toBeDefined();
    expect(race.parentRace).not.toBeDefined();
  });
});
