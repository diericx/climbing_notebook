<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import ExerciseEventsList from '$lib/components/ListExerciseEvent.svelte';
	import ExerciseGroupList from '$lib/components/ListExerciseGroup.svelte';
	import { confirmDelete } from '$lib/utils';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let data: PageData;
	let scrollY: number;
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
</script>

<svelte:window bind:scrollY />

<div class="grid grid-cols-1">
	<div class="mb-12 flex items-center justify-between">
		<h1 class="font-bold inline">
			{trainingProgram.name}
		</h1>

		<button
			class="btn btn-sm variant-ringed"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: 'formModalTrainingProgram',
					meta: {
						data: trainingProgram,
						action: `/trainingProgram/${trainingProgram.id}/edit?/editTrainingProgram`,
						title: 'Edit Training Program'
					}
				})}
		>
			<Icon icon="material-symbols:edit-outline" height="18" />
			<span>Edit</span>
		</button>
	</div>

	<div class="mb-10">
		<div class="flex justify-between mb-2">
			<div class="text-xl">Exercise Groups</div>
			<button
				class="btn btn-sm variant-filled"
				on:click={() =>
					modalStore.trigger({
						type: 'component',
						component: 'formModalExerciseGroup',
						meta: {
							action: `/trainingProgram/${trainingProgram.id}/edit?/addExerciseGroup`,
							title: 'Add Group'
						}
					})}
			>
				<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
				<span>Add Group</span>
			</button>
		</div>
		<hr class="mb-2" />

		{#each trainingProgram.exerciseGroups as group}
			<div class="rounded-lg px-4 pb-4 pt-3 border mb-4 bg-white">
				<div class="flex items-center">
					<div class="flex mb-7 w-full justify-between">
						<h2 class="font-bold">{group.name}</h2>

						<div class="flex space-x-2">
							<button
								class="btn btn-sm variant-ringed"
								on:click={() =>
									modalStore.trigger({
										type: 'component',
										component: 'formModalExerciseGroup',
										meta: {
											data: group,
											action: `/trainingProgram/${trainingProgram.id}/group/${group.id}?/editExerciseGroup`,
											title: 'Edit Group'
										}
									})}
							>
								<Icon icon="material-symbols:edit-outline" height="18" />
								<span>Edit</span>
							</button>
							<form
								use:enhance
								method="POST"
								action={`/trainingProgram/${trainingProgram.id}/group/${group.id}?/deleteExerciseGroup`}
								class="flex-initial"
							>
								<input type="hidden" name="exerciseGroupId" value={group.id} />
								<button on:click={confirmDelete} class="btn btn-sm variant-ringed" type="submit">
									<Icon icon="mdi:trash-outline" height="18" />
									<span class="ml-1 mr-1"> Delete </span>
								</button>
							</form>
						</div>
					</div>
					<div />
				</div>

				<div>
					<div class="flex w-full items-center mb-2">
						<span class="items-end text-lg font-light">Exercises</span>
						<div class="flex-1" />
						<button
							class="btn btn-sm variant-filled"
							on:click={() =>
								modalStore.trigger({
									type: 'component',
									component: 'formModalExerciseEvent',
									meta: {
										action: `/trainingProgram/${trainingProgram.id}/group/${group.id}?/newExerciseEvent`,
										title: 'Add Exercise'
									}
								})}
						>
							<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
							<span>Add Exercise</span>
						</button>
					</div>

					<ExerciseEventsList exerciseEvents={group.exercises} shouldShowDate={false} />
				</div>
			</div>
		{/each}
	</div>

	<div class="mb-2">
		<div class="text-xl">Days</div>
		<p class="text-slate-400">Set exercises and exercise groups for each day of the week.</p>
	</div>
	<hr class="mb-2" />

	<div>
		{#each trainingProgram.days as day, i}
			<div class="bg-white rounded-lg px-4 pt-3 pb-3 mb-10 border">
				<div class="flex mb-4 justify-between">
					<div class="mr-2">
						<h2>
							<b>{daysOfTheWeek[i]}</b>
						</h2>
						<span class="text-gray-400">
							<i>{day.description || 'No description for this day'}</i>
						</span>
					</div>
					<div>
						<button
							class="btn btn-sm variant-ringed"
							on:click={() =>
								modalStore.trigger({
									type: 'component',
									component: 'formModalTrainingProgramDay',
									meta: {
										data: day,
										action: `/trainingProgram/${trainingProgram.id}/day/${day.id}?/editTrainingProgramDay`,
										title: 'Edit Day'
									}
								})}
						>
							<Icon icon="material-symbols:edit-outline" height="18" />
							<span>Edit</span>
						</button>
					</div>
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
							<button class="btn btn-sm variant-filled mb-2 ml-2" type="submit">
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
								<button class="btn btn-sm variant-ringed" type="submit">
									<Icon icon="fluent:plug-disconnected-20-regular" height="18" />
									<span class="ml-1 mr-1"> Disconnect </span>
								</button>
							</form>
						</div>
					</ExerciseGroupList>
				</div>

				<div class="flex justify-between items-end">
					<div class="text-lg font-bold">Exercises</div>
					<button
						class="btn btn-sm variant-filled mb-2"
						on:click={() =>
							modalStore.trigger({
								type: 'component',
								component: 'formModalExerciseEvent',
								meta: {
									action: `/trainingProgram/${trainingProgram.id}/day/${day.id}?/newExerciseEvent`,
									title: 'Add Exercise'
								}
							})}
					>
						<Icon icon="material-symbols:add-circle-outline-rounded" height="18" />
						<span>Add Exercise</span>
					</button>
				</div>
				<ExerciseEventsList exerciseEvents={day.exercises} shouldShowDate={false} />
			</div>
		{/each}
	</div>
</div>
