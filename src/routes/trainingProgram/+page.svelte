<script lang="ts">
  import { enhance } from '$app/forms';
  import { doesTrainingProgramHaveLegacyExercises } from '$lib/trainingProgram';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { modalStore, popup } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;

  $: profile = data.profile;
  $: trainingPrograms = data.trainingPrograms;
</script>

<div>
  <div>
    <div class="flex justify-between mb-4">
      <h1>Your Programs</h1>
      <div>
        <button
          class="btn btn-sm variant-filled"
          on:click={() =>
            modalStore.trigger({
              type: 'component',
              component: 'formModalTrainingProgram',
              meta: {
                action: `/trainingProgram?/new`,
                title: 'New Training Program',
              },
            })}
        >
          <Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
          <span>New Program</span>
        </button>
      </div>
    </div>

    <div>
      {#if trainingPrograms.length == 0}
        <p class="text-gray-400 italic">You have no training programs.</p>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each trainingPrograms as p}
            <div class="block card card-hover">
              <a
                style="height: 100%;"
                class="flex flex-col justify-between"
                href={`/trainingProgram/${p.id}`}
              >
                <header class="card-header">
                  <div class="flex justify-between">
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
                </header>
                <section class="p-4">
                  <p class="text-gray-400">
                    {profile?.activeTrainingProgramId == p.id ? 'Active' : 'Inactive'}
                    <br />
                    {p.isPublic ? 'Public' : 'Private'}
                  </p>
                  {#if doesTrainingProgramHaveLegacyExercises(p)}
                    <p class="text-red-500">
                      Contains legacy exercises. Edit the exercises in this program to migrate.
                    </p>
                  {/if}
                </section>
                <footer class="card-footer">
                  <form method="POST" action={`/profile?/edit`} use:enhance>
                    <input type="hidden" name="activeTrainingProgramId" value={p.id} />
                    <button
                      class="btn btn-sm variant-ringed justify-start"
                      value="Activate"
                      disabled={profile?.activeTrainingProgramId == p.id}
                      on:click={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Activate
                    </button>
                  </form>
                </footer>
              </a>
            </div>
            <div id={p.id.toString()} class="card shadow-xl py-2" data-popup={p.id.toString()}>
              <nav class="list-nav">
                <ul>
                  <li>
                    <button
                      class="btn btn-sm w-full justify-start"
                      on:click={() =>
                        modalStore.trigger({
                          type: 'component',
                          component: 'modalShareTrainingProgram',
                          meta: {
                            trainingProgram: p,
                          },
                        })}
                    >
                      <span>Share</span>
                    </button>
                  </li>
                  <li>
                    <a class="btn btn-sm justify-start" href="/trainingProgram/{p.id}/edit">
                      <span> Edit </span>
                    </a>
                  </li>
                  <li>
                    <form
                      method="POST"
                      action={`/trainingProgram/${p.id}?/duplicate&redirectTo=/trainingProgram`}
                    >
                      <button class="btn btn-sm w-full justify-start"> Duplicate </button>
                    </form>
                  </li>
                  <li>
                    <form method="POST" action={`/trainingProgram/${p.id}?/delete`} use:enhance>
                      <button class="btn btn-sm w-full justify-start" on:click={confirmDelete}>
                        <span> Delete </span>
                      </button>
                    </form>
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
