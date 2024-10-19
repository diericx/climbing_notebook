import { expect, test, vi } from 'vitest';
import {
  getFirstDayOfTheWeek,
  isDateInTheSameDayAsToday,
  isDateInTheSameWeekAsToday,
} from './utils';

test('isDateInTheSameDayAsToday returns true if dates are same dom in UTC but not in local time', async () => {
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

test('getFirstDayOfTheWeek returns Oct 14 for Oct 18', async () => {
  process.env.TZ = 'PST';
  const d = new Date('2024-10-18T00:00:00.000Z');
  expect(getFirstDayOfTheWeek(d).toISOString()).toBe('2024-10-14T00:00:00.000Z');
});

test('getFirstDayOfTheWeek returns Oct 14 for Oct 20 (edge case)', async () => {
  process.env.TZ = 'PST';
  const d = new Date('2024-10-20T00:00:00.000Z');
  expect(getFirstDayOfTheWeek(d).toISOString()).toBe('2024-10-14T00:00:00.000Z');
});
