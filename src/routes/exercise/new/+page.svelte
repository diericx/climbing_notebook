<script lang="ts">
  import FormExercise from '$lib/components/forms/FormExercise.svelte';
</script>

<h1 class="mb-4">New Exercise</h1>

<FormExercise action={'/exercise?/new'} />
