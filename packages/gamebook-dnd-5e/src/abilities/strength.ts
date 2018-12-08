import Ability from "@xethya/ability";

export default class StrengthAbility extends Ability {
  constructor(score?: number) {
    super({ id: 'strength', score });
  }
}
