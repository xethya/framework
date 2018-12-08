import Ability from "@xethya/ability";

export default class CharismaAbility extends Ability {
  constructor(score?: number) {
    super({ id: 'charisma', score });
  }
}
