<script lang="ts">
  import type { Prisma } from '@prisma/client';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import DateField from '../fields/DateField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = false;
  export let trainingPrograms: Prisma.TrainingProgramGetPayload<{
    select: {
      id: true;
      name: true;
    };
  }>[];
</script>

<DateField name="startDate" field="startDate" form={superForm} />

<SelectField
  name="trainingProgramId"
  field="trainingProgramId"
  label="Training Program"
  form={superForm}
>
  {#each trainingPrograms as trainingProgram}
    <option value={trainingProgram.id}>{trainingProgram.name}</option>
  {/each}
</SelectField>

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
