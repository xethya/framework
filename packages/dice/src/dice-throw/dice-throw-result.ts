import { array } from '@xethya/utils';
import { IDiceThrowResult } from '../types';

export default class DiceThrowResult implements IDiceThrowResult {
  public rolls: number[];

  constructor(rolls: number[]) {
    this.rolls = rolls;
  }

  getRollSum(): number {
    return this.rolls.reduce(array.reducers.bySum);
  }
}
