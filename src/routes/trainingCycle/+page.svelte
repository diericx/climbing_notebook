<script lang="ts">
  import List from '$lib/components/List.svelte';
  import ListItem from '$lib/components/ListItem.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;

  $: trainingCycles = data.trainingCycles;
</script>

<div>
  <div>
    <div class="flex justify-between mb-4">
      <h1>Training Cycles</h1>
      <div>
        <button
          class="btn btn-sm variant-filled"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalTrainingCycle',
              meta: {
                action: `/trainingCycle?/new`,
                title: 'New Training Cycle',
              },
            })}
        >
          <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
          <span>New Cycle</span>
        </button>
      </div>
    </div>

    <p class="mb-8 text-gray-400">
      Training Cycles are one week long exercise plans. Here you can create shared Training Cycles
      that will be available to all of your <a class="link" href="/trainingProgram"
        >Training Programs</a
      > and widgets. You can also view the Cycles you have imported from the community.
    </p>

    <div>
      {#if trainingCycles.length == 0}
        <p class="text-gray-400 italic">You have no training cycles.</p>
      {:else}
        <List>
          {#each trainingCycles as p}
            <ListItem href={`/trainingCycle/${p.id}/edit`}>
              <div slot="title">
                <div class="text-xl">
                  <b>
                    {p.name}
                  </b>
                </div>
              </div>
              <div slot="popup-buttons">
                <a class="btn btn-sm justify-start" href="/trainingCycle/{p.id}/edit">
                  <span> Edit </span>
                </a>

                <FormButton
                  action={`/trainingCycle/${p.id}?/duplicate&redirectTo=/trainingCycle`}
                  class="btn btn-sm w-full justify-start"
                >
                  Duplicate
                </FormButton>
                <FormButton
                  action={`/trainingCycle/${p.id}?/delete`}
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
</div>
