import Ability from "@xethya/ability";

export default class DexterityAbility extends Ability {
  constructor(score?: number) {
    super({ id: 'dexterity', score });
  }
}
