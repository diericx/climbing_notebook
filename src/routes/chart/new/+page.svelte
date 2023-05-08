<script lang="ts">
	import ChartForm from '$lib/components/forms/FormChart.svelte';
</script>

<div class="grid grid-cols-1">
	<div>
		<h1>New Chart</h1>
		<ChartForm action="?/newChart" />
	</div>
</div>
