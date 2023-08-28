<script lang="ts">
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: trainingProgram = data.trainingProgram;
</script>

<h1 class="mb-10">Editing {trainingProgram.name}</h1>

<div class="mb-10">
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

<div class="mb-10">
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
      <div class="grid grid-cols-1 gap-4">
        {#each trainingProgram.trainingCycles as c}
          <div class="block card card-hover">
            <a
              style="height: 100%;"
              class="flex flex-col justify-between"
              href={`/trainingCycle/${c.id}/edit`}
            >
              <div class="my-4 mx-4">
                <div class="flex justify-between items-center">
                  <h2>
                    <b>
                      {c.name}
                    </b>
                  </h2>
                </div>
              </div>
            </a>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<div class="mb-10">
  <div class="text-xl">Scheduling</div>
  <hr class="mb-2" />
</div>
