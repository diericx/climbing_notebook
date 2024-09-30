<script lang="ts">
  import type { Prisma } from '@prisma/client';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import DateField from '../fields/DateField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = false;
  export let ownedTrainingPrograms: Prisma.TrainingProgramGetPayload<{
    select: {
      id: true;
      name: true;
    };
  }>[];
  export let savedTrainingPrograms: Prisma.TrainingProgramGetPayload<{
    select: {
      id: true;
      name: true;
    };
  }>[];

  // TODO: this is a hack to get around the fact that we are not parsing input from API calls
  // to typed variables or rich objects. That would be the root cause solution.
  const dateValue = superForm.fields.startDate.value;
  if (typeof $dateValue == 'string') {
    $dateValue = new Date($dateValue);
  }
</script>

<DateField name="startDate" field="startDate" form={superForm} />

<SelectField
  name="trainingProgramId"
  field="trainingProgramId"
  label="Training Program"
  form={superForm}
>
  <option disabled>Created by you</option>
  {#each ownedTrainingPrograms as trainingProgram}
    <option value={trainingProgram.id}>{trainingProgram.name}</option>
  {/each}
  <option disabled>Saved Community Programs</option>
  {#each savedTrainingPrograms as trainingProgram}
    <option value={trainingProgram.id}>{trainingProgram.name}</option>
  {/each}
</SelectField>

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
