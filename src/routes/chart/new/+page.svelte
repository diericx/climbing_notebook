<script lang="ts">
	import ChartForm from '$lib/components/forms/FormChart.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	$: formData = data.newChartForm;
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>New Chart</h1>
		<ChartForm action="?/newChart" data={formData} />
	</div>
</div>
