<script lang="ts">
  import type { TrainingCycle } from '@prisma/client';
  import { clipboard, modalStore } from '@skeletonlabs/skeleton';
  let trainingCycle = $modalStore[0]?.meta?.trainingCycle as TrainingCycle;
  const publicUrl = `https://climbingnotebook.com/trainingCycle/${trainingCycle.id}`;
</script>

<div class="card w-modal">
  <header class="card-header">
    <h2 class="font-bold">Training Cycle Published</h2>
  </header>
  <section class="p-4">
    <p class="mb-4">This Training Cycle is now public. You can view it at the link below!</p>
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
