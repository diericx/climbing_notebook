<script lang="ts">
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';
  import TextField from '../fields/TextField.svelte';

  // Form action to execute
  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
</script>

<TextField name="name" field="name" form={superForm} />
<TextArea name="description" field="description" form={superForm}>
  <p class="text-gray-400">Be as detailed as possible</p>
</TextArea>

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
