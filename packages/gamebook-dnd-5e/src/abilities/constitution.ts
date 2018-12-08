import Ability from "@xethya/ability";

export default class ConstitutionAbility extends Ability {
  constructor(score?: number) {
    super({ id: 'constitution', score });
  }
}
