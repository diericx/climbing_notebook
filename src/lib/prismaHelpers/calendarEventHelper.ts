import { Prisma } from '@prisma/client';

function makeCalendarEventSelect<T extends Prisma.CalendarEventSelect>(
  select: Prisma.Subset<T, Prisma.CalendarEventSelect>,
): T {
  return select;
}

const selectEverything = makeCalendarEventSelect({
  id: true,
  ownerId: true,
  dateStart: true,
  dateEnd: true,
  title: true,
  content: true,
  color: true,
});
const selectEverythingValidator = Prisma.validator<Prisma.CalendarEventDefaultArgs>()({
  select: selectEverything,
});

const calendarEventSelects = {
  everything: selectEverything,
  everythingValidator: selectEverythingValidator,
};

export { calendarEventSelects };
