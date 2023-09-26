<script lang="ts">
  import type { TrainingCycle } from '@prisma/client';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';
  import NumberField from '../fields/NumberField.svelte';
  import SelectField from '../fields/SelectField.svelte';
  import SubmitButton from '../fields/SubmitButton.svelte';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let showSubmitButton = true;
  export let trainingCyclesFromTrainingProgram: TrainingCycle[];
  export let ownedTrainingCycles: TrainingCycle[];
  export let savedTrainingCycles: TrainingCycle[];
  export let order: number;
</script>

<input type="hidden" name="order" value={order} />
<NumberField name="duration" field="duration" label="Duration (weeks)" form={superForm} />
<SelectField name="trainingCycleId" field="trainingCycleId" label="Training Cycle" form={superForm}>
  <option disabled>Cycles in this Program</option>
  {#each trainingCyclesFromTrainingProgram as c}
    <option value={c.id}>{c.name}</option>
  {/each}
  <option disabled>Cycles created by you</option>
  {#each ownedTrainingCycles as c}
    <option value={c.id}>{c.name}</option>
  {/each}
  <option disabled>Saved community Cycles</option>
  {#each savedTrainingCycles as c}
    <option value={c.id}>{c.name}</option>
  {/each}
</SelectField>

<br />

{#if showSubmitButton}
  <SubmitButton {superForm} />
{/if}
