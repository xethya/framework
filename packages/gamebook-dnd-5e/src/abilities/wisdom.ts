import Ability from "@xethya/ability";

export default class WisdomAbility extends Ability {
  constructor(score?: number) {
    super({ id: 'wisdom', score });
  }
}
