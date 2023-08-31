<script lang="ts">
  import List from '$lib/components/List.svelte';
  import ListItem from '$lib/components/ListItem.svelte';
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import { confirmDelete } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import { Avatar } from '@skeletonlabs/skeleton';
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import type { PageData } from './$types';
  dayjs.extend(localizedFormat);

  export let data: PageData;
  const { user } = data;

  $: trainingCycles = data.trainingCycles;
</script>

<div>
  <div>
    <h1>Community Training Cycles</h1>

    <p class="mb-8 text-gray-400">
      Find Training Cycles made by the community! Import them into your account to use them in your
      own Training Programs.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      {#if trainingCycles.length == 0}
        <p class="text-gray-400 italic">You have no training cycles.</p>
      {:else}
        <List>
          {#each trainingCycles as p}
            <ListItem
              href={`/community/trainingCycle/${p.id}`}
              showElipses={p.ownerId == user?.userId}
            >
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
                  action={`/trainingCycle/${p.id}?/delete`}
                  class="btn btn-sm w-full justify-start"
                  onClick={confirmDelete}
                >
                  <Icon icon="mdi:trash-outline" height="18" />
                  <span> Delete </span>
                </FormButton>
              </div>
              <div slot="content" class="text-gray-400">
                <div>
                  {p.description || ''}
                </div>
                <hr class="border-gray-200 divider my-4 mb-2" />
                <div class="flex justify-between">
                  <div class="text-gray-600 flex items-center">
                    <Avatar
                      class="text-white"
                      width="w-9"
                      initials={p.owner.username}
                      background="bg-primary-500"
                    />
                    <div class="ml-2 align-middle items-center">
                      <div class="text-md leading-none font-bold">{p.owner.username}</div>
                    </div>
                  </div>
                  <div class="text-gray-600 flex items-center">
                    <p>
                      Used <b>{p.useCount} time{p.useCount == 1 ? '' : 's'}</b>
                    </p>
                  </div>
                </div>
              </div>
            </ListItem>
          {/each}
        </List>
      {/if}
    </div>
  </div>
</div>
