<script lang="ts">
  import CalExerciseEvent from '$lib/components/WeeklyCalendarExerciseEvent.svelte';
  import type { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
  import { getDayWeekStartsMonday } from '$lib/utils';
  import type { Prisma } from '@prisma/client';

  // Define prisma types
  export let trainingCycle: Prisma.TrainingCycleGetPayload<
    typeof trainingCycleSelects.everythingValidator
  >;

  export let profile: Prisma.ProfileGetPayload<{ select: { weightUnit: true } }>;

  const todayDayOfTheWeek = getDayWeekStartsMonday(new Date());
  let daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const day = trainingCycle.days[todayDayOfTheWeek];
</script>

<div class="overflow-scroll">
  <div class="row">
    <div class="grid grid-cols-1">
      <div id={daysOfTheWeek[todayDayOfTheWeek].toString()} class="px-2">
        <div style="height: 425px;" class="overflow-scroll">
          {#if day.exercises.length == 0 && day.exerciseGroups.length == 0}
            <p class="text-gray-400 italic">No exercises for this day</p>
          {/if}
          {#each day.exercises as exerciseEvent}
            <CalExerciseEvent {profile} {exerciseEvent} date={new Date()} />
          {/each}

          {#each day.exerciseGroups as group}
            <p class="font-bold">{group.name}</p>
            {#each group.exercises as exerciseEvent}
              <CalExerciseEvent {profile} {exerciseEvent} date={new Date()} />
            {/each}
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
