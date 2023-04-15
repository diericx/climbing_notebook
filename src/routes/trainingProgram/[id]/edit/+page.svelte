<!--
Notes:
- This component is effectively one complex form that is updating a single json object to be submitted
- Assumes group name uniqueness, if duplicates exist unexpected behavior will occur
-->
<script lang="ts">
	import { stringify } from 'postcss';
	import type { ActionData, PageData } from './$types';
	import ExerciseListEditor from './exerciseListEditor.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: trainingProgram = data.trainingProgram;

	let daysOfTheWeek = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];

	function addGroup() {
		// TODO: use classes for this
		trainingProgram.exerciseGroups = [
			...trainingProgram.exerciseGroups,
			{
				id: crypto.randomUUID(),
				trainingProgramId: trainingProgram.id,
				ownerId: trainingProgram.ownerId,
				name: '',
				exercises: []
			}
		];
	}

	function removeGroup(g) {
		trainingProgram.exerciseGroups = trainingProgram.exerciseGroups.filter((_g) => _g.id != g.id);
	}

	function addExercise(group) {
		// TODO: use classes for this
		group.exercises = [
			...group.exercises,
			{
				id: crypto.randomUUID(),
				name: '',
				sets: 0,
				reps: 0,
				weight: 0,
				notes: ''
			}
		];

		trainingProgram = { ...trainingProgram };
	}

	function removeExercise(e, group) {
		group.exercises = group.exercises.filter((_e) => _e.id != e.id);

		trainingProgram = { ...trainingProgram };
	}

	function addGroupToDayOnSubmit(e, dayIndex) {
		let formData = new FormData(e.target);
		let groupName = formData.get('groupName');

		// groupName can be null one some edge cases of browsers defaulting to disabled values
		if (groupName == null) {
			return;
		}

		trainingProgram.days[dayIndex].exerciseGroups = [
			...trainingProgram.days[dayIndex].exerciseGroups,
			{ name: groupName }
		];
	}

	function removeGroupFromDay(dayIndex, group) {
		trainingProgram.days[dayIndex].exerciseGroups = trainingProgram.days[
			dayIndex
		].exerciseGroups.filter((_g) => _g.name != group.name);
	}
</script>

<div class="bg-red-200 rounded">
	<p class="text-center px-4 py-4 mt-3 font-bold text-rose-600">
		WARNING: This page does not save automatically. You must hit the save buttons at the top or
		bottom.
	</p>
</div>

<br />

<div class="grid grid-cols-1">
	<div class="mb-5">
		<form method="POST" action="?/patchTrainingProgram">
			<input type="hidden" name="id" value={trainingProgram.id} />
			<input type="hidden" name="trainingProgram" value={JSON.stringify(trainingProgram)} />
			<button
				type="submit"
				class="bg-green-400 hover:bg-green-500 text-white font-bold px-8 py-2 rounded text-xl"
			>
				Save</button
			>
		</form>
	</div>

	<div class="mb-5">
		<label for="programName">Program Name</label>
		<br />
		<input
			id="programName"
			placeholder="Program Name"
			bind:value={trainingProgram.name}
			style="max-width: 300px"
		/>
	</div>

	<div class="mb-10">
		<div class="mb-5">
			<h1>
				<b>Exercise Groups</b>
			</h1>
			<p class="text-slate-400">
				Exercise groups can be applied to multiple week days. This is useful if you want a large
				group of exercises to be performed multiple times per week.
			</p>
		</div>

		{#each trainingProgram.exerciseGroups as group, i}
			<div class="rounded px-4 py-4 mb-4 bg-white shadow">
				<input
					class="mb-4"
					placeholder="Group Name"
					bind:value={group.name}
					style="max-width: 300px"
				/>
				<button
					class="float-right align-middle bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded"
					on:click={() => removeGroup(group)}>Delete Group</button
				>
				<ExerciseListEditor
					bind:exercises={group.exercises}
					addExercise={() => addExercise(group)}
					removeExercise={(e) => removeExercise(e, group)}
				/>
			</div>
		{/each}

		<button
			class="bg-green-400 hover:bg-green-500 text-white font-bold px-2 rounded"
			on:click={() => addGroup()}>Add Group</button
		>
	</div>

	<div class="mb-5">
		<h1>
			<b>Days</b>
		</h1>
		<p class="text-slate-400">Set exercises and exercise groups for each day of the week.</p>
	</div>

	<div>
		{#each trainingProgram.days as day, i}
			<h2>
				<b>{daysOfTheWeek[i]}</b>
			</h2>
			<div class="bg-white rounded px-4 py-4 mb-4 shadow">
				<input
					class="mb-4"
					name="dayDescription"
					placeholder="Day Description"
					bind:value={day.description}
					style="max-width: 300px"
				/>
				<h2>
					<b>Exercise Groups</b>
				</h2>
				<hr />
				<table>
					<thead>
						<th>Name</th>
						<th>Exercises</th>
						<th />
					</thead>
					<tbody>
						{#each day.exerciseGroups as group}
							<tr>
								<td>{group.name}</td>
								<td>
									{#each trainingProgram.exerciseGroups.find((_g) => {
										return _g.name == group.name;
									}).exercises as exercise}
										<p>
											- {exercise.name}
											{exercise.sets || 0}x{exercise.reps || 0}@{exercise.weight || 0}kg
										</p>
									{/each}
								</td>
								<td class="text-right">
									<button
										class="bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded"
										on:click={() => removeGroupFromDay(i, group)}>Remove Group</button
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="mb-5">
					<form on:submit|preventDefault={(e) => addGroupToDayOnSubmit(e, i)}>
						<select name="groupName">
							{#each trainingProgram.exerciseGroups as group}
								<option
									value={group.name}
									disabled={day.exerciseGroups.find((_g) => _g.name == group.name)}
								>
									{group.name}
								</option>
							{/each}
						</select>
						<br />
						<button
							class="bg-green-400 hover:bg-green-500 text-white font-bold px-2 rounded"
							type="submit">Add Group</button
						>
					</form>
				</div>

				<h2>
					<b>Exercises</b>
				</h2>
				<hr />
				<ExerciseListEditor
					bind:exercises={day.exercises}
					addExercise={() => addExercise(day)}
					removeExercise={(e) => removeExercise(e, day)}
				/>
			</div>
		{/each}
	</div>
	<div class="mb-5">
		<form method="POST" action="?/patchTrainingProgram">
			<input type="hidden" name="id" value={trainingProgram.id} />
			<input type="hidden" name="trainingProgram" value={JSON.stringify(trainingProgram)} />
			<button
				type="submit"
				class="bg-green-400 hover:bg-green-500 text-white font-bold px-8 py-2 rounded text-xl"
			>
				Save</button
			>
		</form>
	</div>
</div>
