import { prisma } from '$lib/server/prisma';
import { ExerciseEventRepo } from '$lib/server/repos/exerciseEventRepo';
import { expect, test } from 'vitest';

test('creates a new exercise event with correct date', async () => {
  const repo = new ExerciseEventRepo(prisma);
  const dateStr = '2024-09-28T19:14:37.225Z';
  const newEE = await repo.new(
    {
      name: 'TEST Exercise Event',
      sets: 99,
      reps: 99,
      weight: 0,
      seconds: 0,
      minutes: 0,
      date: new Date(dateStr),
      // TODO: create this earlier
      exerciseId: 'clsjsi34u0004f6g5j1o6ypsr',
    },
    // TODO: create this earlier
    'fogyl2e5w0qpp30'
  );

  const getOneResult = await repo.getOne({
    id: newEE.id,
    userId: newEE.ownerId,
    select: { date: true },
  });

  expect(getOneResult.date?.toString() == dateStr);

  // expect(sum(1, 2)).toBe(3);

  await repo.delete(newEE.id, newEE.ownerId);
});
