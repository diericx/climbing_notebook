<script context="module">
  import { page } from '$app/stores';
  import { get } from 'svelte/store';

  export const pageTitle = get(page).data.trainingProgram?.name;
</script>
