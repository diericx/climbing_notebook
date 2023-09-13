<script lang="ts">
  import List from '$lib/components/List.svelte';
  import ListItem from '$lib/components/ListItem.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { clipboard, modalStore, toastStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: trainingProgram = data.trainingProgram;
  $: trainingCycles = data.trainingCycles;
</script>

<div class="mb-4 flex items-center justify-between">
  <div>
    <h1 class="font-bold">Editing {trainingProgram.name}</h1>
  </div>
  <div class="flex space-x-2">
    {#if trainingProgram.isPublic}
      <div>
        <button
          class="btn btn-sm variant-filled w-full justify-start"
          use:clipboard={`https://climbingnotebook.com/community/trainingProgram/${trainingProgram.id}`}
          on:click={() => {
            toastStore.trigger({
              message: 'Public URL copied',
            });
          }}
        >
          <Icon icon="ph:link-bold" height="18" />
          <span> Copy Public URL </span>
        </button>
      </div>
      <FormButton
        action={`/trainingProgram/${trainingProgram.id}?/hide`}
        class="btn btn-sm variant-filled w-full justify-start"
        onSuccess={() => {
          toastStore.trigger({
            message:
              'Your Training Program is now hidden and will not show up in the Community Training Cycles page.',
            timeout: 5000,
          });
        }}
      >
        <Icon icon="mdi:hide-outline" height="18" />
        <span> Hide </span>
      </FormButton>
    {:else}
      <div>
        <button
          class="btn btn-sm variant-filled w-full justify-start"
          use:clipboard={`https://climbingnotebook.com/trainingProgram/${trainingProgram.id}?token=${trainingProgram.privateAccessToken}`}
          on:click={() => {
            toastStore.trigger({
              message: 'Private URL copied',
            });
          }}
        >
          <Icon icon="ph:link-bold" height="18" />
          <span> Copy Private URL </span>
        </button>
      </div>
      <FormButton
        action={`/trainingProgram/${trainingProgram.id}?/publish`}
        class="btn btn-sm variant-filled w-full justify-start"
        onSuccess={() => {
          toastStore.trigger({
            message:
              'Your Training Program is now public and will show up in the Community Training Cycles page.',
            timeout: 5000,
          });
        }}
      >
        <Icon icon="material-symbols:share" height="18" />
        <span> Publish </span>
      </FormButton>
    {/if}
  </div>
</div>
{#if trainingProgram.isPublic}
  <aside class="alert variant-ghost">
    <Icon icon="ep:warn-triangle-filled" height="18" />
    <div class="alert-message">
      <p>
        You are editing a public Training Program. Any changes made will be public, and will edit
        the previously shared version.
      </p>
    </div>
  </aside>
{/if}

<div class="pb-6" />

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
        <p>
          <b>Public: </b>
          {trainingProgram.isPublic}
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
              <div class="text-xl font-bold">
                {c.name}
              </div>
              <div class="text-gray-400">
                {c.description || ''}
              </div>
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
                trainingCyclesFromTrainingProgram: trainingProgram.trainingCycles,
                trainingCyclesFromAccount: trainingCycles,
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
      <div class="relative border-l border-gray-200">
        <List>
          {#each trainingProgram.trainingProgramScheduledSlots as s}
            {@const weeks = trainingProgram.trainingProgramScheduledSlots
              .map((_s) => (_s.order < s.order ? _s.duration : 0))
              .reduce((acc, cur) => acc + cur, 0)}
            <div class="ml-3">
              <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"
              />
              <div class="text-gray-300">Week {weeks + 1}</div>
              <ListItem>
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
                <div slot="title">
                  <div class="text-xl font-bold">
                    {s.trainingCycles[0].name}
                  </div>
                  {s.duration} week{s.duration == 1 ? '' : 's'}
                </div>
                <div slot="popup-buttons">
                  <button
                    class="btn btn-sm w-full justify-start"
                    on:click={() =>
                      modalStore.trigger({
                        type: 'component',
                        component: 'formModalTrainingProgramScheduledSlot',
                        meta: {
                          data: {
                            ...s,
                            trainingCycleId: s.trainingCycles[0]?.id,
                          },
                          action: `/trainingProgram/${trainingProgram.id}/scheduledSlot/${s.id}?/update`,
                          title: 'Edit Slot',
                          formProps: {
                            trainingCyclesFromTrainingProgram: trainingProgram.trainingCycles,
                            trainingCyclesFromAccount: trainingCycles,
                          },
                        },
                      })}
                  >
                    <span>Edit</span>
                  </button>
                  {#if s.order != 0}
                    <FormButton
                      action={`/trainingProgram/${trainingProgram.id}/scheduledSlot/${s.id}/?/move`}
                      class="btn btn-sm w-full justify-start"
                    >
                      <div slot="form">
                        <input type="hidden" name="order" value={s.order - 1} />
                      </div>
                      <span> Move Up </span>
                    </FormButton>
                  {/if}
                  {#if s.order != trainingProgram.trainingProgramScheduledSlots.length - 1}
                    <FormButton
                      action={`/trainingProgram/${trainingProgram.id}/scheduledSlot/${s.id}/?/move`}
                      class="btn btn-sm w-full justify-start"
                    >
                      <div slot="form">
                        <input type="hidden" name="order" value={s.order + 1} />
                      </div>
                      <span> Move Down </span>
                    </FormButton>
                  {/if}
                  <FormButton
                    action={`/trainingProgram/${trainingProgram.id}/scheduledSlot/${s.id}?/delete`}
                    class="btn btn-sm w-full justify-start"
                    onClick={confirmDelete}
                  >
                    <span> Delete </span>
                  </FormButton>
                </div>
              </ListItem>
            </div>
          {/each}
        </List>
      </div>
    {/if}
  </div>
</div>
