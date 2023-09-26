<script context="module" lang="ts">
  export function getPageTitle(data: PageData) {
    return data?.trainingProgram?.name;
  }
</script>

<script lang="ts">
  import TrainingProgram from '$lib/components/TrainingProgram.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import Icon from '@iconify/svelte';
  import { Avatar, clipboard, toastStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
  $: session = data.session;
  $: trainingProgram = data.trainingProgram;

  $: isSaved = () => {
    return trainingProgram.saves.find((s) => s.userId == session?.user.userId) != undefined;
  };
</script>

<div class="flex flex-wrap mb-4 justify-between items-center">
  <div>
    <h1 class="font-bold">{trainingProgram.name}</h1>
  </div>
  <div class="flex space-x-2">
    {#if session?.user.userId == trainingProgram.ownerId}
      <div>
        <a class="btn btn-sm variant-ringed" href={`/trainingProgram/${trainingProgram.id}/edit`}>
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span> Edit </span>
        </a>
      </div>

      {#if trainingProgram.isPublic}
        <button
          class="btn btn-sm variant-ringed w-full justify-start"
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
      {:else if session?.user.userId == trainingProgram.ownerId}
        <button
          class="btn btn-sm variant-ringed w-full justify-start"
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
      {/if}
    {/if}

    <FormButton
      action={isSaved()
        ? `/trainingProgram/${trainingProgram.id}?/unsave`
        : `/trainingProgram/${trainingProgram.id}?/save`}
      disabled={session == undefined || session.user.userId == trainingProgram.ownerId}
      class="btn btn-sm hover:brightness-100 variant-ringed w-full justify-start"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Icon
        icon={isSaved() ? 'material-symbols:bookmark' : 'material-symbols:bookmark-outline'}
        height="18"
      />
      <span>{isSaved() ? 'Saved' : 'Save'}</span>
      <div
        class="bg-surface-200 px-2 rounded-full flex justify-center items-center hover:bg-gray-300"
      >
        <p>{trainingProgram._count.saves}</p>
      </div>
    </FormButton>
  </div>
</div>

<div class="mb-6">
  {#if trainingProgram.description}
    <div class="text-gray-400">
      {trainingProgram.description}
    </div>
  {:else}
    <div class="text-gray-400 italic">No description</div>
  {/if}
</div>

<div class="flex mb-8 items-center">
  <Avatar
    width="w-12"
    class="text-white"
    initials={trainingProgram.owner.username}
    background="bg-primary-500"
  />
  <div class="ml-3 align-middle items-center">
    <div class="text-gray-400 text-sm leading-none">Created by</div>
    <div class="leading-none mt-0 font-bold text-xl">{trainingProgram.owner.username}</div>
  </div>
</div>
<TrainingProgram {trainingProgram} />
