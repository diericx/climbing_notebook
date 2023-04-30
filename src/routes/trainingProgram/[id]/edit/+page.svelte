<!--
Notes:
- This component is effectively one complex form that is updating a single json object to be submitted
- Assumes group name uniqueness, if duplicates exist unexpected behavior will occur
-->
<script lang="ts">
	import type { PageData } from './$types';
	import { beforeNavigate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Modal from '../../../Modal.svelte';
	import type { ExerciseEvent, ExerciseGroup } from '@prisma/client';
	import type { ExerciseGroupComplete, TrainingProgramDayComplete } from '$lib/prisma';
	import ExerciseEventForm from '../../../exerciseEvent/form.svelte';
	import ExerciseEventsList from '../../../exerciseEvent/list.svelte';
	import ExerciseGroupList from '../../groupList.svelte';
	import { ExerciseEventFormData } from '$lib/exerciseEvent';

	export let data: PageData;
	let scrollY: number;

	$: trainingProgram = data.trainingProgram;
	$: trainingProgramOriginal = data.trainingProgramOriginal;
	$: thereAreUnsavedChanges = () => {
		return JSON.stringify(trainingProgram) !== JSON.stringify(trainingProgramOriginal);
	};

	let daysOfTheWeek = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];

	// Add a confirmation before leaving if the user has changed anything without saving
	beforeNavigate((nav) => {
		if (thereAreUnsavedChanges()) {
			if (!confirm('You have unsaved changes, are you sure you want to leave this page?')) {
				nav.cancel();
			}
		}
	});

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

	function removeGroup(g: ExerciseGroup) {
		if (trainingProgram) {
			trainingProgram.exerciseGroups = trainingProgram.exerciseGroups.filter((_g) => _g.id != g.id);
		}
	}

	function removeExercise(e, group) {
		group.exercises = group.exercises.filter((_e) => _e.id != e.id);
		trainingProgram = trainingProgram;
	}

	function addGroupToDayOnSubmit(e, dayIndex) {
		let formData = new FormData(e.target);
		let groupId = formData.get('groupId');

		// groupId can be null one some edge cases of browsers defaulting to disabled values
		if (groupId == null) {
			return;
		}

		// Find the group
		// Compare ids as string because we set temp string ids for new groups that
		// have not been saved yet
		const group = trainingProgram.exerciseGroups.find((g) => g.id.toString() == groupId);
		if (group == undefined) {
			console.error('Could not find group when trying to add to day.');
			return;
		}

		// Add the object directly here, being a pointer and will thus be updated
		// in the list as the data changes
		trainingProgram.days[dayIndex].exerciseGroups = [
			...trainingProgram.days[dayIndex].exerciseGroups,
			group
		];
	}

	function removeGroupFromDay(dayIndex, group) {
		trainingProgram.days[dayIndex].exerciseGroups = trainingProgram.days[
			dayIndex
		].exerciseGroups.filter((_g) => _g.id != group.id);
	}

	type ExerciseModalData = {
		parent: ExerciseGroupComplete | TrainingProgramDayComplete | undefined;
		exercise: ExerciseEvent | undefined;
		exerciseFormData: ExerciseEventFormData | undefined;
	};

	let showNewExerciseModal = false;
	let showEditExerciseModal = false;
	let newExerciseModalData: ExerciseModalData = {
		parent: undefined,
		exercise: undefined,
		exerciseFormData: undefined
	};
	let editExerciseModalData = {
		parent: undefined,
		exercise: undefined,
		exerciseFormData: undefined
	} as ExerciseModalData;

	function setupNewExerciseModal(parent: ExerciseGroupComplete | TrainingProgramDayComplete) {
		newExerciseModalData = {
			parent,
			exercise: undefined,
			exerciseFormData: undefined
		};
		showNewExerciseModal = true;
	}
	function setupEditExerciseModal(
		exercise: ExerciseEvent,
		parent: ExerciseGroupComplete | TrainingProgramDayComplete
	) {
		editExerciseModalData = {
			// The data to be used and bound to in the form
			exerciseFormData: new ExerciseEventFormData(exercise),
			// The original exercise to be updated
			exercise,
			parent
		};
		showEditExerciseModal = true;
	}

	function editExerciseFromModal() {
		if (
			editExerciseModalData.exercise == undefined ||
			editExerciseModalData.exerciseFormData == undefined ||
			trainingProgram == undefined
		) {
			console.error('Cannoy edit exercise from modal because target or source is undefined.');
			return;
		}
		Object.assign(editExerciseModalData.exercise, editExerciseModalData.exerciseFormData);
		trainingProgram = trainingProgram;
		showEditExerciseModal = false;
	}

	function addExerciseFromModal() {
		const { parent, exerciseFormData } = newExerciseModalData;
		if (parent == undefined || parent.exercises == undefined || exerciseFormData == undefined) {
			console.error(
				'Parent object does not have exercises array, given exercises is undefined and thus we cannot add to it, or exercise form data was empty.'
			);
			return;
		}
		if (trainingProgram == undefined) {
			console.error('Page data does not exist');
			return;
		}
		parent.exercises = [...parent.exercises, exerciseFormData];
		trainingProgram = trainingProgram;
		newExerciseModalData.parent = undefined;
		showNewExerciseModal = false;
	}
