<script lang="ts">
	import { onMount } from 'svelte';
	import type { TrainingProgramWithDays } from '$lib/prisma';
	import type { ExerciseEvent } from '@prisma/client';
	import CalExerciseEvent from './calExerciseEvent.svelte';
	import { getDayWeekStartsMonday } from '$lib/utils';

	export let trainingProgram: TrainingProgramWithDays;
	export let fillExerciseEventFormFunc: (e: ExerciseEvent) => void;
	export let findMatchingExerciseOnSameDayFunc: (
		e: ExerciseEvent,
		day: number
	) => ExerciseEvent | undefined;

	onMount(() => {
		scrollIntoView();
	});

	const todayDayOfTheWeek = getDayWeekStartsMonday(new Date());
	let daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	function scrollIntoView() {
		const el = document.querySelector('#' + daysOfTheWeek[todayDayOfTheWeek]);
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'center'
		});
	}
</script>

<div class="mb-3">
	<h2 class="font-bold">{trainingProgram.name}</h2>
	<a href={`/trainingProgram/${trainingProgram.id}/edit`}>Edit this training program</a>
</div>

<div class="overflow-scroll">
	<div style="width: 1500px">
		<div class="row">
			<div class="grid grid-cols-7">
				{#each trainingProgram.days as day, i}
					<div id={daysOfTheWeek[i].toString()} class="px-2">
						<div
							class="text-center px-2 mb-3 {i == todayDayOfTheWeek
								? 'border-b-2 border-gray-600'
								: 'border-b border-gray-200'}"
						>
							<p>{daysOfTheWeek[i]}</p>
							<p class="text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis">
								{day.description}&nbsp;
							</p>
						</div>

						<div style="height: 425px;" class="overflow-scroll">
							{#if day.exercises.length == 0 && day.exerciseGroups.length == 0}
								<p class="text-gray-400 italic">No exercises for this day</p>
							{/if}
							{#each day.exercises as exercise}
								<CalExerciseEvent
									{exercise}
									isInferredAsCompleted={findMatchingExerciseOnSameDayFunc(exercise, i) !=
										undefined}
									{fillExerciseEventFormFunc}
								/>
							{/each}

							{#each day.exerciseGroups as group}
								<p class="font-bold">{group.name}</p>
								{#each group.exercises as exercise}
									<CalExerciseEvent
										{exercise}
										isInferredAsCompleted={findMatchingExerciseOnSameDayFunc(exercise, i) !=
											undefined}
										{fillExerciseEventFormFunc}
									/>
								{/each}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
