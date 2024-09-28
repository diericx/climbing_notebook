import { expect, test, vi } from 'vitest';
import { isDateInTheSameDayAsToday } from './utils';

test('isDateInTheSameDayAsToday returns false if dates are same dom in UTC but not in local time', async () => {
  process.env.TZ = 'PST';
  vi.useFakeTimers();

  const mockDate = new Date('2024-09-28T06:00:00.225Z'); // 11pm PST
  vi.setSystemTime(mockDate);

  const d = new Date('2024-09-28T07:00:00.225Z'); // 12am PST
  expect(isDateInTheSameDayAsToday(d)).toBe(false);

  vi.useRealTimers();
});

test('isDateInTheSameDayAsToday returns true if dates are different dom in UTC but same in local time', async () => {
  process.env.TZ = 'PST';
  vi.useFakeTimers();

  const mockDate = new Date('2024-09-28T23:00:00.225Z'); // 4pm PST
  vi.setSystemTime(mockDate);

  const d = new Date('2024-09-29T00:00:00.225Z'); // 5pm PST
  expect(isDateInTheSameDayAsToday(d)).toBe(true);

  vi.useRealTimers();
});
