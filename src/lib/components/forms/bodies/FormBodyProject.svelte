<script lang="ts">
  import { fontGrades, gradeSystems, huecoGrades } from '$lib/utils';
  import SelectField from '../fields/SelectField.svelte';
  import TextField from '../fields/TextField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  // Form action to execute
  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;

  const { form } = superForm;
</script>

<TextField name="name" field="name" form={superForm} placeholder={'Alphane'} />
<SelectField name="gradeSystem" field="gradeSystem" form={superForm}>
  {#each gradeSystems as gradeSystem}
    <option value={gradeSystem}>{gradeSystem}</option>
  {/each}
</SelectField>
{#if $form?.gradeSystem == 'font'}
  <SelectField name="fontGrade" field="fontGrade" form={superForm}>
    {#each fontGrades as grade}
      <option value={grade}>{grade}</option>
    {/each}
  </SelectField>
{:else if $form?.gradeSystem == 'hueco'}
  <SelectField name="huecoGrade" field="huecoGrade" form={superForm}>
    {#each huecoGrades as grade}
      <option value={grade}>{grade}</option>
    {/each}
  </SelectField>
{/if}
<TextField name="url" field="url" form={superForm} />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
