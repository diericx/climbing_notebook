<script lang="ts">
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';
  import TextField from '../fields/TextField.svelte';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
</script>

<input type="hidden" name="type" value="climbing" />

<TextField name="name" field="name" form={superForm} />
<TextArea name="description" field="description" form={superForm} />

<br />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
