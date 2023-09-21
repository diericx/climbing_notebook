<script lang="ts">
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import type { Prisma } from '@prisma/client';
  import { Avatar, clipboard, toastStore } from '@skeletonlabs/skeleton';
  import type { Session } from 'lucia';
  import ListItem from '../ListItem.svelte';
  import FormButton from '../forms/FormButton.svelte';

  export let trainingCycle: Prisma.TrainingCycleGetPayload<{
    include: {
      owner: true;
      _count: {
        select: {
          saves: true;
        };
      };
      saves: true;
    };
  }>;
  export let session: Session | null;
  export let showVisibility = false;

  $: saves = trainingCycle.saves;
  $: isTrainingCycleSavedByUser = () => {
    return saves.find((s) => s.userId == session?.user.userId);
  };
</script>

<ListItem href={`/trainingCycle/${trainingCycle.id}`} showElipses={true}>
  <div slot="title">
    <div class="text-xl">
      <b>
        {trainingCycle.name}
      </b>
    </div>
    {#if showVisibility}
      <div class:text-emerald-400={trainingCycle.isPublic} class="font-bold text-gray-400">
        {trainingCycle.isPublic ? 'Public' : 'Private'}
      </div>
    {/if}
  </div>
  <div slot="popup-buttons">
    {#if session?.user.userId == trainingCycle.ownerId}
      <a class="btn btn-sm justify-start" href="/trainingCycle/{trainingCycle.id}/edit">
        <Icon icon="material-symbols:edit-outline" height="18" />
        <span> Edit </span>
      </a>

      <FormButton
        action={`/trainingCycle/${trainingCycle.id}?/duplicate&redirectTo=/trainingCycle`}
        class="btn btn-sm w-full justify-start"
      >
        <Icon icon="material-symbols:control-point-duplicate" height="18" />
        <span> Duplicate </span>
      </FormButton>

      {#if !trainingCycle.isPublic}
        <FormButton
          action={`/trainingCycle/${trainingCycle.id}?/publish`}
          class="btn btn-sm w-full justify-start"
          onSuccess={() => {
            toastStore.trigger({
              message:
                'Your Training Cycle is now public and will show up in the Community Training Cycles page.',
              timeout: 5000,
            });
          }}
        >
          <Icon icon="material-symbols:share" height="18" />
          <span> Publish </span>
        </FormButton>
        <button
          class="btn btn-sm w-full justify-start"
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

      {#if trainingCycle.isPublic}
        <FormButton
          action={`/trainingCycle/${trainingCycle.id}?/hide`}
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
        <div>
          <button
            class="btn btn-sm w-full justify-start"
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
        </div>
      {/if}
      <FormButton
        action={`/trainingCycle/${trainingCycle.id}?/delete`}
        class="btn btn-sm w-full justify-start"
        onClick={confirmDelete}
      >
        <Icon icon="mdi:trash-outline" height="18" />
        <span> Delete </span>
      </FormButton>
    {:else}
      <FormButton
        action={`/trainingCycle/${trainingCycle.id}?/duplicate&redirectTo=/trainingCycle`}
        class="btn btn-sm w-full justify-start"
      >
        <Icon icon="material-symbols:control-point-duplicate" height="18" />
        <span> Duplicate </span>
      </FormButton>
    {/if}
  </div>

  <div slot="content" style:height="100%" class="text-gray-400 flex flex-col justify-between">
    {#if trainingCycle.description}
      <div>
        {trainingCycle.description || ''}
      </div>
    {:else}
      <div class="italic">
        {'No description'}
      </div>
    {/if}
    <div>
      <hr class="border-gray-200 divider my-4 mb-2" />
      <div class="flex justify-between">
        <div class="text-gray-600 flex items-center">
          <Avatar
            class="text-white"
            width="w-9"
            initials={trainingCycle.owner.username}
            background="bg-primary-500"
          />
          <div class="ml-2 align-middle items-center">
            <div class="text-md leading-none font-bold">{trainingCycle.owner.username}</div>
          </div>
        </div>
        <div class="text-gray-600 flex items-center">
          {#if session != null && trainingCycle.ownerId != session.user.userId}
            {#if isTrainingCycleSavedByUser()}
              <FormButton
                action={`/trainingCycle/${trainingCycle.id}?/unsave`}
                class="btn btn-sm w-full justify-start"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Icon icon="material-symbols:bookmark" height="18" />
              </FormButton>
            {:else}
              <FormButton
                action={`/trainingCycle/${trainingCycle.id}?/save`}
                class="btn btn-sm w-full justify-start"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Icon icon="material-symbols:bookmark-outline" height="18" />
              </FormButton>
            {/if}
          {:else}
            <FormButton
              action={`/trainingCycle/${trainingCycle.id}?/save`}
              class="btn btn-sm w-full justify-start"
              onClick={(e) => {
                e.stopPropagation();
              }}
              disabled
            >
              <Icon icon="material-symbols:bookmark-outline" height="18" />
            </FormButton>
          {/if}
          <p>
            <b>{trainingCycle._count.saves} </b>
          </p>
        </div>
      </div>
    </div>
  </div>
</ListItem>
