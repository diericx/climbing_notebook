<script lang="ts">
  import List from '$lib/components/List.svelte';
  import ListItem from '$lib/components/ListItem.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: trainingProgram = data.trainingProgram;
</script>

<h1 class="mb-12 font-bold">Editing {trainingProgram.name}</h1>

<div class="mb-12">
  <div class="text-xl">Details</div>
  <hr class="mb-2" />

  <div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
    <div class="flex justify-between">
      <div>
        <p>
          <b>Name: </b>
          {trainingProgram.name}
        </p>
        <p>
          <b>Description: </b>
          {trainingProgram.description}
        </p>
      </div>
      <div>
        <button
          class="btn btn-sm variant-ringed"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalTrainingProgram',
              meta: {
                data: trainingProgram,
                action: `/trainingProgram/${trainingProgram.id}?/edit`,
                title: 'Edit Training Program',
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

<div class="mb-12">
  <div class="mb-2 flex justify-between">
    <div>
      <div class="text-xl">Training Cycles</div>
    </div>
    <div>
      <button
        class="btn btn-sm variant-filled"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalTrainingCycle',
            meta: {
              action: `/trainingProgram/${trainingProgram.id}?/addTrainingCycle`,
              title: 'Add Training Cycle',
            },
          })}
      >
        <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
        <span>Add Cycle</span>
      </button>
    </div>
  </div>
  <hr />

  <div>
    {#if trainingProgram.trainingCycles.length == 0}
      <p class="text-gray-400 italic">You have no training programs.</p>
    {:else}
      <List>
        {#each trainingProgram.trainingCycles as c}
          <ListItem href={`/trainingCycle/${c.id}/edit`}>
            <div slot="title">
              <h2>
                <b>
                  {c.name}
                </b>
              </h2>
            </div>
            <div slot="popup-buttons">
              <FormButton
                action={`/trainingCycle/${c.id}?/delete`}
                class="btn btn-sm w-full justify-start"
                onClick={confirmDelete}
              >
                <span> Delete </span>
              </FormButton>
            </div>
          </ListItem>
        {/each}
      </List>
    {/if}
  </div>
</div>

<div class="mb-12">
  <div class="mb-2 flex justify-between">
    <div>
      <div class="text-xl">Scheduling</div>
    </div>
    <div>
      <button
        class="btn btn-sm variant-filled"
        on:click={() =>
          modalStore.trigger({
            type: 'component',
            component: 'formModalTrainingProgramScheduledSlot',
            meta: {
              action: `/trainingProgram/${trainingProgram.id}?/addTrainingProgramScheduledSlot`,
              title: 'Add Slot',
              formProps: {
                trainingCycles: trainingProgram.trainingCycles,
                order: 0,
              },
            },
          })}
      >
        <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
        <span>Add Slot</span>
      </button>
    </div>
  </div>
  <hr />
  <div>
    {#if trainingProgram.trainingProgramScheduledSlots.length == 0}
      <p class="text-gray-400 italic">No scheduled slots.</p>
    {:else}
      <List>
        {#each trainingProgram.trainingProgramScheduledSlots as s}
          <ListItem>
            <div slot="title">
              Duration: {s.duration}
              <br />
              Cycle: {s.trainingCycles[0].name}
            </div>
            <div slot="popup-buttons">
              <FormButton
                action={`/trainingProgram/${trainingProgram.id}/scheduledSlot/${s.id}?/delete`}
                class="btn btn-sm w-full justify-start"
                onClick={confirmDelete}
              >
                <span> Delete </span>
              </FormButton>
            </div>
          </ListItem>
        {/each}
      </List>
    {/if}
  </div>
</div>
