<script lang="ts">
  import Form from '$lib/components/forms/Form.svelte';
  import FormExercise from '$lib/components/forms/FormExercise.svelte';
  import { exerciseSchema } from '$lib/exercise';
</script>

<h1 class="mb-4">New Exercise</h1>

<Form action={'/exercise?/new'} resetForm={true} schema={exerciseSchema} let:superForm>
  <FormExercise {superForm} />
</Form>
