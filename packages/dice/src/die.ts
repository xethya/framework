/**
 * The core class of the package. The Die class allows to configure a single,
 * positive, integer random throw.
 *
 * By default, the chance throw uses the Blum Blum Shub algorithm contained in
 * `@xethya/random-blum-blum-shub`, which provides a randomizer with an equal chance
 * of rolling numbers in all of the range.
 *
 * You can use the `@xethya/random-mersenne-twister` package to use the chance throw
 * with the Mersenne-Twister algorithm, which provides an average distribution
 * of 65-35-0 (you'll never get numbers larger than 66).
 *
 * @example
 * ```js
 * // Roll a single d6.
 * const d6 = new Die();
 * d6.roll(); // A number between 1 and 6.
 *
 * // Roll a single d4.
 * const d4 = new Die(4);
 * d4.roll();
 *
 * // Alternative, static syntax. Will always use Blum Blum Shub.
 * Die.rollD(4);
 * ```
 *
 * @class Die
 *
 * @param {Number} faces - Gets or sets how many faces the die has. Must be at least 2.
 * @param {IDieSettings} settings - A configuration object.
 * @param {IPseudoRandomNumberGenerator}  [settings.randomizer = BlumBlumShub] - The strategy to use
 *                 to generate the numbers. Must be an instance of IPseudoRandomNumberGenerator.
 * @param {Object} [settings.randomStrategySettings = {}] - Specific configuration for the
 *                 randomizer. Most strategies should have default settings so you don't need
 *                 to use this, usually.
 *
 * @property {Number} faces - Gets or sets how many faces the die has. Must be at least 2.
 *
 * @uses BlumBlumShub
 */

import BlumBlumShub from '@xethya/random-blum-blum-shub';
import { IPseudoRandomNumberGenerator } from '@xethya/random-core';

import EventEmitter from 'eventemitter3';
import { DieRollEventCallback, IDie, IDieSettings } from './types';

export default class Die implements IDie {
  protected eventEmitter: EventEmitter;
  protected randomizer: IPseudoRandomNumberGenerator;

  public readonly faces: number;

  constructor(faces: number, settings: IDieSettings = {
    randomizer: new BlumBlumShub(),
  }) {
    this.faces = faces;
    this.randomizer = settings.randomizer;
    this.eventEmitter = new EventEmitter();
  }

  roll(): number {
    this.eventEmitter.emit('before:roll');

    const random: number = this.randomizer.generateRandom();
    const result: number = Math.ceil(random * this.faces);

    this.eventEmitter.emit('roll', result);

    return result;
  }

  onBeforeRoll(callback: EventEmitter.ListenerFn) {
    this.eventEmitter.on('before:roll', callback);
  }

  onRoll(callback: DieRollEventCallback) {
    this.eventEmitter.on('roll', callback);
  }

  onNextRoll(callback: DieRollEventCallback) {
    this.eventEmitter.once('roll', callback);
  }

  static rollD(faces: number) {
    return new Die(faces).roll();
  }
}
