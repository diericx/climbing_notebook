<script context="module">
  export const pageTitle = 'Training Cycles';
</script>

<script lang="ts">
  import List from '$lib/components/List.svelte';
  import ListItem from '$lib/components/ListItem.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { clipboard, modalStore, toastStore } from '@skeletonlabs/skeleton';
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import type { PageData } from './$types';

  dayjs.extend(localizedFormat);

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
                  <Icon icon="material-symbols:edit-outline" height="18" />
                  <span> Edit </span>
                </a>

                <FormButton
                  action={`/trainingCycle/${p.id}?/duplicate&redirectTo=/trainingCycle`}
                  class="btn btn-sm w-full justify-start"
                >
                  <Icon icon="material-symbols:control-point-duplicate" height="18" />
                  <span> Duplicate </span>
                </FormButton>

                {#if !p.isPublic}
                  <FormButton
                    action={`/trainingCycle/${p.id}?/publish`}
                    class="btn btn-sm w-full justify-start"
                    onSuccess={() => {
                      modalStore.trigger({
                        type: 'component',
                        component: 'modalShareTrainingCycle',
                        meta: {
                          trainingCycle: p,
                        },
                      });
                    }}
                  >
                    <Icon icon="material-symbols:share" height="18" />
                    <span> Publish </span>
                  </FormButton>
                  <button
                    class="btn btn-sm w-full justify-start"
                    use:clipboard={`https://climbingnotebook.com/trainingCycle/${p.id}?token=${p.privateAccessToken}`}
                    on:click={() => {
                      toastStore.trigger({
                        message: 'Private URL copied',
                      });
                    }}
                  >
                    <Icon icon="ph:link-bold" height="18" />
                    <span> Copy Private URL </span>
                  </button>
                {/if}

                {#if p.isPublic}
                  <FormButton
                    action={`/trainingCycle/${p.id}?/hide`}
                    class="btn btn-sm w-full justify-start"
                    onSuccess={() => {
                      toastStore.trigger({
                        message:
                          'Your Training Cycle is now hidden and will not show up in the Community Training Cycles page.',
                        timeout: 5000,
                      });
                    }}
                  >
                    <Icon icon="mdi:hide-outline" height="18" />
                    <span> Hide </span>
                  </FormButton>
                {/if}
                <FormButton
                  action={`/trainingCycle/${p.id}?/delete`}
                  class="btn btn-sm w-full justify-start"
                  onClick={confirmDelete}
                >
                  <Icon icon="mdi:trash-outline" height="18" />
                  <span> Delete </span>
                </FormButton>
              </div>
              <div slot="content" class="text-gray-400">
                {#if p.isPublic}
                  <div class="text-green-400">Public</div>
                {/if}
                <div>
                  Created {dayjs(p.createdAt).format('L')}
                </div>
              </div>
            </ListItem>
          {/each}
        </List>
      {/if}
    </div>
  </div>
</div>
