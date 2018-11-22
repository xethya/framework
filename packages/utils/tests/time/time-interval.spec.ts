import { TimeInterval, TimeMeasurement } from '../../src/time';

const veryTinyPeriod = new TimeInterval(10);
const shortPeriod = new TimeInterval(30, 1);
const waitPeriod = new TimeInterval(0, 30, 1);
const longPeriod = new TimeInterval(0, 0, 12, 1);

describe('Utils.Time.TimeInterval', () => {
  it('should instantiate with the expected input', () => {
    expect(new TimeInterval().asSeconds()).toEqual(0);

    expect(veryTinyPeriod.seconds).toEqual(10);
    expect(veryTinyPeriod.minutes).toEqual(0);
    expect(veryTinyPeriod.hours).toEqual(0);
    expect(veryTinyPeriod.days).toEqual(0);

    expect(shortPeriod.seconds).toEqual(30);
    expect(shortPeriod.minutes).toEqual(1);
    expect(shortPeriod.hours).toEqual(0);
    expect(shortPeriod.days).toEqual(0);

    expect(waitPeriod.seconds).toEqual(0);
    expect(waitPeriod.minutes).toEqual(30);
    expect(waitPeriod.hours).toEqual(1);
    expect(waitPeriod.days).toEqual(0);

    expect(longPeriod.seconds).toEqual(0);
    expect(longPeriod.minutes).toEqual(0);
    expect(longPeriod.hours).toEqual(12);
    expect(longPeriod.days).toEqual(1);
  });
  it('should rescale time units automatically', () => {
    expect(new TimeInterval(120).minutes).toEqual(2);
    expect(new TimeInterval(0, 0.5).seconds).toEqual(30);
    expect(new TimeInterval(0, 0, 0.5).minutes).toEqual(30);
    expect(new TimeInterval(0, 0, 0, 0.25).hours).toEqual(6);
    expect(new TimeInterval(0, 90)).toMatchObject({ minutes: 30, hours: 1 });
    expect(new TimeInterval(0, 60, 26)).toMatchObject({ hours: 3, days: 1 });
    expect(new TimeInterval(0, 0, 25, 1)).toMatchObject({ hours: 1, days: 2 });
  });
  it('should convert time to days', () => {
    const interval = new TimeInterval(0, 0, 12);
    expect(interval.asDays()).toEqual(0.5);
    expect(interval.as(TimeMeasurement.DAYS)).toEqual(0.5);
  });
  it('should convert time to hours', () => {
    const interval = new TimeInterval(0, 45);
    expect(interval.asHours()).toEqual(0.75);
    expect(interval.as(TimeMeasurement.HOURS)).toEqual(0.75);
  });
  it('should convert time to minutes', () => {
    const interval = new TimeInterval(15);
    expect(interval.asMinutes()).toEqual(0.25);
    expect(interval.as(TimeMeasurement.MINUTES)).toEqual(0.25);
  });
  it('should convert time to seconds', () => {
    const interval = new TimeInterval(30, 6);
    expect(interval.asSeconds()).toEqual(390);
    expect(interval.as(TimeMeasurement.SECONDS)).toEqual(390);
  });
  it('should clone the interval', () => {
    expect(veryTinyPeriod.clone()).toEqual(veryTinyPeriod);
    expect(shortPeriod.clone()).toEqual(shortPeriod);
    expect(waitPeriod.clone()).toEqual(waitPeriod);
    expect(longPeriod.clone()).toEqual(longPeriod);
  });
});
