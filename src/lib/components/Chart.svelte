<script lang="ts">
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import { Chart } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Colors,
		Tooltip,
		Legend,
		Title,
		TimeScale,
		LinearScale,
		LineController,
		BarController,
		LineElement,
		BarElement,
		PointElement
	} from 'chart.js';
	import { evaluate } from 'mathjs';
	import type { Dataset, ExerciseEvent, Metric } from '@prisma/client';
	import type { CustomQueryResults } from '$lib/customQuery';
	import { onMount } from 'svelte';
	import type { DatasetComplete } from '$lib/prisma';
	ChartJS.register(
		Colors,
		TimeScale,
		LinearScale,
		LineController,
		BarController,
		LineElement,
		PointElement,
		BarElement,
		Legend,
		Tooltip,
		Title
	);

	type ChartDataPoint = {
		x: string;
		y: number;
	};
	type ChartDataset = {
		label: string;
		data: ChartDataPoint[];
		pointHoverRadius: number;
		pointHitRadius: number;
		type: string;
		backgroundColor: string;
	};

	export let customQueryResults: CustomQueryResults[];
	export let datasets: DatasetComplete[];

	let equationErrorMessage: string | undefined = undefined;

	let chartDatasets: ChartDataset[] = [];
	for (const dataset of datasets) {
		const customQueryResult = customQueryResults.find(
			(r) => r.customQueryId == dataset.customQueryId
		);
		if (customQueryResult == undefined) {
			console.error('Could not find data for custom query: ', dataset.customQueryId);
			continue;
		}

		let chartDataset: ChartDataset = {
			pointHoverRadius: 5,
			pointHitRadius: 25,
			label: dataset.name,
			type: dataset.type,
			backgroundColor: dataset.color,
			data: []
		};
		function addDataPoint(dataPoint: ChartDataPoint) {
			let existingDatumIndex = chartDataset.data.findIndex((d) => d.x == dataPoint.x);
			if (existingDatumIndex != -1) {
				chartDataset.data[existingDatumIndex].y += dataPoint.y;
			} else {
				chartDataset.data.push(dataPoint);
			}
		}
		if (dataset.customQuery.table == 'exerciseEvent') {
			const data = customQueryResult.data as ExerciseEvent[];
			for (const e of data) {
				if (e.date) {
					let score = evaluate(dataset.equation, {
						sets: e.sets,
						reps: e.reps,
						weight: e.weight,
						minutes: e.minutes,
						seconds: e.seconds
					});
					addDataPoint({ x: e.date.toISOString().split('T')[0], y: score });
				}
			}
		} else if (dataset.customQuery.table == 'metric') {
			const data = customQueryResult.data as Metric[];
			for (const m of data) {
				if (m.date) {
					let score = evaluate(dataset.equation, {
						value: m.value
					});
					addDataPoint({ x: m.date.toISOString().split('T')[0], y: score });
				}
			}
		}
		chartDatasets.push(chartDataset);
	}

	// Chart resizes with window
	let chartComponent;
	onMount(() => {
		window.addEventListener('resize', function () {
			chartComponent.resize();
		});
	});
</script>

<div class="w-full" style="position: relative">
	{#if equationErrorMessage}
		<div class="overflow-scroll">
			<div class="invalid">Equation error: {equationErrorMessage}</div>
		</div>
	{/if}
	<Chart
		type={'line'}
		bind:chart={chartComponent}
		data={{ datasets: chartDatasets }}
		options={{
			responsive: true,
			interaction: {
				mode: 'point'
			},
			scales: {
				x: {
					type: 'time',
					time: {
						unit: 'day',
						round: 'day'
					}
				}
			},
			plugins: {
				legend: {
					display: true,
					labels: {
						color: 'rgb(255, 99, 132)'
					}
				},
				colors: {
					enabled: true
				}
			}
		}}
	/>
</div>
