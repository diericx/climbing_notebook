<script lang="ts">
  import type { TrainingCycleDaySchema } from '$lib/zodSchemas';
  import type { Infer } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextField from '../fields/TextField.svelte';

  export let superForm: SuperForm<Infer<TrainingCycleDaySchema>>;
  export let showSubmitButton = true;
</script>

<TextField name="description" field="description" form={superForm} />

<br />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
