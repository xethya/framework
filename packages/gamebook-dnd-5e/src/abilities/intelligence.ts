import Ability from "@xethya/ability";

export default class IntelligenceAbility extends Ability {
  constructor(score?: number) {
    super({ id: 'intelligence', score });
  }
}
