<script lang="ts">
  import Checkbox from '../fields/Checkbox.svelte';
  import DateField from '../fields/DateField.svelte';
  import TextArea from '../fields/TextArea.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
</script>

<Checkbox name="sent" field="sent" form={superForm} />
<DateField name="date" field="date" form={superForm} />
<TextArea name="notes" field="notes" form={superForm} />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
