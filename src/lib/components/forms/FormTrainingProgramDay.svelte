<script lang="ts">
  import type { TrainingProgramDay } from '@prisma/client';
  import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
  import Form from './Form.svelte';
  import TextField from './fields/TextField.svelte';
  import { v4 as uuidv4 } from 'uuid';
  import SubmitButton from './fields/SubmitButton.svelte';

  // Form action to execute
  export let action = '';
  export let data: TrainingProgramDay | undefined = undefined;
  export let onSuccess: (() => void) | undefined = undefined;
  export let id = uuidv4();
  export let showSubmitButton = true;
</script>

<Form schema={trainingProgramDaySchema} {data} {action} {id} {onSuccess} let:form let:delayed>
  <input type="hidden" name="type" value="climbing" />

  <TextField name="description" field="description" {form} />

  <br />

  {#if showSubmitButton}
    <SubmitButton formId={id} {delayed} />
  {/if}
</Form>
