<script lang="ts">
  import { journalEntrySchema } from '$lib/journalEntry';
  import { confirmDelete, fontGrades, gradeSystems, huecoGrades } from '$lib/utils';
  import type { Project } from '@prisma/client';
  import SelectField from './fields/SelectField.svelte';
  import TextField from './fields/TextField.svelte';
  import Form from './Form.svelte';
  import { v4 as uuidv4 } from 'uuid';
  import SubmitButton from './fields/SubmitButton.svelte';

  // Form action to execute
  export let action = '/project?/new';
  export let data: Project | undefined = undefined;
  export let onSuccess: (() => void) | undefined = undefined;
  export let id = uuidv4();
  export let showSubmitButton = true;

  // These are two way bindings from form values so the Modals can access
  export let submitting: boolean;
  export let delayed: boolean;
</script>

<Form
  schema={journalEntrySchema}
  {data}
  {action}
  {id}
  {onSuccess}
  bind:submitting
  bind:delayed
  resetForm={true}
  let:form
  let:formData
  let:delayed
>
  <input type="hidden" name="_formId" value={id} />
  <TextField name="name" field="name" {form} placeholder={'Alphane'} />
  <SelectField name="gradeSystem" field="gradeSystem" {form}>
    {#each gradeSystems as gradeSystem}
      <option value={gradeSystem}>{gradeSystem}</option>
    {/each}
  </SelectField>
  {#if formData?.gradeSystem == 'font'}
    <SelectField name="fontGrade" field="fontGrade" {form}>
      {#each fontGrades as grade}
        <option value={grade}>{grade}</option>
      {/each}
    </SelectField>
  {:else if formData?.gradeSystem == 'hueco'}
    <SelectField name="huecoGrade" field="huecoGrade" {form}>
      {#each huecoGrades as grade}
        <option value={grade}>{grade}</option>
      {/each}
    </SelectField>
  {/if}
  <TextField name="url" field="url" {form} />

  {#if showSubmitButton}
    <SubmitButton formId={id} {delayed} />
  {/if}
</Form>
