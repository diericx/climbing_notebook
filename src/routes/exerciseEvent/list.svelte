<script lang="ts">
	import { confirmDelete } from '$lib/utils';
	import type { ExerciseEvent } from '@prisma/client';

	export let exerciseEvents: ExerciseEvent[];
</script>

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
			{#each exerciseEvents as exerciseEvent}
				<tr>
					<td>{new Date(exerciseEvent.date).toLocaleDateString('en-US')}</td>
					<td>{exerciseEvent.name}</td>
					<td>{exerciseEvent.weight}</td>
					<td>{exerciseEvent.difficulty}</td>
					<td class="px-6 py-3">{exerciseEvent.notes}</td>
					<td>
						<form method="POST" action="?/delete" class="inline">
							<input type="hidden" name="id" value={exerciseEvent.id} />
							<button formaction="?/delete" on:click={confirmDelete}>Delete</button>
						</form>
						<a href="/exerciseEvent/{exerciseEvent.id}/edit?redirectTo=/exerciseEvent">Edit</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
