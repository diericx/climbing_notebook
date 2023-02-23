<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<div class="grid grid-cols-1">
	<div>
		{data.trainingProgram.name}
	</div>
</div>
