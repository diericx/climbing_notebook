<script lang="ts">
  import TextField from './fields/TextField.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
</script>

<TextField name="description" field="description" form={superForm} />

<br />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
