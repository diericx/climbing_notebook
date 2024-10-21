import { expect, test, vi } from 'vitest';
import {
  getDayWhenWeekStartsMonday,
  getFirstDayOfTheWeek,
  getLastDayOfTheWeek,
  isDateInTheSameDayAsToday,
  isDateInTheSameWeekAsToday,
} from './utils';

test('isDateInTheSameDayAsToday returns true if dates are same day in UTC but not in local time', async () => {
  process.env.TZ = 'PST';
  vi.useFakeTimers();

  const mockDate = new Date('2024-09-28T06:00:00.225Z'); // 11pm PST
  vi.setSystemTime(mockDate);

  const d = new Date('2024-09-28T07:00:00.225Z'); // 12am PST
  expect(isDateInTheSameDayAsToday(d)).toBe(true);

  vi.useRealTimers();
});

test('isDateInTheSameDayAsToday returns false if dates are different dom in UTC but same in local time', async () => {
  process.env.TZ = 'PST';
  vi.useFakeTimers();

  const mockDate = new Date('2024-09-28T23:00:00.225Z'); // 4pm PST
  vi.setSystemTime(mockDate);

  const d = new Date('2024-09-29T00:00:00.225Z'); // 5pm PST
  expect(isDateInTheSameDayAsToday(d)).toBe(false);

  vi.useRealTimers();
});

test('isDateInTheSameDayAsToday returns true at end of day', async () => {
  process.env.TZ = 'PST';
  vi.useFakeTimers();

  const mockDate = new Date('2024-09-28T23:00:00.000Z');
  vi.setSystemTime(mockDate);

  const d = new Date('2024-09-29T11:59:59.999Z');
  expect(isDateInTheSameDayAsToday(d)).toBe(false);

  vi.useRealTimers();
});

test('isDateInTheSameWeekAsToday returns false if date is one day before today being a Monday', async () => {
  process.env.TZ = 'PST';
  vi.useFakeTimers();

  const mockDate = new Date('2024-09-23T07:00:00.225Z'); // 23 12am Monday PST
  vi.setSystemTime(mockDate);

  const d = new Date('2024-09-23T06:00:00.225Z'); // 22 11pm Sunday PST
  expect(isDateInTheSameWeekAsToday(d)).toBe(false);

  vi.useRealTimers();
});

test('isDateInTheSameWeekAsToday returns true if date is one day after today being a Monday', async () => {
  process.env.TZ = 'PST';
  vi.useFakeTimers();

  const mockDate = new Date('2024-09-23T07:00:00.225Z');
  vi.setSystemTime(mockDate);

  const d = new Date('2024-09-24T06:00:00.225Z');
  expect(isDateInTheSameWeekAsToday(d)).toBe(true);

  vi.useRealTimers();
});

test('getDayWhenWeekStartsMonday returns 0 for Oct 14th (a monday)', async () => {
  const d = new Date('2024-10-14T00:00:00.000Z');
  expect(getDayWhenWeekStartsMonday(d)).toBe(0);
});

test('getDayWhenWeekStartsMonday returns 6 for Oct 20th (a sunday)', async () => {
  const d = new Date('2024-10-20T00:00:00.000Z');
  expect(getDayWhenWeekStartsMonday(d)).toBe(6);
});

test('getFirstDayOfTheWeek returns Oct 14 for Oct 18', async () => {
  process.env.TZ = 'PST';
  const d = new Date('2024-10-18T00:00:00.000Z');
  expect(getFirstDayOfTheWeek(d).toISOString()).toBe('2024-10-14T00:00:00.000Z');
});

test('getFirstDayOfTheWeek returns Oct 14 for Oct 20 (edge case)', async () => {
  const d = new Date('2024-10-20T00:00:00.000Z');
  expect(getFirstDayOfTheWeek(d).toISOString()).toBe('2024-10-14T00:00:00.000Z');
});

test('getLastDayOfTheWeek returns Oct 20 for Oct 14', async () => {
  const d = new Date('2024-10-14T00:00:00.000Z');
  expect(getLastDayOfTheWeek(d).toISOString()).toBe('2024-10-20T00:00:00.000Z');
});

test('getLastDayOfTheWeek returns Oct 20 for Oct 20', async () => {
  const d = new Date('2024-10-20T00:00:00.000Z');
  expect(getLastDayOfTheWeek(d).toISOString()).toBe('2024-10-20T00:00:00.000Z');
});
