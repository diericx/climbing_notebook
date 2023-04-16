<script lang="ts">
	import ChartForm from '../../form.svelte';
	import { ChartFormData } from '$lib/chart';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Either grab form data from the Sveltekit form obj,
	// or generate a new one from incoming page data
	const chartFormData: ChartFormData =
		(form?.chartFormData as ChartFormData) || ChartFormData.fromObject(data?.chart);

	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>Edit Chart</h1>
		<ChartForm action="?/editChart" {chartFormData} {redirectTo} />
	</div>
</div>
