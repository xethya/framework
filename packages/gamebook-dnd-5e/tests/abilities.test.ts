import * as Abilities from '../src/abilities';

import Ability from '@xethya/ability';

const controlTable = [
  [['strength', new Abilities.StrengthAbility(1), 1]],
  [['dexterity', new Abilities.DexterityAbility(2), 2]],
  [['constitution', new Abilities.ConstitutionAbility(3), 3]],
  [['intelligence', new Abilities.IntelligenceAbility(4), 4]],
  [['wisdom', new Abilities.WisdomAbility(5), 5]],
  [['charisma', new Abilities.CharismaAbility(6), 6]],
];

describe("Gamebooks.dnd5e.Abilities", () => {
  it.each(controlTable)("should create %p", (data: Array<(string | Ability | number)>) => {
    const [ id, ability, score ] = data;
    expect((ability as Ability).id).toEqual(id as string);
    expect((ability as Ability).score).toEqual(score as number);
  });
});
