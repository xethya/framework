import { divideAndModulo } from '../numeric';
import { ITimeInterval, TimeMeasurement } from './types';

export default class TimeInterval implements ITimeInterval {
  protected $seconds: number = 0;
  protected $minutes: number = 0;
  protected $hours: number = 0;
  protected $days: number = 0;

  constructor(
    seconds: number = 0,
    minutes: number = 0,
    hours: number = 0,
    days: number = 0,
  ) {
    this.seconds += seconds;
    this.minutes += minutes;
    this.hours += hours;
    this.days += days;
  }

  get seconds() {
    return this.$seconds;
  }

  set seconds(newValue) {
    const { remainder, result } = divideAndModulo(newValue, 60);

    this.$seconds = remainder;
    this.minutes += result;
  }

  get minutes() {
    return this.$minutes;
  }

  set minutes(newValue) {
    const { remainder, result } = divideAndModulo(newValue, 60);

    if (remainder > 0 && remainder < 1) {
      this.seconds += remainder * 60;
      this.$minutes = 0;
      return;
    }

    this.$minutes = remainder;
    this.hours += result;
  }

  get hours() {
    return this.$hours;
  }

  set hours(newValue) {
    const { remainder, result } = divideAndModulo(newValue, 24);

    if (remainder > 0 && remainder < 1) {
      this.minutes += remainder * 60;
      this.$hours = 0;
      return;
    }

    this.$hours = remainder;
    this.days += result;
  }

  get days() {
    return this.$days;
  }

  set days(newValue) {
    if (newValue > 0 && newValue < 1) {
      this.hours += newValue * 24;
      this.$days = 0;
      return;
    }

    this.$days = newValue;
  }

  as(timeUnit: TimeMeasurement): number {
    const callbackMap = {
      [TimeMeasurement.SECONDS]: this.asSeconds,
      [TimeMeasurement.MINUTES]: this.asMinutes,
      [TimeMeasurement.HOURS]: this.asHours,
      [TimeMeasurement.DAYS]: this.asDays,
    };

    return callbackMap[timeUnit].bind(this)();
  }

  asSeconds(): number {
    const minutesAsSeconds = this.minutes * 60;
    const hoursAsSeconds = this.hours * 60 * 60;
    const daysAsSeconds = this.days * 24 * 60 * 60;

    return this.seconds + minutesAsSeconds + hoursAsSeconds + daysAsSeconds;
  }

  asMinutes(): number {
    const secondsAsMinutes = this.seconds / 60;
    const hoursAsMinutes = this.hours * 60;
    const daysAsMinutes = this.days * 24 * 60;

    return secondsAsMinutes + this.minutes + hoursAsMinutes + daysAsMinutes;
  }

  asHours(): number {
    const secondsAsHours = this.seconds / 60 / 60;
    const minutesAsHours = this.minutes / 60;
    const daysAsHours = this.days * 24;

    return secondsAsHours + minutesAsHours + this.hours + daysAsHours;
  }

  asDays(): number {
    const secondsAsDays = this.seconds / 60 / 60 / 24;
    const minutesAsDays = this.minutes / 60 / 60;
    const hoursAsDays = this.hours / 24;

    return secondsAsDays + minutesAsDays + hoursAsDays + this.days;
  }

  clone(): TimeInterval {
    return new TimeInterval(this.seconds, this.minutes, this.hours, this.days);
  }
}
