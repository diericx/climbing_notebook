<script lang="ts" context="module">
  type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import type { SuperForm } from 'sveltekit-superforms/client';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';
  import TextField from '../fields/TextField.svelte';

  // Form action to execute
  export let superForm: SuperForm<T>;
  export let showSubmitButton = true;
</script>

<TextField name="name" field="name" form={superForm} />
<TextArea name="description" field="description" form={superForm}>
  <p class="text-gray-400">Be as detailed as possible</p>
</TextArea>

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
