<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ExerciseRepo } from '$lib/exercise';
  import type { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
  import type { Prisma } from '@prisma/client';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import { modalStore, popup } from '@skeletonlabs/skeleton';

  export let exerciseEvent: Prisma.ExerciseEventGetPayload<
    typeof exerciseEventSelects.everythingValidator
  >;
  export let exercises:
    | Prisma.ExerciseGetPayload<typeof ExerciseRepo.selectMinimalValidator>[]
    | undefined = undefined;
  export let date: Date;
  export let disableActionButtons = false;
  export let showMarkedCompleted = true;

  const popupHover: PopupSettings = {
    event: 'hover',
    target: 'popupHover',
    placement: 'top',
  };

  $: isMarkedCompleted =
    showMarkedCompleted == true
      ? exerciseEvent.markedCompletions.find((c) => {
          let d1 = c.toISOString().split('T')[0];
          let d2 = date.toISOString().split('T')[0];
          return d1 == d2;
        }) != undefined
      : false;

  let formForIsMarkedCompleted: HTMLFormElement;
  let isLegacy = exerciseEvent.exerciseId == null;
</script>

<div
  class="col rounded-md border p-2 mb-2 leading-5 bg-white {isMarkedCompleted ? 'opacity-50' : ''}"
>
  <div class="flex items-center">
    <form
      bind:this={formForIsMarkedCompleted}
      action={`/exerciseEvent/${exerciseEvent.id}/edit?/setCompleted`}
      use:enhance={() => {
        return async ({ update }) => {
          update({ reset: false });
        };
      }}
      method="POST"
    >
      <input type="hidden" name="date" value={date} />
      <input
        use:popup={popupHover}
        type="checkbox"
        name="isCompleted"
        disabled={disableActionButtons}
        checked={isMarkedCompleted}
        on:change={() => {
          formForIsMarkedCompleted.requestSubmit();
          // Update the UI now, changes/truth will be updated once the form
          // submission result is back
          isMarkedCompleted = !isMarkedCompleted;
        }}
        class="w-4 h-4 mr-2 rounded-full border-gray-400 text-green-600 disabled:text-green-300 focus:ring-red-200"
      />
    </form>
    {exerciseEvent.exercise?.name || exerciseEvent.name}
  </div>
  <div class="mt-1 text-sm text-gray-500">
    <div>
      {#if exerciseEvent.sets != 0 || exerciseEvent.reps != 0}
        {exerciseEvent.sets}x{exerciseEvent.reps}
      {/if}
      {#if exerciseEvent.minutes != 0 || exerciseEvent.seconds != 0}
        : {exerciseEvent.minutes}m{exerciseEvent.seconds}s
      {/if}
      {#if exerciseEvent.weight != 0}
        : {exerciseEvent.weight}kg
      {/if}
    </div>
    {#if exerciseEvent.notes}
      <div>{exerciseEvent.notes}</div>
    {/if}
    {#if isLegacy}
      <p class="text-red-400">Exercise needs to be edited/migrated before it can be used.</p>
    {/if}

    <div class="pt-1">
      <button
        class="btn btn-sm variant-filled-primary bg-green-500 py-0 text-white"
        disabled={isMarkedCompleted || disableActionButtons || isLegacy}
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalExerciseEvent',
            meta: {
              action: `/exerciseEvent?/new`,
              title: 'Complete Exercise',
              // remove group id and program id so this will be considered an exercise event
              data: {
                ...exerciseEvent,
                exerciseGroupId: null,
                trainingCycleDayId: null,
                date: new Date(),
              },
              formProps: {
                exercises,
                exerciseToMarkCompleted: exerciseEvent,
                dateToMarkCompleted: date,
              },
            },
          })}
      >
        <span>Complete</span>
      </button>
    </div>
  </div>
</div>

<div data-popup="popupHover">
  <div class="z-50 card p-3">
    <p class="text-sm text-gray-500">
      This button not log any data, it only controls the UI.
      <br />
      Use the "Complete" button below to log data from this exercise.
    </p>
  </div>
  <div class="arrow bg-white border" />
</div>
