import { Countdown, TimeInterval } from '../../src/time';

let countdown: Countdown;

describe('Utils.Time.Countdown', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    countdown = new Countdown(new TimeInterval(0, 1));
  });
  it('should instantiate with the expected input', () => {
    expect(countdown.seconds).toEqual(0);
    expect(countdown.minutes).toEqual(1);
    expect(countdown.hours).toEqual(0);
    expect(countdown.days).toEqual(0);
    expect(countdown.isPaused).toBe(false);
    expect(countdown.isFinished).toBe(false);
  });
  describe('#beginCountdown (1 minute)', () => {
    it('should set secondsToCount to 60', () => {
      countdown.beginCountdown();
      expect(countdown.secondsToCount).toEqual(60);
    });
    it('should set secondsElapsed to 0', () => {
      countdown.beginCountdown();
      expect(countdown.secondsElapsed).toEqual(0);
    });
    it('should trigger the `begin` event', (done) => {
      countdown.onBegin(() => done());
      countdown.beginCountdown();
    });
  });
  describe('#tick', () => {
    beforeEach(() => {
      countdown.beginCountdown();
    });
    it('should increment secondsElapsed', () => {
      jest.advanceTimersByTime(1000);
      expect(countdown.secondsElapsed).toEqual(1);
    });
    it('should keep incrementing secondsElapsed', () => {
      jest.advanceTimersByTime(30000);
      expect(countdown.secondsElapsed).toEqual(30);
    });
    it('should trigger the `tick` event', (done) => {
      countdown.onNextTick((timer: Countdown) => {
        expect(timer.secondsElapsed).toEqual(1);
        expect(timer.secondsElapsed).toEqual(countdown.secondsElapsed);
        done();
      });
      countdown.onTick(() => done());
      jest.advanceTimersByTime(1000);
    });
    it('should trigger the `end` event when time is up', (done) => {
      countdown.onEnd(() => done());
      jest.advanceTimersByTime(60000);
    });
    it('should set isFinished to true when time is up', () => {
      jest.advanceTimersByTime(60000);
      expect(countdown.isFinished).toBe(true);
    });
  });
  describe('#pauseCountdown', () => {
    beforeEach(() => {
      countdown.beginCountdown();
      jest.advanceTimersByTime(10000);
    });
    it('should mark the countdown as paused', () => {
      countdown.pauseCountdown();
      expect(countdown.isPaused).toBe(true);
    });
    it('should not increment secondsElapsed while paused', () => {
      countdown.pauseCountdown();
      const { secondsElapsed } = countdown;
      jest.advanceTimersByTime(10000);
      countdown.pauseCountdown();
      jest.advanceTimersByTime(10000);
      expect(countdown.secondsElapsed).toEqual(secondsElapsed);
    });
  });
  describe('#resumeCountdown', () => {
    beforeEach(() => {
      countdown.beginCountdown();
      jest.advanceTimersByTime(10000);
    });
    it('should mark the countdown as not paused', () => {
      countdown.pauseCountdown();
      expect(countdown.isPaused).toBe(true);
      countdown.resumeCountdown();
      expect(countdown.isPaused).toBe(false);
    });
    it('should restart ticking after resuming', (done) => {
      countdown.pauseCountdown();
      countdown.resumeCountdown();
      jest.advanceTimersByTime(1000);
      countdown.resumeCountdown();
      countdown.onNextTick(() => done());
      jest.advanceTimersByTime(1000);
    });
  });
  afterAll(() => {
    jest.useRealTimers();
  });
});
