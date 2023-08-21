<script lang="ts">
  import type { TrainingCycle } from '@prisma/client';
  import { clipboard, modalStore } from '@skeletonlabs/skeleton';
  let trainingCycle = $modalStore[0]?.meta?.trainingCycle as TrainingCycle;
  const publicUrl = `https://climbingnotebook.com/trainingCycle/${trainingCycle.id}`;
</script>

<div class="card w-modal">
  <header class="card-header">
    <h2 class="font-bold">Share Training Program</h2>
  </header>
  <section class="p-4">
    {#if !trainingCycle.isPublic}
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2"
        role="alert"
      >
        <span class="block sm:inline"
          >This program is not public and the link below will not work for other users until it is
          made public.</span
        >
      </div>
    {/if}
    <p class="mb-2">Here is the public link to your training program.</p>
    <div class="flex">
      <div class="border rounded p-2 w-fit bg-gray-100">
        {publicUrl}
      </div>
      <button class="btn ml-2 variant-filled" use:clipboard={publicUrl}>Copy</button>
    </div>
  </section>
  <footer class="card-footer float-right space-x-4">
    <button class="btn variant-ghost-surface" on:click={modalStore.close}>Close</button>
  </footer>
</div>
