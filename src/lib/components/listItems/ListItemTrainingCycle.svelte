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
      owner: {
        include: {
          profile: {
            select: {
              imageS3ObjectKey: true;
            };
          };
        };
      };
      _count: {
        select: {
          saves: true;
        };
      };
      saves: true;
      activations: true;
    };
  }>;
  export let session: Session | null;
  export let showVisibility = false;
  export let onSuccessDuplicate = () => {};
  export let s3ObjectUrls: { [key: string]: string };

  $: saves = trainingCycle.saves;
  $: isTrainingCycleSavedByUser = () => {
    return saves.find((s) => s.userId == session?.user.userId);
  };
  $: isActive = trainingCycle.activations.find((a) => a.userId == session?.user.userId);
</script>

<ListItem href={`/trainingCycle/${trainingCycle.id}`} showElipses={true}>
  <div slot="title">
    <div class="text-xl">
      <b>
        {trainingCycle.name}
      </b>
    </div>
  </div>
  <div slot="popup-buttons">
    {#if session?.user.userId == trainingCycle.ownerId}
      <a class="btn btn-sm justify-start" href="/trainingCycle/{trainingCycle.id}/edit">
        <Icon icon="material-symbols:edit-outline" height="18" />
        <span> Edit </span>
      </a>

      <FormButton
        action={`/trainingCycle/${trainingCycle.id}?/duplicate`}
        class="btn btn-sm w-full justify-start"
        onSuccess={onSuccessDuplicate}
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
        action={`/trainingCycle/${trainingCycle.id}?/duplicate`}
        class="btn btn-sm w-full justify-start"
        onSuccess={onSuccessDuplicate}
      >
        <Icon icon="material-symbols:control-point-duplicate" height="18" />
        <span> Duplicate </span>
      </FormButton>
    {/if}
  </div>

  <div slot="content" style:height="100%" class="flex flex-col justify-between">
    {#if showVisibility}
      <div
        class:text-emerald-400={trainingCycle.isPublic}
        class:text-gray-400={!trainingCycle.isPublic}
        class="font-bold text-gray-400"
      >
        {trainingCycle.isPublic ? 'Public' : 'Private'}
      </div>
    {/if}
    {#if trainingCycle.description}
      <div class="text-gray-400">
        {trainingCycle.description || ''}
      </div>
    {:else}
      <div class="italic text-gray-400">
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
            src={trainingCycle.owner.profile?.imageS3ObjectKey
              ? s3ObjectUrls[trainingCycle.owner.profile.imageS3ObjectKey]
              : undefined}
            background="bg-primary-500"
          />
          <div class="ml-2 align-middle items-center">
            <div class="text-md leading-none font-bold">{trainingCycle.owner.username}</div>
          </div>
        </div>
        <div class="flex space-x-2">
          <div>
            {#if isActive}
              <FormButton
                action={`/trainingCycle/${trainingCycle.id}?/deactivate`}
                class="btn btn-sm variant-filled w-full justify-start"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span> Deactivate </span>
              </FormButton>
            {:else}
              <FormButton
                action={`/trainingCycle/${trainingCycle.id}?/activate`}
                class="btn btn-sm variant-ringed w-full justify-start"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span> Activate </span>
              </FormButton>
            {/if}
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
  </div>
</ListItem>
