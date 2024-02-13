<script lang="ts">
  import dayjs from '$lib/dayjs';
  import type { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
  import { confirmDelete, kgToLb, roundTo } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { Prisma } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import FormButton from './forms/FormButton.svelte';

  export let profile: Prisma.ProfileGetPayload<{
    select: {
      weightUnit: true;
    };
  }>;
  export let exerciseEvents: Prisma.ExerciseEventGetPayload<
    typeof exerciseEventSelects.minimalValidator
  >[];

  export let showDate = true;
  export let showDifficulty = true;
  export let showActionBtns = true;
</script>

<List>
  {#each exerciseEvents as exerciseEvent}
    <ListItem showElipses={showActionBtns}>
      <div slot="title" class="flex items-center md:space-x-3">
        <div class="mr-2">
          <Icon icon="healthicons:exercise-weights" width="35" />
        </div>
        {#if showDate}
          <div class="flex-initial hidden md:block">
            {dayjs.tz(exerciseEvent.date || '', 'utc').format('L')}
          </div>
        {/if}
        <div class="flex-1 min-w-0">
          <p>{exerciseEvent.exercise?.name || exerciseEvent.name}</p>
          {#if exerciseEvent.exerciseId == null}
            <p class="text-red-400">Edit to migrate</p>
          {/if}
          <p class="text-sm text-gray-400">
            {#if showDate}
              <span class="md:hidden">
                {dayjs.tz(exerciseEvent.date || '', 'utc').format('L')}
                <br />
              </span>
            {/if}
            {exerciseEvent.sets}x{exerciseEvent.reps} :
            {exerciseEvent.minutes}m{exerciseEvent.seconds}s : {profile.weightUnit == 'kg'
              ? roundTo(exerciseEvent.weight, 1)
              : roundTo(kgToLb(exerciseEvent.weight), 1)}{profile.weightUnit}
            {#if exerciseEvent.difficulty && showDifficulty}
              : {exerciseEvent.difficulty}
              difficulty
            {/if}
          </p>
        </div>
      </div>

      <div slot="popup-buttons">
        <button
          class="btn btn-sm w-full justify-start"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalExerciseEvent',
              meta: {
                data: exerciseEvent,
                action: `/exerciseEvent/${exerciseEvent.id}?/edit`,
                title: 'Edit Exercise Event',
                formProps: {
                  showDate,
                  showDifficulty,
                  profile,
                },
              },
            })}
        >
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span>Edit</span>
        </button>
        <div />
        <button
          class="btn btn-sm w-full justify-start"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalExerciseEvent',
              meta: {
                data: { ...exerciseEvent, date: new Date() },
                action: `/exerciseEvent?/new`,
                title: 'Duplicate Exercise Event',
                formProps: {
                  showDate,
                  showDifficulty,
                  profile,
                },
              },
            })}
        >
          <Icon icon="material-symbols:control-point-duplicate-outline" height="18" />
          <span>Duplicate</span>
        </button>
        <FormButton
          action={`/exerciseEvent/${exerciseEvent.id}?/delete`}
          class="btn btn-sm w-full justify-start"
          onClick={confirmDelete}
        >
          <Icon icon="mdi:trash-outline" height="18" />
          <span class="ml-1 mr-1"> Delete </span>
        </FormButton>
      </div>
    </ListItem>
  {/each}
</List>

{#if exerciseEvents.length == 0}
  <span class="italic text-gray-400">No exercises</span>
{/if}
