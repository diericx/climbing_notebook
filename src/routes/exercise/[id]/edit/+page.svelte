<script lang="ts">
  import Form from '$lib/components/forms/Form.svelte';
  import FormBodyExercise from '$lib/components/forms/bodies/FormBodyExercise.svelte';
  import { exerciseSchema } from '$lib/exercise';
  import type { PageData } from './$types';

  export let data: PageData;

  $: exercise = data.exercise;
</script>

<h1 class="mb-4">Edit Exercise</h1>

<Form
  action={`/exercise/${exercise.id}?/edit&redirectTo=/exercise`}
  data={exercise}
  resetForm={true}
  schema={exerciseSchema}
  let:superForm
>
  <FormBodyExercise {superForm} />
</Form>
