<script lang="ts">
	import ChartForm from '../../form.svelte';
	import { ChartFormData } from '$lib/chart';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h1>Edit Chart</h1>
		<ChartForm
			action="?/editChart"
			chart={data.chart}
			chartFormData={new ChartFormData(form?.chartFormData)}
		/>
	</div>
</div>
