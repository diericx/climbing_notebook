<script lang="ts">
  import { enhance } from '$app/forms';
  import List from '$lib/components/List.svelte';
  import ListExerciseEvent from '$lib/components/ListExerciseEvent.svelte';
  import ListItem from '$lib/components/ListItem.svelte';
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
  <aside class="alert variant-ghost mb-8">
    <Icon icon="ep:warn-triangle-filled" height="18" />
    <div class="alert-message">
      <p>
        You are editing a public Training Cycle. Any changes made will be public, and will edit the
        previously shared version.
      </p>
    </div>
  </aside>

  <div class="mb-12 flex items-center justify-between">
    <div>
      <h1 class="font-bold inline">
        Editing {trainingCycle.name}
      </h1>
    </div>

    {#if !trainingCycle.isPublic && !trainingCycle.trainingProgramId}
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
    {/if}
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

    <List>
      {#each trainingCycle.exerciseGroups as group}
        <ListItem>
          <div slot="title">
            <div class="text-xl">
              <b>
                {group.name}
              </b>
            </div>
          </div>
          <div slot="popup-buttons">
            <button
              class="btn btn-sm w-full justify-start"
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
              class="btn-sm"
            >
              <div slot="form">
                <input type="hidden" name="exerciseGroupId" value={group.id} />
              </div>
              <Icon icon="mdi:trash-outline" height="18" />
              <span> Delete </span>
            </FormButton>
          </div>
          <div slot="content" class="mt-8">
            <div class="flex w-full items-center mb-2 mt-4">
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
        </ListItem>
      {/each}
    </List>
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
          <div class="mr-2 mb-6">
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
          <div class="flex flex-wrap w-full justify-between items-end">
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

          {#if day.exerciseGroups.length == 0}
            <div class="text-gray-400 italic">No groups</div>
          {/if}
          <List>
            {#each day.exerciseGroups as group}
              <ListItem>
                <div slot="title">
                  <div class="flex items-center md:space-x-3">
                    <div class="mr-2">
                      <Icon icon="material-symbols:list-alt" width="35" />
                    </div>
                    <div class="flex items-center md:space-x-8">
                      <div class="flex-1 min-w-0">
                        <p>{group.name}</p>
                        <p class="text-sm text-gray-400">
                          {group.exercises.length} exercises
                        </p>
                      </div>
                    </div>
                    <div class="flex-1" />
                    <div class="flex min-w-0 float-right space-x-2">
                      <slot name="buttons" {group} />
                    </div>
                  </div>
                </div>
                <div slot="popup-buttons">
                  <FormButton
                    action={`/trainingCycle/${trainingCycle.id}/day/${day.id}/?/disconnectExerciseGroup`}
                    class="btn btn-sm "
                  >
                    <div slot="form">
                      <input type="hidden" value={group.id} name="exerciseGroupId" />
                    </div>

                    <Icon icon="fluent:plug-disconnected-20-regular" height="18" />
                    <span class="ml-1 mr-1"> Disconnect </span>
                  </FormButton>
                </div>
              </ListItem>
            {/each}
          </List>
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
