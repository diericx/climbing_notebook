<script context="module">
  export const pageTitle = 'Training Programs';
</script>

<script lang="ts">
  import ListItem from '$lib/components/ListItem.svelte';

  import List from '$lib/components/List.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { clipboard, modalStore, toastStore } from '@skeletonlabs/skeleton';
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import type { PageData } from './$types';
  dayjs.extend(localizedFormat);

  export let data: PageData;

  $: trainingPrograms = data.trainingPrograms;
</script>

<div class="flex justify-between mb-4">
  <h1>Training Programs</h1>
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

<p class="mb-8 text-gray-400">
  Training Programs allow you to schedule Training Cycles for any number of weeks.
</p>

<div>
  {#if trainingPrograms.length == 0}
    <p class="text-gray-400 italic">You have no training programs.</p>
  {:else}
    <List>
      {#each trainingPrograms as p}
        {@const durationWeeks = p.trainingProgramScheduledSlots.reduce(
          (acc, slot) => acc + slot.duration,
          0
        )}
        <ListItem href={`/trainingProgram/${p.id}/edit`}>
          <div slot="title">
            <div class="text-xl">
              <b>
                {p.name}
              </b>
            </div>
          </div>
          <div slot="popup-buttons">
            <a class="btn btn-sm justify-start" href="/trainingProgram/{p.id}/edit">
              <Icon icon="material-symbols:edit-outline" height="18" />
              <span> Edit </span>
            </a>
            <FormButton
              action={`/trainingProgram/${p.id}?/duplicate&redirectTo=/trainingProgram`}
              class="btn btn-sm w-full justify-start"
            >
              <Icon icon="material-symbols:control-point-duplicate" height="18" />
              <span> Duplicate </span>
            </FormButton>

            {#if !p.isPublic}
              <FormButton
                action={`/trainingProgram/${p.id}?/publish`}
                class="btn btn-sm w-full justify-start"
                onSuccess={() => {
                  toastStore.trigger({
                    message:
                      'Your Training Program is now public and will show up in the Community Training Programs page.',
                    timeout: 5000,
                  });
                }}
              >
                <Icon icon="material-symbols:share" height="18" />
                <span> Publish </span>
              </FormButton>
              <button
                class="btn btn-sm w-full justify-start"
                use:clipboard={`https://climbingnotebook.com/trainingProgram/${p.id}?token=${p.privateAccessToken}`}
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
                action={`/trainingProgram/${p.id}?/hide`}
                class="btn btn-sm w-full justify-start"
                onSuccess={() => {
                  toastStore.trigger({
                    message:
                      'Your Training Program is now hidden and will not show up in the Community Training Programs page.',
                    timeout: 5000,
                  });
                }}
              >
                <Icon icon="mdi:hide-outline" height="18" />
                <span> Hide </span>
              </FormButton>
              <div>
                <button
                  class="btn btn-sm w-full justify-start"
                  use:clipboard={`https://climbingnotebook.com/community/trainingProgram/${p.id}`}
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
            {/if}

            <FormButton
              action={`/trainingProgram/${p.id}?/delete`}
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
              {durationWeeks} week{durationWeeks > 0 ? 's' : ''}
            </div>
            <div>
              Created {dayjs(p.createdAt).format('L')}
            </div>
          </div>
        </ListItem>
      {/each}
    </List>
  {/if}
</div>
