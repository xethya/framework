import { IAbility, IAbilitySettings } from "./types";

/**
 * @see https://www.dandwiki.com/wiki/5e_SRD:Ability_Scores
 */
export default class Ability implements IAbility {
  public id: string;
  public score: number;

  constructor({
    id,
    score = 0,
  }: IAbilitySettings) {
    this.id = id;
    this.score = score;
  }

  public get modifier(): number {
    return Math.floor((this.score - 10) / 2);
  }
}
