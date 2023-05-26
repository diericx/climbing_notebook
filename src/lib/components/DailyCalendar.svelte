<script lang="ts">
	import type { TrainingProgramWithDays } from '$lib/prisma';
	import CalExerciseEvent from '$lib/components/WeeklyCalendarExerciseEvent.svelte';
	import { daysFromToday, getDayWeekStartsMonday } from '$lib/utils';
	import { onMount } from 'svelte';

	export let trainingProgram: TrainingProgramWithDays;

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

	const day = trainingProgram.days[todayDayOfTheWeek];
</script>

<div class="overflow-scroll">
	<div class="row">
		<div class="grid grid-cols-1">
			<div id={daysOfTheWeek[todayDayOfTheWeek].toString()} class="px-2">
				<div style="height: 425px;" class="overflow-scroll">
					{#if day.exercises.length == 0 && day.exerciseGroups.length == 0}
						<p class="text-gray-400 italic">No exercises for this day</p>
					{/if}
					{#each day.exercises as exerciseEvent}
						<CalExerciseEvent {exerciseEvent} date={new Date()} />
					{/each}

					{#each day.exerciseGroups as group}
						<p class="font-bold">{group.name}</p>
						{#each group.exercises as exerciseEvent}
							<CalExerciseEvent {exerciseEvent} date={new Date()} />
						{/each}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