</script>

<svelte:window bind:scrollY />

<Modal bind:showModal={showNewExerciseModal}>
	<h1>New Exercise</h1>
	<ExerciseEventForm
		bind:formData={newExerciseModalData.exerciseFormData}
		showDate={false}
		showDifficulty={false}
	/>

	<div slot="buttons">
		<button on:click={() => addExerciseFromModal()}>Add Exercise</button>
	</div>
</Modal>

<Modal bind:showModal={showEditExerciseModal}>
	<h1>Edit Exercise</h1>
	<ExerciseEventForm
		bind:formData={editExerciseModalData.exerciseFormData}
		showDate={false}
		showDifficulty={false}
	/>

	<div slot="buttons">
		<button on:click={() => editExerciseFromModal()}>Save</button>
	</div>
</Modal>

<div style="top: 0px; position: sticky; " class="{scrollY > 70 ? 'bg-white shadow' : ''} p-2">
	<div>
		<div class="inline-block">
			<form method="POST" action="?/patchTrainingProgram" use:enhance>
				<input type="hidden" name="id" value={trainingProgram?.id} />
				<input type="hidden" name="trainingProgram" value={JSON.stringify(trainingProgram)} />
				<button
					disabled={!thereAreUnsavedChanges()}
					type="submit"
					class="{thereAreUnsavedChanges()
						? 'bg-green-400'
						: 'bg-green-200'} {thereAreUnsavedChanges()
						? 'hover:bg-green-500'
						: 'hover:bg-green-200'} text-white font-bold px-8 py-2 rounded text-xl"
				>
					Save</button
				>
			</form>
		</div>
		{#if thereAreUnsavedChanges()}
			<div class="font-bold inline-block text-red-300">You have unsaved changes!</div>
		{/if}
	</div>
</div>

<div class="grid grid-cols-1">
	<div class="mb-5" />

	<div class="mb-5">
		<label for="programName">Program Name</label>
		<br />
		<input
			type="text"
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
		<button
			class="bg-green-400 hover:bg-green-500 text-white font-bold px-2 mb-4 rounded"
			on:click={() => addGroup()}>Add Group</button
		>

		{#each trainingProgram.exerciseGroups as group}
			<div class="rounded px-4 py-4 mb-4 bg-white shadow">
				<div class="flex items-center">
					<input
						type="text"
						class="mb-4"
						placeholder="Group Name"
						bind:value={group.name}
						style="max-width: 300px"
					/>
					<div class="flex-1" />
					<div>
						<button
							class="float-right align-middle bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded"
							on:click={() => removeGroup(group)}>Delete Group</button
						>
					</div>
				</div>

				<div>
					<ExerciseEventsList exerciseEvents={group.exercises} shouldShowDate={false}>
						<div slot="buttons" let:exerciseEvent>
							<button
								class="align-middle bg-green-400 hover:bg-green-500 text-white font-bold px-2 mr-2 rounded"
								on:click={() => setupEditExerciseModal(exerciseEvent, group)}>Edit</button
							>
							<button
								class="align-middle bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded"
								on:click={() => removeExercise(exerciseEvent, group)}>Delete</button
							>
						</div>
					</ExerciseEventsList>
				</div>
				<button
					class="bg-green-400 hover:bg-green-500 text-white font-bold px-2 mt-2 rounded"
					on:click={() => setupNewExerciseModal(group)}>Add Exercise</button
				>
			</div>
		{/each}
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
					type="text"
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
				<ExerciseGroupList exerciseGroups={day.exerciseGroups}>
					<div slot="buttons" let:group>
						<button
							class="bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded"
							on:click={() => removeGroupFromDay(i, group)}>Remove</button
						>
					</div>
				</ExerciseGroupList>

				<div class="mb-5">
					<form on:submit|preventDefault={(e) => addGroupToDayOnSubmit(e, i)}>
						<select name="groupId">
							{#each trainingProgram.exerciseGroups as group}
								<option
									value={group.id}
									disabled={day.exerciseGroups.find((_g) => _g.id == group.id)}
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
				<ExerciseEventsList exerciseEvents={day.exercises} shouldShowDate={false}>
					<div slot="buttons" let:exerciseEvent>
						<button
							class="align-middle bg-green-400 hover:bg-green-500 text-white font-bold px-2 mr-2 rounded"
							on:click={() => setupEditExerciseModal(exerciseEvent, day)}>Edit</button
						>
						<button
							class="align-middle bg-red-400 hover:bg-red-500 text-white font-bold px-2 rounded"
							on:click={() => removeExercise(exerciseEvent, day)}>Delete</button
						>
					</div>
				</ExerciseEventsList>
				<button
					class="bg-green-400 hover:bg-green-500 text-white font-bold px-2 mt-2 rounded"
					on:click={() => setupNewExerciseModal(day)}>Add Exercise</button
				>
			</div>
		{/each}
	</div>
</div>
