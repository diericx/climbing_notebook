<script lang="ts">
  import type { TrainingCycleSchema } from '$lib/zodSchemas';
  import type { Infer } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';
  import TextField from '../fields/TextField.svelte';

  export let superForm: SuperForm<Infer<TrainingCycleSchema>>;
  export let showSubmitButton = true;
</script>

<TextField name="name" field="name" form={superForm} />
<TextArea name="description" field="description" form={superForm} />

<br />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
