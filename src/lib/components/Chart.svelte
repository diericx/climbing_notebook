<script lang="ts">
	import Chart from 'svelte-frappe-charts';
	import { evaluate } from 'mathjs';
	import { confirmDelete } from '$lib/utils';
	import { enhance } from '$app/forms';
	import type { ExerciseEvent, Metric } from '@prisma/client';
	import Icon from '@iconify/svelte';

	type DataSet = {
		name?: string;
		values: number[];
	};
	type DataPoints = {
		[key: number]: number;
	};
	type ChartData = {
		labels: string[];
		datasets: DataSet[];
		dataPoints: DataPoints;
		start: Date;
		end: Date;
		discreteDomains: number;
	};

	export let chart: Chart;
	// The objects (either exerciseEvent or metric) that we will be matching against.
	export let exerciseEvents: ExerciseEvent[] = [];
	export let metrics: Metric[] = [];

	function dateToEUString(d: Date) {
		return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
	}

	function addDataPoint(d: Date, v: number) {
		// Add data in heatmap format
		chartData.dataPoints[Math.floor(d.getTime() / 1000)] = v;

		// NOTE: this functionality expects the events to be sorted by date
		let dataIndex = chartData.labels.findIndex((l) => l == dateToEUString(d));
		if (dataIndex == -1) {
			// If the date label is not found, create it and the corresponding score
			// Inserted at head because list is sorted date descending
			chartData.labels = [dateToEUString(d), ...chartData.labels];
			chartData.datasets[0].values = [v, ...chartData.datasets[0].values];
		} else {
			// If the date label is found, use the index to update the score
			chartData.datasets[0].values[dataIndex] = v;
		}
	}

	// Init frappe charts data
	const today = new Date();
	const ayearAgo = new Date();
	ayearAgo.setDate(today.getDate() - 365);
	let chartData = {
		labels: [],
		datasets: [{ values: [] } as DataSet],
		dataPoints: {} as DataPoints,
		start: ayearAgo,
		end: today,
		discreteDomains: 0
	} as ChartData;

	// Get all the events that match the pattern
	let matchedExerciseEvents = exerciseEvents.filter((e) =>
		e.name.match(new RegExp(chart.patternToMatch, 'i'))
	);
	let matchedMetrics = metrics.filter((e) => e.name.match(new RegExp(chart.patternToMatch, 'i')));

	matchedExerciseEvents.forEach((e) => {
		if (e.date == undefined) {
			return;
		}
		// Calculate the score by applying the equation
		let score = evaluate(chart.equation, {
			sets: e.sets,
			reps: e.reps,
			weight: e.weight,
			minutes: e.minutes,
			seconds: e.seconds
		});

		addDataPoint(e.date, score);
	});
	matchedMetrics.forEach((e) => {
		if (e.date == undefined) {
			return;
		}
		// Calculate the score by applying the equation
		let score = evaluate(chart.equation, {
			value: e.value
		});

		addDataPoint(e.date, score);
	});
</script>

<div class="card p-4">
	<h2 class="inline">{chart.name}</h2>
	<div class="inline float-right">
		<a class="btn btn-sm variant-ringed" href={`/chart/${chart.id}/edit?redirectTo=/`}>
			<Icon icon="material-symbols:edit-outline" height="18" />
			<span>Edit</span>
		</a>
		<form method="POST" action={`/chart/${chart.id}/edit?/deleteChart`} class="inline" use:enhance>
			<input type="hidden" name="id" value={chart.id} />
			<button class="btn btn-sm variant-ringed" type="submit" on:click={confirmDelete}>
				<Icon icon="mdi:trash-outline" height="18" />
				Delete
			</button>
		</form>
	</div>
	<div class="overflow-scroll">
		<Chart data={chartData} type={chart.type} discreteDomains={0} height={170} />
	</div>
</div>
