<script lang="ts">
  import type { JournalEntrySchema } from '$lib/zodSchemas';
  import type { Infer } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import DateField from '../fields/DateField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';

  export let superForm: SuperForm<Infer<JournalEntrySchema>>;
  export let showSubmitButton = true;
</script>

<input type="hidden" name="type" value="climbing" />

<DateField name="date" field="date" form={superForm} />

<span class="text-gray-400"
  >Metrics will be detected and captured in your journal entries as long as they strictly follow the
  format below.
  <br />
  A name (letters or numbers), followed by a semicolon, followed by a number. An example will be shown
  below:
  <br />
  leftRingFingerA4PulleyPain: 4
</span>
<TextArea
  name="content"
  form={superForm}
  field="content"
  cols={40}
  rows={10}
  class="w-full"
  placeholder={`- Worked on 7b in Daone, first two moves dialled
- shoulder started to act up mid way through session but didn't affect performance

leftShoulderPain: 2`}
/>

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
