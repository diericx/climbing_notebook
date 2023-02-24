<script lang="ts">
	import type { PageData, ActionData } from './$types';

	import ExerciseEventForm from './form.svelte';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';

	export let data: PageData;
	export let form: ActionData;
	const exerciseEventFormData: ExerciseEventFormData =
		(form?.journalEntryFormData as ExerciseEventFormData) ||
		new ExerciseEventFormData({ difficulty: 0 });

	function confirmDelete(e: MouseEvent) {
		if (!confirm('Are you sure you want to delete this exercise?')) {
			e.preventDefault();
		}
	}
</script>

{#if form?.message}<p class="error">{form?.message}</p>{/if}

<br />

<div class="grid grid-cols-1">
	<div>
		<h2>New</h2>
		<ExerciseEventForm {exerciseEventFormData} />
	</div>
</div>

<div class="pt-8">
	<h2>Training Exercise Log</h2>
	<hr />
	<br />

	<div>
		<table>
			<thead>
				<tr>
					<th>Date</th>
					<th>Name</th>
					<th>Weight</th>
					<th>Difficulty</th>
					<th>Notes</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#each data.exerciseEvents as item}
					<tr>
						<td>{new Date(item.date).toLocaleDateString('en-US')}</td>
						<td>{item.name}</td>
						<td>{item.weight}</td>
						<td>{item.difficulty}</td>
						<td class="px-6 py-3">{item.notes}</td>
						<td>
							<form method="POST" action="?/delete" class="inline">
								<input type="hidden" name="id" value={item.id} />
								<button formaction="?/delete" on:click={confirmDelete}>Delete</button>
							</form>
							<a href="/trainingLog/{item.id}/edit?redirectTo=/trainingLog">Edit</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
