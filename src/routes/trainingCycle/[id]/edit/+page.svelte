<script lang="ts">
  import { enhance } from '$app/forms';
  import ListExerciseEvent from '$lib/components/ListExerciseEvent.svelte';
  import ListExerciseGroup from '$lib/components/ListExerciseGroup.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  let scrollY: number;
  $: trainingCycle = data.trainingCycle;
  $: exercises = data.exercises;

  let daysOfTheWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
</script>

<svelte:window bind:scrollY />

<div class="grid grid-cols-1">
  <div class="mb-12 flex items-center justify-between">
    <div>
      <h1 class="font-bold inline">
        Editing {trainingCycle.name}
      </h1>
    </div>

    <div class="flex">
      <button
        class="btn btn-sm variant-ringed justify-start mr-2"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'modalShareTrainingCycle',
            meta: {
              trainingCycle,
            },
          })}
      >
        <Icon icon="mdi:share" height="18" />
        <span>Share</span>
      </button>
    </div>
  </div>

  <div class="mb-10">
    <div class="text-xl">Details</div>
    <hr class="mb-2" />

    <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
      <div class="flex justify-between">
        <div>
          <p>
            <b>Name: </b>
            {trainingCycle.name}
          </p>
          <p>
            <b>Public: </b>
            {trainingCycle.isPublic ? 'yes' : 'no'}
          </p>
        </div>
        <div>
          <button
            class="btn btn-sm variant-ringed"
            on:click={() =>
              modalStore.trigger({
                type: 'component',
                component: 'formModalTrainingCycle',
                meta: {
                  data: trainingCycle,
                  action: `/trainingCycle/${trainingCycle.id}?/edit`,
                  title: 'Edit Training Cycle',
                },
              })}
          >
            <Icon icon="material-symbols:edit-outline" height="18" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="mb-10">
    <div class="flex justify-between mb-2">
      <div class="text-xl">Exercise Groups</div>
      <button
        class="btn btn-sm variant-filled"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalExerciseGroup',
            meta: {
              action: `/trainingCycle/${trainingCycle.id}?/addExerciseGroup`,
              title: 'Add Group',
            },
          })}
      >
        <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
        <span>Add Group</span>
      </button>
    </div>
    <hr class="mb-2" />

    {#each trainingCycle.exerciseGroups as group}
      <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
        <div class="flex items-center">
          <div class="flex mb-7 w-full justify-between">
            <h2 class="font-bold">{group.name}</h2>

            <div class="flex space-x-2">
              <button
                class="btn btn-sm variant-ringed"
                on:click={() =>
                  modalStore.trigger({
                    type: 'component',
                    component: 'formModalExerciseGroup',
                    meta: {
                      data: group,
                      action: `/trainingCycle/${trainingCycle.id}/group/${group.id}?/edit`,
                      title: 'Edit Group',
                    },
                  })}
              >
                <Icon icon="material-symbols:edit-outline" height="18" />
                <span>Edit</span>
              </button>
              <FormButton
                action={`/trainingCycle/${trainingCycle.id}/group/${group.id}?/delete`}
                onClick={confirmDelete}
                class="btn btn-sm variant-ringed"
              >
                <div slot="form">
                  <input type="hidden" name="exerciseGroupId" value={group.id} />
                </div>
                <Icon icon="mdi:trash-outline" height="18" />
                <span class="ml-1 mr-1"> Delete </span>
              </FormButton>
            </div>
          </div>
          <div />
        </div>

        <div>
          <div class="flex w-full items-center mb-2">
            <span class="items-end text-lg font-light">Exercises</span>
            <div class="flex-1" />
            <button
              class="btn btn-sm variant-filled"
              on:click={() =>
                modalStore.trigger({
                  type: 'component',
                  component: 'formModalExerciseEvent',
                  meta: {
                    action: `/trainingCycle/${trainingCycle.id}/group/${group.id}?/newExerciseEvent`,
                    title: 'Add Exercise',
                    formProps: {
                      showDate: false,
                      showDifficulty: false,
                      showMigrationOption: false,
                      exercises,
                    },
                  },
                })}
            >
              <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
              <span>Add Exercise</span>
            </button>
          </div>

          <ListExerciseEvent {exercises} exerciseEvents={group.exercises} showDate={false} />
        </div>
      </div>
    {/each}
  </div>

  <div class="mb-2">
    <div class="text-xl">Days</div>
    <p class="text-slate-400">Set exercises and exercise groups for each day of the week.</p>
  </div>
  <hr class="mb-2" />

  <div>
    {#each trainingCycle.days as day, i}
      <div class="bg-white rounded-lg px-4 pt-3 pb-3 mb-10 border">
        <div class="flex mb-4 justify-between">
          <div class="mr-2">
            <h2>
              <b>{daysOfTheWeek[i]}</b>
            </h2>
            <span class="text-gray-400">
              <i>{day.description || 'No description for this day'}</i>
            </span>
          </div>
          <div>
            <button
              class="btn btn-sm variant-ringed"
              on:click={() =>
                modalStore.trigger({
                  type: 'component',
                  component: 'formModalTrainingCycleDay',
                  meta: {
                    data: day,
                    action: `/trainingCycle/${trainingCycle.id}/day/${day.id}?/edit`,
                    title: 'Edit Day',
                  },
                })}
            >
              <Icon icon="material-symbols:edit-outline" height="18" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        <div class="mb-12">
          <div class="flex w-full justify-between items-end">
            <div class="font-bold text-lg">Exercise Groups</div>

            <form
              class="flex items-end"
              action={`/trainingCycle/${trainingCycle.id}/day/${day.id}/?/connectExerciseGroup`}
              use:enhance
              method="POST"
            >
              <input type="hidden" value={day.id} name="trainingCycleDayId" />
              <select name="exerciseGroupId" class="pr-8 py-1">
                {#each trainingCycle.exerciseGroups as group}
                  <option
                    value={group.id}
                    disabled={day.exerciseGroups.find((_g) => _g.id == group.id) != undefined}
                  >
                    {group.name}
                  </option>
                {/each}
              </select>
              <button class="btn btn-sm variant-filled mb-2 ml-2">
                <Icon icon="fluent:plug-connected-add-20-regular" height="18" />
                <span class="ml-1 mr-1"> Connect</span>
              </button>
            </form>
          </div>
          <ListExerciseGroup exerciseGroups={day.exerciseGroups}>
            <div slot="buttons" let:group>
              <FormButton
                action={`/trainingCycle/${trainingCycle.id}/day/${day.id}/?/disconnectExerciseGroup`}
                class="btn btn-sm variant-ringed"
              >
                <div slot="form">
                  <input type="hidden" value={group.id} name="exerciseGroupId" />
                </div>

                <Icon icon="fluent:plug-disconnected-20-regular" height="18" />
                <span class="ml-1 mr-1"> Disconnect </span>
              </FormButton>
            </div>
          </ListExerciseGroup>
        </div>

        <div class="flex justify-between items-end">
          <div class="text-lg font-bold">Exercises</div>
          <button
            class="btn btn-sm variant-filled mb-2"
            on:click={() =>
              modalStore.trigger({
                type: 'component',
                component: 'formModalExerciseEvent',
                meta: {
                  action: `/trainingCycle/${trainingCycle.id}/day/${day.id}?/newExerciseEvent`,
                  title: 'Add Exercise',
                  formProps: {
                    showDate: false,
                    showDifficulty: false,
                    showMigrationOption: false,
                    exercises,
                  },
                },
              })}
          >
            <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
            <span>Add Exercise</span>
          </button>
        </div>
        <ListExerciseEvent {exercises} exerciseEvents={day.exercises} showDate={false} />
      </div>
    {/each}
  </div>
</div>
