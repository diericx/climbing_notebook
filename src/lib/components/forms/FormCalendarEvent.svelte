<script lang="ts">
  import TextArea from './fields/TextArea.svelte';
  import DateField from './fields/DateField.svelte';
  import TextField from './fields/TextField.svelte';
  import SubmitButton from './fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
</script>

<DateField name="dateStart" form={superForm} field="dateStart" />
<DateField name="dateEnd" form={superForm} field="dateEnd" />
<TextField name="title" form={superForm} field="title" placeholder={'Trip to Moab'} />
<TextField name="color" form={superForm} field="color" placeholder={'green'} />
<TextArea
  name="content"
  form={superForm}
  field="content"
  cols={40}
  rows={10}
  class="w-full"
  placeholder={'Going to Moab with Megan and Alex'}
/>
{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
