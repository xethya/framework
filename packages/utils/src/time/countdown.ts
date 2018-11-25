import EventEmitter from 'eventemitter3';
import TimeInterval from './time-interval';
import { CountdownEventCallback, ICountdown } from './types';

export default class Countdown implements ICountdown {
  protected $countdownTimer: NodeJS.Timeout;
  protected $events: EventEmitter;
  protected $isPaused: boolean = false;
  protected $isFinished: boolean = false;
  protected $secondsToCount: number = 0;
  protected $secondsElapsed: number = 0;
  protected $timeInterval: TimeInterval;

  constructor(from: TimeInterval) {
    this.$timeInterval = from;
    this.$events = new EventEmitter();
  }

  get seconds(): number {
    return this.$timeInterval.seconds;
  }

  get minutes(): number {
    return this.$timeInterval.minutes;
  }

  get hours(): number {
    return this.$timeInterval.hours;
  }

  get days(): number {
    return this.$timeInterval.days;
  }

  get secondsToCount() {
    return this.$secondsToCount;
  }

  get secondsElapsed() {
    return this.$secondsElapsed;
  }

  get isPaused() {
    return this.$isPaused;
  }

  get isFinished() {
    return this.$isFinished;
  }

  beginCountdown() {
    this.$countdownTimer = setInterval(this.tick.bind(this), 1000);
    this.$secondsToCount = this.$timeInterval.asSeconds();
    this.$secondsElapsed = 0;
    this.$events.emit('begin');
  }

  pauseCountdown() {
    if (this.$isPaused) {
      return;
    }

    this.$isPaused = true;
    clearInterval(this.$countdownTimer);
  }

  resumeCountdown() {
    if (!this.$isPaused) {
      return;
    }

    this.$isPaused = false;
    this.$countdownTimer = setInterval(this.tick.bind(this), 1000);
  }

  tick(): void {
    this.$secondsElapsed += 1;
    this.$events.emit('tick', this);

    if (this.$secondsElapsed >= this.$secondsToCount) {
      clearInterval(this.$countdownTimer);
      this.$events.emit('end');
      this.$isFinished = true;
    }
  }

  onBegin(callback: EventEmitter.ListenerFn) {
    this.$events.on('begin', callback);
  }

  onTick(callback: CountdownEventCallback) {
    this.$events.on('tick', callback);
  }

  onNextTick(callback: CountdownEventCallback) {
    this.$events.once('tick', callback);
  }

  onEnd(callback: EventEmitter.ListenerFn) {
    this.$events.on('end', callback);
  }
}
