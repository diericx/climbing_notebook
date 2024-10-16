<script lang="ts">
  import type { ProjectSessionSchema } from '$lib/zodSchemas';
  import type { Infer } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import Checkbox from '../fields/Checkbox.svelte';
  import DateField from '../fields/DateField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';

  export let superForm: SuperForm<Infer<ProjectSessionSchema>>;
  export let showSubmitButton = true;
</script>

<Checkbox name="sent" field="sent" form={superForm} />
<DateField name="date" field="date" form={superForm} />
<TextArea name="notes" field="notes" form={superForm} />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
