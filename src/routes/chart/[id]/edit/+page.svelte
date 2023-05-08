<script lang="ts">
	import ChartForm from '$lib/components/forms/FormChart.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
	$: newChartForm = data.newChartForm;
</script>

<div class="grid grid-cols-1">
	<div>
		<h1>Edit Chart</h1>
		<ChartForm action={`/chart/${$page.params.id}/edit?/edit`} data={newChartForm} />
	</div>
</div>
