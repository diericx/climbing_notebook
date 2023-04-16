<script lang="ts">
	import ChartForm from '../form.svelte';
	import { ChartFormData } from '$lib/chart';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const chartFormData: ChartFormData =
		(form?.chartFormData as ChartFormData) || new ChartFormData();

	let redirectTo = form?.redirectTo || data.redirectTo || '';
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>New Chart</h1>
		<ChartForm action="?/newChart" {chartFormData} {redirectTo} />
	</div>
</div>
