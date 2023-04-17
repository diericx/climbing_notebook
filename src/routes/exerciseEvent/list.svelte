<script lang="ts">
	import { enhance } from '$app/forms';
	import { confirmDelete } from '$lib/utils';
	import type { ExerciseEvent } from '@prisma/client';

	export let showDate = true;
	export let showDifficulty = true;
	export let redirectTo = '/exerciseEvent';
	export let exerciseEvents: ExerciseEvent[];
</script>

<div>
	<table>
		<thead>
			<tr>
				{#if showDate}
					<th>Date</th>
				{/if}
				<th>Name</th>
				<th>SxR</th>
				<th>Time</th>
				<th>Weight</th>
				{#if showDifficulty}
					<th>Difficulty</th>
				{/if}
				<th>Notes</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each exerciseEvents as exerciseEvent}
				<tr>
					{#if showDate}
						<td>{new Date(exerciseEvent.date).toLocaleDateString('en-US')}</td>
					{/if}
					<td>{exerciseEvent.name}</td>
					<td>{exerciseEvent.sets}x{exerciseEvent.reps}</td>
					<td>{exerciseEvent.minutes}m{exerciseEvent.seconds}s</td>
					<td>{exerciseEvent.weight}</td>
					{#if showDifficulty}
						<td>{exerciseEvent.difficulty}</td>
					{/if}
					<td class="px-6 py-3">{exerciseEvent.notes}</td>
					<td>
						<form method="POST" action="?/deleteExerciseEvent" class="inline" use:enhance>
							<input type="hidden" name="id" value={exerciseEvent.id} />
							<button on:click={confirmDelete}>Delete</button>
						</form>
						<a href={`/exerciseEvent/${exerciseEvent.id}/edit?redirectTo=${redirectTo}`}>Edit</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
