import Ability from "@xethya/ability";
import { CreatureAlignment, CreatureSize } from "@xethya/definitions";
import { Race } from "@xethya/race";
import { v4 as generateUUID } from "uuid";

export type CreatureOptions = {
  races?: Race[];
  size?: CreatureSize;
  alignment?: CreatureAlignment;
  name?: string;
};

export class Creature {
  public readonly races: Race[] = [];
  public readonly abilities: Map<string, Ability>;
  public readonly size: CreatureSize = CreatureSize.Medium;
  public readonly alignment: CreatureAlignment = CreatureAlignment.Neutral;
  public readonly id: string;
  public readonly name: string = "Unknown Creature";

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
  }
}
