import { DiceThrowTypes, IChanceRanges, IChanceThrowResult } from '../types';

export default class ChanceThrowResult implements IChanceThrowResult {
  private chanceRanges: IChanceRanges;
  rolledNumber: number;

  constructor(chanceRanges: IChanceRanges, rolledNumber: number) {
    this.rolledNumber = rolledNumber;
    this.chanceRanges = chanceRanges;
  }

  get throwType(): DiceThrowTypes {
    const { criticalSuccessRange, successRange } = this.chanceRanges;
    const rolledNumber = this.rolledNumber;

    if (successRange.includes(rolledNumber)) {
      return DiceThrowTypes.SUCCESS;
    }

    if (criticalSuccessRange.includes(rolledNumber)) {
      return DiceThrowTypes.CRITICAL_SUCCESS;
    }

    return DiceThrowTypes.FAILURE;
  }
}
