<script context="module" lang="ts">
  export function getPageTitle(data: any) {
    return data.trainingProgram?.name;
  }
</script>

<script lang="ts">
  import TrainingProgram from '$lib/components/TrainingProgram.svelte';
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import type { PageData } from './$types';
  dayjs.extend(localizedFormat);

  export let data: PageData;

  $: trainingProgram = data.trainingProgram;
  $: session = data.session;
</script>

<TrainingProgram user={session?.user} {trainingProgram} />
