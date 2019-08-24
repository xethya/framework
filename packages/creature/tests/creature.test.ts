import { CreatureAlignment, CreatureSize } from "@xethya/definitions";
import { Race } from "@xethya/race";
import { Creature } from "../src/creature";

/**
 * @todo Move this regex to utils.
 * @see https://github.com/xethya/framework/issues/33
 */
const UUID_REGEX = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;

describe("Creature", () => {
  it("should instantiate a Creature without parameters", () => {
    const creature = new Creature();
    expect(creature.id).toMatch(UUID_REGEX);
    expect(creature.name).toEqual("Unknown Creature");
    expect(creature.abilities.size).toEqual(0);
    expect(creature.races.length).toEqual(0);
    expect(creature.alignment).toEqual(CreatureAlignment.Neutral);
    expect(creature.size).toEqual(CreatureSize.Medium);
  });

  it("should instantiate a Creature with alignment", () => {
    const creature = new Creature({
      alignment: CreatureAlignment.LawfulNeutral,
    });
    expect(creature.alignment).toEqual(CreatureAlignment.LawfulNeutral);
  });

  it("should instantiate a Creature with name", () => {
    const creature = new Creature({
      name: "Foo",
    });
    expect(creature.name).toEqual("Foo");
  });

  it("should instantiate a Creature with name", () => {
    const creature = new Creature({
      size: CreatureSize.Tiny,
    });
    expect(creature.size).toEqual(CreatureSize.Tiny);
  });

  it("should instantiate a Creature with a single race", () => {
    const Feline = new Race({
      size: CreatureSize.Small,
      alignment: CreatureAlignment.NeutralEvil,
    });

    const creature = new Creature({
      races: [Feline],
    });

    expect(creature.races).toEqual([Feline]);
    expect(creature.size).toEqual(Feline.size);
    expect(creature.alignment).toEqual(Feline.alignment);
  });

  /**
   * @todo Should define what it means in terms of attribute dominance
   * to support multiple races.
   *
   * @see https://github.com/xethya/framework/issues/30
   */
  it("should instantiate a Creature with multiple races", () => {
    const Feline = new Race({
      size: CreatureSize.Small,
      alignment: CreatureAlignment.NeutralEvil,
    });

    const Human = new Race({
      size: CreatureSize.Large,
      alignment: CreatureAlignment.NeutralGood,
    });

    const creature = new Creature({
      races: [Feline, Human],
    });

    expect(creature.races).toEqual([Feline, Human]);
    expect(creature.size).toEqual(CreatureSize.Medium);
    expect(creature.alignment).toEqual(CreatureAlignment.Neutral);
  });
});
