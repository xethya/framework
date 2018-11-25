import { Range } from '@xethya/utils';

import D100 from '../presets/d100';
import { IChanceRanges, IChanceThrow, IChanceThrowResult, IChanceThrowSettings } from '../types';
import ChanceThrowResult from './chance-throw-result';

export const DefaultChanceRanges = {
  criticalSuccessRange: new Range(91, 100),
  failureRange: new Range(1, 20),
  successRange: new Range(21, 90),
};

export default class ChanceThrow implements IChanceThrow {
  protected die: D100;
  public chanceRanges: IChanceRanges;

  constructor(settings: IChanceThrowSettings = { chanceRanges: DefaultChanceRanges }) {
    this.die = new D100();
    this.chanceRanges = settings.chanceRanges;
  }

  roll(): IChanceThrowResult {
    const rolledNumber = this.die.roll();
    return new ChanceThrowResult(this.chanceRanges, rolledNumber);
  }
}
