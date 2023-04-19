<script lang="ts">
	import Chart from 'svelte-frappe-charts';
	import { evaluate } from 'mathjs';
	import { confirmDelete } from '$lib/utils';
	import { enhance } from '$app/forms';

	export let chart: Chart;
	// The objects (either exerciseEvent or metric) that we will be matching against.
	export let targetObjects = [];

	function dateToEUString(d: Date) {
		return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
	}

	// Init frappe charts data
	const today = new Date();
	const ayearAgo = new Date();
	ayearAgo.setDate(today.getDate() - 365);
	let chartData = {
		labels: [],
		datasets: [{ values: [] }],
		dataPoints: {},
		start: ayearAgo,
		end: today,
		discreteDomains: 0
	};

	// Get all the events that match the pattern
	let matchedObjects = targetObjects.filter((e) =>
		e.name.match(new RegExp(chart.patternToMatch, 'i'))
	);

	matchedObjects.forEach((e) => {
		// Calculate the score by applying the equation
		let score = evaluate(chart.equation, {
			sets: e.sets,
			reps: e.reps,
			weight: e.weight,
			minutes: e.minutes,
			seconds: e.seconds,
			value: e.value
		});

		// Add data in heatmap format
		chartData.dataPoints[Math.floor(new Date(e.date).getTime() / 1000)] = score;

		// NOTE: this functionality expects the events to be sorted by date
		let dataIndex = chartData.labels.findIndex((l) => l == dateToEUString(new Date(e.date)));
		if (dataIndex == -1) {
			// If the date label is not found, create it and the corresponding score
			// Inserted at head because list is sorted date descending
			chartData.labels = [dateToEUString(new Date(e.date)), ...chartData.labels];
			chartData.datasets[0].values = [score, ...chartData.datasets[0].values];
		} else {
			// If the date label is found, use the index to update the score
			chartData.datasets[0].values[dataIndex] += score;
		}
	});
</script>

<div class="rounded bg-white shadow p-4">
	<h2 class="inline">{chart.name}</h2>
	<div class="inline float-right">
		<a href={`/chart/${chart.id}/edit?redirectTo=/`}>Edit</a>
		<form method="POST" action={`/chart/${chart.id}/edit?/deleteChart`} class="inline" use:enhance>
			<input type="hidden" name="id" value={chart.id} />
			<button type="submit" on:click={confirmDelete}>Delete</button>
		</form>
	</div>
	<div class="overflow-scroll">
		<Chart data={chartData} type={chart.type} discreteDomains={0} height={170} />
	</div>
</div>
