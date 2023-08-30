<script lang="ts">
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { doesTrainingCycleHaveLegacyExercises } from '$lib/trainingCycle';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore, popup } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;

  $: profile = data.profile;
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
        <div class="grid grid-cols-1 gap-4">
          {#each trainingCycles as p}
            <div class="block card card-hover">
              <a
                style="height: 100%;"
                class="flex flex-col justify-between"
                href={`/trainingCycle/${p.id}/edit`}
              >
                <div class="my-4 mx-4">
                  <div class="flex justify-between items-center">
                    <h2>
                      <b>
                        {p.name}
                      </b>
                    </h2>

                    <div class="flex">
                      <div>
                        <button
                          class="btn !bg-transparent justify-between"
                          use:popup={{
                            event: 'focus-click',
                            target: p.id.toString(),
                            placement: 'bottom-end',
                          }}
                          on:click={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <Icon icon="fe:elipsis-h" height="18" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {#if doesTrainingCycleHaveLegacyExercises(p)}
                  <section class="p-4">
                    <p class="text-red-500">
                      Contains legacy exercises. Edit the exercises in this cycle to migrate.
                    </p>
                  </section>
                {/if}
              </a>
            </div>
            <div id={p.id.toString()} class="card shadow-xl py-2" data-popup={p.id.toString()}>
              <nav class="list-nav">
                <ul>
                  <li>
                    <a class="btn btn-sm justify-start" href="/trainingCycle/{p.id}/edit">
                      <span> Edit </span>
                    </a>
                  </li>
                  <li>
                    <FormButton
                      action={`/trainingCycle/${p.id}?/duplicate&redirectTo=/trainingCycle`}
                      class="btn btn-sm w-full justify-start"
                    >
                      Duplicate
                    </FormButton>
                  </li>
                  <li>
                    <FormButton
                      action={`/trainingCycle/${p.id}?/delete`}
                      class="btn btn-sm w-full justify-start"
                      onClick={confirmDelete}
                    >
                      <span> Delete </span>
                    </FormButton>
                  </li>
                </ul>
              </nav>
              <div class="arrow bg-surface-100-800-token" />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
