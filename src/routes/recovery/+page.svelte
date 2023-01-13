<script type="ts">
	import { onMount } from 'svelte';
	import EventForm from './eventForm.svelte';
	import { TrainingEvent } from '$lib/trainingEvents.ts';
	/** @type {import('./$types').PageData} */
	export let data;

	let events = [
		{
			label: 'Bouldering',
			amountUnit: 'hour',
			pointsPerUnit: 10,
			type: 'training'
		},
		{
			label: 'Hard Route Climbing',
			amountUnit: 'hour',
			pointsPerUnit: 10,
			type: 'training'
		},
		{
			label: 'Weight Training',
			amountUnit: 'hour',
			pointsPerUnit: 10,
			type: 'training'
		},
		{
			label: 'Easy Climbing (at OS level or below)',
			amountUnit: 'hour',
			pointsPerUnit: 10,
			type: 'training'
		},
		{
			label: 'Sleep, hours before midnight',
			amountUnit: 'hour',
			pointsPerUnit: 3,
			type: 'recovery'
		},
		{
			label: 'Post-training meal',
			amountUnit: 'meal',
			pointsPerUnit: 2,
			type: 'recovery'
		},
		{
			label: 'Water',
			amountUnit: 'liter',
			pointsPerUnit: 1,
			type: 'recovery'
		},
		{
			label: 'Nap',
			amountUnit: 'nap',
			pointsPerUnit: 5,
			type: 'recovery'
		},
		{
			label: 'Easy Walk',
			amountUnit: 'walk',
			pointsPerUnit: 2,
			type: 'recovery'
		},
		{
			label: 'Easy cycle',
			amountUnit: 'walk',
			pointsPerUnit: 2,
			type: 'recovery'
		},
		{
			label: 'Hit Protein Goal',
			amountUnit: 'protein goal reached',
			pointsPerUnit: 3,
			type: 'recovery'
		},
		{
			label: 'Stretch for 15 min',
			amountUnit: 'stretch',
			pointsPerUnit: 1,
			type: 'recovery'
		}
	];

	let now = new Date(),
		month,
		day,
		year;
	let dateString = '';

	onMount(() => {
		(month = '' + (now.getMonth() + 1)), (day = '' + now.getDate()), (year = now.getFullYear());

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		dateString = [year, month, day].join('-');
	});

	let presetFormSelections = {
		type: 'training',
		amount: 0,
		event: trainingEvents()[0]
	};
	let customEventForm = {
		amount: 0,
		pointsPerUnit: 0
	};

	function trainingEvents() {
		return events.filter((event) => event.type == 'training') || [];
	}
	function recoveryEvents() {
		return events.filter((event) => event.type == 'recovery') || [];
	}

	function onPresetEventFormChange(_event) {
		if (presetFormSelections.type == 'training') {
			presetFormSelections.event = events.find((event) => event.label == _event.target.value);
		} else {
			presetFormSelections.event = events.find((event) => event.label == _event.target.value);
		}
	}
</script>

<div>
	<h1 class="text-gray-600">Recovery Tracker</h1>
	<hr />
</div>

<div class="flex justify-around">
	<div>
		<div
			class="{data.trainingPoints - data.recoveryPoints > 0
				? 'bg-orange-200'
				: 'bg-sky-200'} grid place-items-center rounded-full w-28 h-28 text-center"
		>
			<div class="text-5xl py-6 text-white">{data.trainingPoints - data.recoveryPoints}</div>
		</div>
	</div>
</div>

<div class="grid grid-cols-1 gap-4 px-4">
	<div>
		<h2>Add Preset Event</h2>
		<EventForm
			labelHidden
			typeHidden
			amountUnitHidden
			pointsPerUnitHidden
			newTrainingEvent={new TrainingEvent()}
		/>
	</div>
</div>

<div class="grid grid-cols-1 gap-4 px-4">
	<div>
		<h2>Add Custom Event</h2>
		<EventForm presetTrainingEventsHidden newTrainingEvent={new TrainingEvent()} />
	</div>
</div>

<h2>Today's Events</h2>
<hr />
<div class="grid">
	<div class="relative overflow-x-auto mx-8 border-2 rounded">
		<table class="w-full table-auto text-left text-gray-400">
			<thead class="bg-slate-50">
				<tr class="border-b-2">
					<th class="px-6 py-3">Label</th>
					<th class="px-6 py-3">Type</th>
					<th class="px-6 py-3">Amount</th>
					<th class="px-6 py-3">Points</th>
					<th class="px-6 py-3" />
				</tr>
			</thead>
			<tbody class="divide-y text-gray-600">
				{#each data.events as item}
					<tr>
						<td class="px-6 py-3">{item.label}</td>
						<td class="px-6 py-3">{item.type}</td>
						<td class="px-6 py-3">{item.amount} {item.amountUnit}</td>
						<td class="px-6 py-3">{item.amount * item.pointsPerUnit}</td>
						<td class="px-6 py-3"><button>delete</button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
