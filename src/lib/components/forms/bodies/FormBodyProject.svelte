<script lang="ts">
  import { gradeSystems, grades } from '$lib/utils';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import TextArea from '../fields/TextArea.svelte';
  import TextField from '../fields/TextField.svelte';

  // Form action to execute
  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;

  const { form } = superForm;
</script>

<TextField name="name" field="name" form={superForm} placeholder={'Alphane'} />

<TextArea name="notes" field="notes" form={superForm} placeholder={'A boulder in Chironico'} />

<SelectField name="gradeSystem" field="gradeSystem" form={superForm}>
  {#each gradeSystems as gradeSystem}
    <option value={gradeSystem}>{gradeSystem}</option>
  {/each}
</SelectField>

<!-- 
We render completely different Select fields because if we simply swap out the
values there is a bug where, upon changing values to an incompatible type,
the form itself is not updated and thus presents an error until the user
changes the value and then changes it back to what they want. -->
{#each gradeSystems as gradeSystem}
  <div class:hidden={$form.gradeSystem != gradeSystem}>
    <SelectField
      disabled={$form.gradeSystem != gradeSystem}
      name="grade"
      field="grade"
      form={superForm}
    >
      {#each grades[gradeSystem] as grade}
        <option value={grade}>{grade}</option>
      {/each}
    </SelectField>
  </div>
{/each}

<TextField name="url" field="url" form={superForm} />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
