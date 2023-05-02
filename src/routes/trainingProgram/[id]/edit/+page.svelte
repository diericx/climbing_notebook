<!--
Notes:
- This component is effectively one complex form that is updating a single json object to be submitted
- Assumes group name uniqueness, if duplicates exist unexpected behavior will occur
-->
<script lang="ts">
	import type { PageData } from './$types';
	import { beforeNavigate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import ExerciseEventsList from '../../../exerciseEvent/list.svelte';
	import ExerciseGroupList from '../../groupList.svelte';
	import ModalExerciseEvent from './ModalExerciseEvent.svelte';
	import ModalExerciseGroup from './ModalExerciseGroup.svelte';
	import ModalTrainingProgram from './ModalTrainingProgram.svelte';
	import ModalTrainingProgramDay from './ModalTrainingProgramDay.svelte';
	import { confirmDelete } from '$lib/utils';

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
</script>

<svelte:window bind:scrollY />

<div class="grid grid-cols-1">
	<div class="mb-5" />

	<div class="mb-10 flex items-center">
		<h1 class="font-bold inline">
			{trainingProgram.name}
		</h1>

		<ModalTrainingProgram
			{trainingProgram}
			action={`/trainingProgram/${trainingProgram.id}/edit?/editTrainingProgram`}
			let:changeShowModal
		>
			<div slot="open-modal-buttons">
				<button type="button" class="icon-button" on:click={() => changeShowModal(true)}>
					<Icon icon="material-symbols:edit-outline" height="18" />
					<span class="ml-1 mr-1"> Edit </span>
				</button>
			</div>
		</ModalTrainingProgram>
	</div>

	<div class="mb-10">
		<div class="flex justify-between">
			<div class="text-xl">Exercise Groups</div>
			<ModalExerciseGroup
				action={`/trainingProgram/${trainingProgram.id}/edit?/addExerciseGroup`}
			/>
		</div>

		<div class="mb-2" />

		{#each trainingProgram.exerciseGroups as group}
			<div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
				<div class="flex items-center">
					<div class="flex mb-7 w-full">
						<h2 class="font-bold">{group.name}</h2>

						<ModalExerciseGroup
							exerciseGroup={group}
							action={`/trainingProgram/${trainingProgram.id}/group/${group.id}?/editExerciseGroup`}
							let:changeShowModal
						>
							<div slot="open-modal-buttons">
								<button type="button" class="icon-button" on:click={() => changeShowModal(true)}>
									<Icon icon="material-symbols:edit-outline" height="18" />
									<span class="ml-1 mr-1"> Edit </span>
								</button>
							</div>
						</ModalExerciseGroup>

						<div class="flex-1" />

						<form
							use:enhance
							method="POST"
							action={`/trainingProgram/${trainingProgram.id}/group/${group.id}?/deleteExerciseGroup`}
							class="flex-initial"
						>
							<input type="hidden" name="exerciseGroupId" value={group.id} />
							<button on:click={confirmDelete} class="icon-button" type="submit">
								<Icon icon="mdi:trash-outline" height="18" />
								<span class="ml-1 mr-1"> Delete </span>
							</button>
						</form>
					</div>
					<div />
				</div>

				<div>
					<div class="flex w-full items-center">
						<span class="items-end text-lg font-light">Exercises</span>
						<div class="flex-1" />
						<ModalExerciseEvent
							exerciseGroup={group}
							action="/exerciseEvent?/newExerciseEvent"
							let:changeShowModal
						>
							<div class="mb-2" slot="open-modal-buttons">
								<button class="icon-button mr-0" on:click={() => changeShowModal(true)}>
									<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
									<span class="ml-1 mr-1"> Add Exercise </span>
								</button>
							</div>
						</ModalExerciseEvent>
					</div>

					<ExerciseEventsList exerciseEvents={group.exercises} shouldShowDate={false} />
				</div>
			</div>
		{/each}
	</div>

	<div class="mb-5">
		<div class="text-xl">Days</div>
		<p class="text-slate-400">Set exercises and exercise groups for each day of the week.</p>
	</div>

	<div>
		{#each trainingProgram.days as day, i}
			<div class="bg-white rounded-lg px-4 pt-3 pb-3 mb-10 border">
				<div class="flex mb-4">
					<div class="mr-2">
						<h2>
							<b>{daysOfTheWeek[i]}</b>
						</h2>
						<span class="text-gray-400">
							<i>{day.description || 'No description for this day'}</i>
						</span>
					</div>
					<ModalTrainingProgramDay
						trainingProgramDay={day}
						action={`/trainingProgram/${trainingProgram.id}/day/${day.id}?/editTrainingProgramDay`}
						let:changeShowModal
					>
						<div slot="open-modal-buttons">
							<button
								type="button"
								class="text-gray-400 border ml-2 bg-white hover:bg-gray-50 font-medium rounded text-sm p-1 text-center inline-flex items-center mr-2"
								on:click={() => changeShowModal(true)}
							>
								<Icon icon="material-symbols:edit-outline" height="18" />
								<span class="ml-1 mr-1"> Edit </span>
							</button>
						</div>
					</ModalTrainingProgramDay>
				</div>

				<div class="mb-12">
					<div class="flex w-full justify-between items-end">
						<div class="font-bold text-lg">Exercise Groups</div>
						<form
							use:enhance
							method="POST"
							action={`/trainingProgram/${trainingProgram.id}/day/${day.id}/?/connectExerciseGroup`}
							class="flex items-end"
						>
							<input type="hidden" value={day.id} name="trainingProgramDayId" />
							<select name="exerciseGroupId" class="pr-8 py-1">
								{#each trainingProgram.exerciseGroups as group}
									<option
										value={group.id}
										disabled={day.exerciseGroups.find((_g) => _g.id == group.id) != undefined}
									>
										{group.name}
									</option>
								{/each}
							</select>
							<button class="icon-button mb-2 mr-0" type="submit">
								<Icon icon="fluent:plug-connected-add-20-regular" height="18" />
								<span class="ml-1 mr-1"> Connect</span>
							</button>
						</form>
					</div>
					<ExerciseGroupList exerciseGroups={day.exerciseGroups}>
						<div slot="buttons" let:group>
							<form
								use:enhance
								method="POST"
								action={`/trainingProgram/${trainingProgram.id}/day/${day.id}/?/disconnectExerciseGroup`}
							>
								<input type="hidden" value={group.id} name="exerciseGroupId" />
								<button type="submit" class="icon-button">
									<Icon icon="fluent:plug-disconnected-20-regular" height="18" />
									<span class="ml-1 mr-1"> Disconnect </span>
								</button>
							</form>
						</div>
					</ExerciseGroupList>
				</div>

				<div class="flex justify-between">
					<div class="text-lg font-bold">Exercises</div>
					<ModalExerciseEvent
						trainingProgramDay={day}
						action="/exerciseEvent?/newExerciseEvent"
						let:changeShowModal
					>
						<div slot="open-modal-buttons" class="mb-2">
							<button class="icon-button mr-0" on:click={() => changeShowModal(true)}>
								<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
								<span class="ml-1 mr-1"> Add Exercise </span>
							</button>
						</div>
					</ModalExerciseEvent>
				</div>
				<ExerciseEventsList exerciseEvents={day.exercises} shouldShowDate={false} />
			</div>
		{/each}
	</div>
</div>
