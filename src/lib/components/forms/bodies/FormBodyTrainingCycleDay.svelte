<script lang="ts">
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextField from '../fields/TextField.svelte';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
</script>

<TextField name="description" field="description" form={superForm} />

<br />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
