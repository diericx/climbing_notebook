<script context="module" lang="ts">
  export function getPageTitle(data: any) {
    return data.trainingCycle?.name;
  }
</script>

<script lang="ts">
  import type { PageData } from './$types';

  import ReadMore from '$lib/components/ReadMore.svelte';
  import S3Avatar from '$lib/components/S3Avatar.svelte';
  import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import Icon from '@iconify/svelte';
  import { clipboard, toastStore } from '@skeletonlabs/skeleton';

  export let data: PageData;
  $: profile = data.profile;
  $: trainingCycle = data.trainingCycle;
  $: session = data.session;
  $: isSaved = () => {
    return trainingCycle.saves.find((s) => s.userId == session?.user.userId) != undefined;
  };
  const { s3ObjectUrlPromises } = data;
</script>

<div class="flex flex-wrap mb-4 justify-between items-center">
  <div>
    <h1 class="font-bold">{trainingCycle.name}</h1>
  </div>
  <div class="flex space-x-2">
    {#if session?.user.userId == trainingCycle.ownerId}
      <div>
        <a class="btn btn-sm variant-ringed" href={`/trainingCycle/${trainingCycle.id}/edit`}>
          <Icon icon="material-symbols:edit-outline" height="18" />
          <span> Edit </span>
        </a>
      </div>

      {#if trainingCycle.isPublic}
        <button
          class="btn btn-sm variant-ringed w-full justify-start"
          use:clipboard={`https://climbingnotebook.com/community/trainingCycle/${trainingCycle.id}`}
          on:click={() => {
            toastStore.trigger({
              message: 'Public URL copied',
            });
          }}
        >
          <Icon icon="ph:link-bold" height="18" />
          <span> Copy Public URL </span>
        </button>
      {:else if session?.user.userId == trainingCycle.ownerId}
        <button
          class="btn btn-sm variant-ringed w-full justify-start"
          use:clipboard={`https://climbingnotebook.com/trainingCycle/${trainingCycle.id}?token=${trainingCycle.privateAccessToken}`}
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
        ? `/trainingCycle/${trainingCycle.id}?/unsave`
        : `/trainingCycle/${trainingCycle.id}?/save`}
      disabled={session == undefined || session.user.userId == trainingCycle.ownerId}
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
        <p>{trainingCycle._count.saves}</p>
      </div>
    </FormButton>
  </div>
</div>

<div class="mb-6">
  {#if trainingCycle.description}
    <div class="text-gray-400 whitespace-pre-wrap">
      <ReadMore textContent={trainingCycle.description} maxChars={200} />
    </div>
  {:else}
    <div class="text-gray-400 italic">No description</div>
  {/if}
</div>

<div class="flex mb-8 items-center">
  <S3Avatar
    key={trainingCycle.owner.profile?.imageS3ObjectKey}
    {s3ObjectUrlPromises}
    width="w-12"
    class="text-white"
    initials={trainingCycle.owner.username}
    background="bg-primary-500"
  />
  <div class="ml-3 align-middle items-center">
    <div class="text-gray-400 text-sm leading-none">Created by</div>
    <div class="leading-none mt-0 font-bold text-xl">{trainingCycle.owner.username}</div>
  </div>
</div>

<WeeklyCalendar
  {profile}
  {trainingCycle}
  shouldScrollIntoView={false}
  disableActionButtons={true}
  showMarkedCompleted={false}
/>
