<script context="module" lang="ts">
  export function getPageTitle(data: PageData) {
    return data?.trainingProgram?.name;
  }
</script>

<script lang="ts">
  import TrainingProgram from '$lib/components/TrainingProgram.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: session = data.session;
  $: trainingProgram = data.trainingProgram;
</script>

<TrainingProgram user={session?.user} {trainingProgram} />
