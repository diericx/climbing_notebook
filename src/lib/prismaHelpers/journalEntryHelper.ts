import { Prisma } from '@prisma/client';

function makeSelect<T extends Prisma.JournalEntrySelect>(
  select: Prisma.Subset<T, Prisma.JournalEntrySelect>,
): T {
  return select;
}

const selectEverything = makeSelect({
  id: true,
  date: true,
  content: true,
  createdAt: true,
  owner: true,
});
const selectEverythingValidator = Prisma.validator<Prisma.JournalEntryDefaultArgs>()({
  select: selectEverything,
});

const selectMinimal = makeSelect({
  id: true,
  date: true,
  content: true,
  isPublic: true,
});
const selectMinimalValidator = Prisma.validator<Prisma.JournalEntryDefaultArgs>()({
  select: selectMinimal,
});

const journalEntrySelects = {
  minimal: selectMinimal,
  minimalValidator: selectMinimalValidator,
  everything: selectEverything,
  everythingValidator: selectEverythingValidator,
};

export { journalEntrySelects };
