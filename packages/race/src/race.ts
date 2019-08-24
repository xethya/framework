import { CreatureAlignment, CreatureSize } from "@xethya/definitions";

export type RaceOptions = {
  /**
   * The age entry notes the age when a member of the race is considered an adult,
   * as well as the race's expected lifespan.
   */
  age?: number;

  /**
   * Most races have tendencies toward certain alignments, described in this entry.
   */
  alignment?: CreatureAlignment;

  /**
   * Characters of most races are Medium, a size category including creatures that are
   * roughly 4 to 8 feet tall. Members of a few races are Small (between 2 and 4 feet tall),
   * which means that certain rules of the game affect them differently.
   */
  size?: CreatureSize;

  /**
   * Your speed determines how far you can move when traveling (“Adventuring”) and fighting (“Combat”).
   */
  speed?: number;

  /**
   * By virtue of your race, your character can speak, read, and write certain languages.
   *
   * @todo Implement a better type for this.
   */
  languages?: string[];

  /**
   * Some races have subraces. Members of a subrace have the traits of the parent race in addition to the traits
   * specified for their subrace. Relationships among subraces vary significantly from race to race and world to world.
   */
  parentRace?: Race;
};

/**
 * A race is a type of creature. The description of each race includes racial traits
 * that are common to members of that race.
 */
export class Race {
  /**
   * The age entry notes the age when a member of the race is considered an adult,
   * as well as the race's expected lifespan.
   */
  public readonly age?: number;

  /**
   * Most races have tendencies toward certain alignments, described in this entry.
   */
  public readonly alignment: CreatureAlignment = CreatureAlignment.Neutral;

  /**
   * Characters of most races are Medium, a size category including creatures that are
   * roughly 4 to 8 feet tall. Members of a few races are Small (between 2 and 4 feet tall),
   * which means that certain rules of the game affect them differently.
   */
  public readonly size: CreatureSize = CreatureSize.Medium;

  /**
   * Your speed determines how far you can move when traveling (“Adventuring”) and fighting (“Combat”).
   */
  public readonly speed?: number;

  /**
   * By virtue of your race, your character can speak, read, and write certain languages.
   *
   * @todo Implement a better type for this.
   */
  public readonly languages: string[] = ["common"];

  /**
   * Some races have subraces. Members of a subrace have the traits of the parent race in addition to the traits
   * specified for their subrace. Relationships among subraces vary significantly from race to race and world to world.
   */
  public readonly parentRace?: Race;

  constructor(options: RaceOptions = {}) {
    if (options.parentRace) {
      this.parentRace = options.parentRace;

      this.age = this.parentRace.age;
      this.alignment = this.parentRace.alignment;
      this.languages = this.parentRace.languages;
      this.size = this.parentRace.size;
      this.speed = this.speed;
    }

    if (!this.age) {
      this.age = options.age;
    }

    if (options.alignment) {
      this.alignment = options.alignment;
    }

    if (options.size) {
      this.size = options.size;
    }

    if (!this.speed) {
      this.speed = options.speed;
    }

    if (options.languages) {
      this.languages = [...this.languages, ...options.languages];
    }
  }
}
