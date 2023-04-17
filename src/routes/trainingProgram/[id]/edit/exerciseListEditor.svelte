<script lang="ts">
	export let exercises = [];
	export let removeExercise = (exercise) => {};
	export let addExercise = () => {};
</script>

<table class="mb-4">
	<thead>
		<tr>
			<th>Name</th>
			<th>Sets</th>
			<th>Reps</th>
			<th>Minutes</th>
			<th>Seconds</th>
			<th>Weight</th>
			<th>Notes</th>
			<th />
		</tr>
	</thead>
	<tbody>
		{#each exercises as exercise}
			<tr>
				<td><input bind:value={exercise.name} placeholder="Exercise name" /></td>
				<td
					><input
						style="width:75px"
						type="number"
						bind:value={exercise.sets}
						placeholder="# of sets"
					/></td
				>
				<td
					><input
						style="width:75px"
						type="number"
						bind:value={exercise.reps}
						placeholder="# of reps"
					/></td
				>
				<td><input style="width:75px" type="number" bind:value={exercise.minutes} /></td>
				<td><input style="width:75px" type="number" bind:value={exercise.seconds} /></td>
				<td
					><input
						style="width:75px"
						type="number"
						bind:value={exercise.weight}
						placeholder="weight"
					/></td
				>
				<td><input bind:value={exercise.notes} placeholder="Notes" /></td>
				<td>
					<button
						class="bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded"
						on:click={() => removeExercise(exercise)}>Delete</button
					>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<button
	class="bg-green-400 hover:bg-green-500 text-white font-bold px-2 rounded"
	on:click={() => addExercise()}>Add Exercise</button
>
