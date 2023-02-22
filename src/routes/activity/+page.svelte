<script lang="ts">
	import type { PageData, ActionData } from './$types';

	import EventForm from '../activity/form.svelte';
	import { TrainingEventFormData } from '$lib/trainingEvent';

	export let data: PageData;
	export let form: ActionData;
	const trainingEventInput: TrainingEventFormData =
		(form?.trainingEventInput as TrainingEventFormData) || new TrainingEventFormData();
	const recoveryPoints = data.workPoints - data.recoveryPoints;
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>New Activity</h2>
		<EventForm labelHidden typeHidden amountUnitHidden pointsPerUnitHidden {trainingEventInput} />
	</div>
</div>

<div class="pt-8">
	<h2>All Activities and Recovery Info</h2>
	<p><b>Recovery Status:</b> {recoveryPoints > 0 ? '+' : ''}{recoveryPoints}</p>
	<p class="text-gray-400">
		Your recovery status is calculated by subtracting your Work Points from your Recovery Points
	</p>
	<div class="grid">
		<div class="relative overflow-x-auto border-2 rounded">
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
					{#each data.trainingEvents as item}
						<tr>
							<td class="px-6 py-3">{item.label}</td>
							<td class="px-6 py-3">{item.type}</td>
							<td class="px-6 py-3">{item.amount} {item.amountUnit}</td>
							<td class="px-6 py-3">{item.amount * item.pointsPerUnit}</td>
							<td class="px-6 py-3">
								<form method="POST" action="?/delete">
									<input type="hidden" name="id" value={item.id} />
									<button>delete</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
