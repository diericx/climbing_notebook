<script lang="ts">
	import type { PageData } from './$types';

	import EventForm from './eventForm.svelte';
	import { TrainingEvent } from '$lib/trainingEvents';

	export let data: PageData;
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
		<EventForm trainingEventTemplatesHidden newTrainingEvent={new TrainingEvent()} />
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
