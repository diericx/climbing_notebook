<script lang="ts">
  import S3Avatar from '$lib/components/S3Avatar.svelte';
  import { renderMarkdown } from '$lib/utils';
  import type { PageData } from './$types';

  export let data: PageData;
  $: journalEntry = data.journalEntry;
  const { s3ObjectUrlPromises } = data;
</script>

<div>
  <div class="flex mb-8 items-center">
    <S3Avatar
      key={journalEntry.owner.profile?.imageS3ObjectKey}
      {s3ObjectUrlPromises}
      width="w-12"
      class="text-white"
      initials={journalEntry.owner.username}
      background="bg-primary-500"
    />
    <div class="ml-3 align-middle items-center">
      <div class="text-gray-400 text-sm leading-none">Written by</div>
      <div class="leading-none mt-0 font-bold text-xl">{journalEntry.owner.username}</div>
    </div>
  </div>
</div>
<div class="font-eb-garamond journal-markdown-content">
  {#if typeof window !== 'undefined'}
    {@html await renderMarkdown(journalEntry.content)}
  {/if}
</div>
