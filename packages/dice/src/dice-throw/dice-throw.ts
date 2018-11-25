import Die from '../die';
import DiceThrowResult from './dice-throw-result';

import BlumBlumShub from '@xethya/random-blum-blum-shub';
import { assert } from '@xethya/utils';
import { IDiceThrowSettings } from '../types';

export default class DiceThrow {
  private dice: Die[] = [];

  constructor({
    diceCount = 2,
    faces = 6,
    randomizer = new BlumBlumShub(),
  } = {} as IDiceThrowSettings) {
    assert(faces >= 2, 'DiceThrow#constructor: expected `faces` to be at least 2.');

    this.dice = new Array(diceCount).fill(new Die(faces, { randomizer }), 0, diceCount);
  }

  roll(): DiceThrowResult {
    const rolls = this.dice.map((die) => die.roll());
    return new DiceThrowResult(rolls);
  }
}
