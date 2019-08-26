import Ability from "@xethya/ability";
import { CreatureAlignment, CreatureSize } from "@xethya/definitions";
import { Point } from "@xethya/point";
import { Race } from "@xethya/race";
import { v4 as generateUUID } from "uuid";

export type CreatureOptions = {
  /**
   * Describes to which races this creature belongs.
   */
  races?: Race[];

  /**
   * Specifies the creature's size.
   */
  size?: CreatureSize;

  /**
   * Determines the creature's morality and attitude towards society and order.
   */
  alignment?: CreatureAlignment;

  /**
   * A common denomination for the creature.
   */
  name?: string;

  /**
   * The maximum hit points the creature will have.
   */
  hitPoints?: number;

  /**
   * Binds an ability modifier to the hit points calculation.
   */
  abilityForHitPoints?: Ability;
};

/**
 * Specifies an amount of hit points for each defined CreatureSize.
 *
 * @see https://www.dandwiki.com/wiki/5e_SRD:Creatures#Hit_Points_by_Size
 */
const sizeToHitPoints: { [key in CreatureSize]: number } = {
  [CreatureSize.Fine]: 3,
  [CreatureSize.Diminutive]: 4,
  [CreatureSize.Tiny]: 5,
  [CreatureSize.Small]: 7,
  [CreatureSize.Medium]: 9,
  [CreatureSize.Large]: 11,
  [CreatureSize.Huge]: 13,
  [CreatureSize.Gargantuan]: 21,
  [CreatureSize.Colossal]: 33,
};

export class Creature {
  /**
   * Describes to which races this creature belongs.
   */
  public readonly races: Race[] = [];

  /**
   * Stores all of the creature's abilities.
   */
  public readonly abilities: Map<string, Ability>;

  /**
   * Specifies the creature's size.
   */
  public readonly size: CreatureSize = CreatureSize.Medium;

  /**
   * Determines the creature's morality and attitude towards society and order.
   */
  public readonly alignment: CreatureAlignment = CreatureAlignment.Neutral;

  /**
   * Contains a unique identifier for this instance.
   */
  public readonly id: string;

  /**
   * A common denomination for the creature.
   */
  public readonly name: string = "Unknown Creature";

  /**
   * Counts how many hits the creature can sustain.
   */
  public readonly hitPoints: Point;

  /**
   * Represents a lifeform.
   *
   * @param options Configures how this creature will behave.
   */
  public constructor(options: CreatureOptions = {}) {
    this.id = generateUUID();
    this.abilities = new Map<string, Ability>();

    if (options.name) {
      this.name = options.name;
    }

    if (options.races) {
      /**
       * @todo Should define what it means in terms of attribute dominance
       * to support multiple races.
       *
       * @see https://github.com/xethya/framework/issues/30
       */
      this.races = options.races;
    }

    if (this.races.length === 1) {
      this.size = this.races[0].size;
      this.alignment = this.races[0].alignment;
    }

    if (options.size) {
      this.size = options.size;
    }

    if (options.alignment) {
      this.alignment = options.alignment;
    }

    const hitPointScore = options.hitPoints || sizeToHitPoints[this.size];
    this.hitPoints = new Point({
      name: "Hit Points",
      unit: "HP",
      minimumScore: 0,
      maximumScore: hitPointScore,
      initialScore: hitPointScore,
    });

    if (options.abilityForHitPoints) {
      this.abilities.set(options.abilityForHitPoints.id, options.abilityForHitPoints);
      this.hitPoints.addCalculation(() => options.abilityForHitPoints.modifier);
    }
  }
}
