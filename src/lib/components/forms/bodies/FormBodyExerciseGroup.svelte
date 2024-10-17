<script lang="ts">
  import type { ExerciseGroupSchema } from '$lib/zodSchemas';
  import type { Infer } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextField from '../fields/TextField.svelte';

  export let superForm: SuperForm<Infer<ExerciseGroupSchema>>;
  export let showSubmitButton = true;
</script>

<input type="hidden" name="type" value="climbing" />

<TextField name="name" field="name" form={superForm} />

<br />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
