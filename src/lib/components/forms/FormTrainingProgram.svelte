<script lang="ts">
  import TextField from './fields/TextField.svelte';
  import Checkbox from './fields/Checkbox.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
</script>

<input type="hidden" name="type" value="climbing" />

<TextField name="name" field="name" form={superForm} />
<Checkbox name="isPublic" field="isPublic" form={superForm} />

<br />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
