<script lang="ts">
  import { page } from '$app/stores';
</script>

<h1>{$page.error?.status || $page.status}</h1>
<h3>{$page.error?.message}</h3>
