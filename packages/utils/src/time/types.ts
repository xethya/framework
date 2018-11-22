import { ListenerFn } from 'eventemitter3';

export const enum TimeMeasurement {
  SECONDS = 'seconds',
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
}

export type CountdownEventCallback = (countdown: ICountdown) => void;

export interface ITimeUnits {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

export interface ITimeInterval extends ITimeUnits {
  as(timeUnit: TimeMeasurement): number;
  asSeconds(): number;
  asMinutes(): number;
  asHours(): number;
  asDays(): number;

  clone(): ITimeInterval;
}

export interface ICountdown extends ITimeUnits {
  secondsToCount: number;
  secondsElapsed: number;
  isPaused: boolean;
  isFinished: boolean;
  beginCountdown(): void;
  pauseCountdown(): void;
  resumeCountdown(): void;
  tick(): void;

  onBegin(callback: ListenerFn);
  onTick(callback: CountdownEventCallback);
  onEnd(callback: ListenerFn);
}
