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
</script>

<!-- TODO: this modal doesn't seem to have the date value filled in... -->
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
