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

  it("should have arbitrary hit points", () => {
    const creature = new Creature({ hitPoints: 100 });
    expect(creature.hitPoints.getScore()).toEqual(100);
  });

  it("should have hit points by its size", () => {
    const fineCreature = new Creature({ size: CreatureSize.Fine });
    expect(fineCreature.hitPoints.getScore()).toEqual(3);

    const diminituveCreature = new Creature({ size: CreatureSize.Diminutive });
    expect(diminituveCreature.hitPoints.getScore()).toEqual(4);

    const tinyCreature = new Creature({ size: CreatureSize.Tiny });
    expect(tinyCreature.hitPoints.getScore()).toEqual(5);

    const smallCreature = new Creature({ size: CreatureSize.Small });
    expect(smallCreature.hitPoints.getScore()).toEqual(7);

    const mediumCreature = new Creature({ size: CreatureSize.Medium });
    expect(mediumCreature.hitPoints.getScore()).toEqual(9);

    const largeCreature = new Creature({ size: CreatureSize.Large });
    expect(largeCreature.hitPoints.getScore()).toEqual(11);

    const hugeCreature = new Creature({ size: CreatureSize.Huge });
    expect(hugeCreature.hitPoints.getScore()).toEqual(13);

    const gargantuanCreature = new Creature({ size: CreatureSize.Gargantuan });
    expect(gargantuanCreature.hitPoints.getScore()).toEqual(21);

    const colossalCreature = new Creature({ size: CreatureSize.Colossal });
    expect(colossalCreature.hitPoints.getScore()).toEqual(33);
  });
});
