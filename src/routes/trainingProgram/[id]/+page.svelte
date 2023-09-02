<script context="module" lang="ts">
  import type { PageData } from './$types';

  export function getPageTitle(data: PageData) {
    return data.trainingProgram.name;
  }
</script>
