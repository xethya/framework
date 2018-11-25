import { IPseudoRandomNumberGenerator } from '@xethya/random-core';
import { Range } from '@xethya/utils';
import { ListenerFn } from 'eventemitter3';

export interface IDieSettings {
  randomizer: IPseudoRandomNumberGenerator;
}

export type DieRollEventCallback = (result: number) => void;

export interface IDie {
  readonly faces: number;
  roll(): number;

  onBeforeRoll(callback: ListenerFn): void;
  onRoll(callback: DieRollEventCallback): void;
  onNextRoll(callback: DieRollEventCallback): void;
}

export interface IDiceThrow {
  roll(): IDiceThrowResult;
}

export interface IDiceThrowResult {
  rolls: number[];
  getRollSum(): number;
}

export interface IDiceThrowSettings {
  diceCount?: number;
  faces?: number;
  randomizer?: IPseudoRandomNumberGenerator;
}

export const enum DiceThrowTypes {
  FAILURE = 'failure',
  SUCCESS = 'success',
  CRITICAL_SUCCESS = 'criticalSuccess',
}

export interface IChanceThrow {
  roll(): IChanceThrowResult;
}

export interface IChanceThrowResult {
  throwType: DiceThrowTypes;
  rolledNumber: number;
}

export interface IChanceThrowSettings {
  chanceRanges: IChanceRanges;
}

export interface IChanceRanges {
  failureRange: Range;
  successRange: Range;
  criticalSuccessRange: Range;
}
