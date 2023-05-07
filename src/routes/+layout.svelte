<script lang="ts">
	import NProgress from 'nprogress';
	import Header from './Header.svelte';
	import { Modal, type ModalComponent } from '@skeletonlabs/skeleton';
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';

	import './styles.css';
	import '../app.css';
	import '@event-calendar/core/index.css';
	import { navigating } from '$app/stores';
	import type { PageData } from './$types';
	import FormModalExerciseEvent from '$lib/components/modals/FormModalExerciseEvent.svelte';
	import FormModalExerciseGroup from '$lib/components/modals/FormModalExerciseGroup.svelte';
	import FormModalTrainingProgram from '$lib/components/modals/FormModalTrainingProgram.svelte';
	import FormModalTrainingProgramDay from '$lib/components/modals/FormModalTrainingProgramDay.svelte';
	import FormModalCalendarEvent from '$lib/components/modals/FormModalCalendarEvent.svelte';

	export let data: PageData;

	NProgress.configure({
		minimum: 0.16
	});

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}

	const modalComponentRegistry: Record<string, ModalComponent> = {
		formModalExerciseEvent: { ref: FormModalExerciseEvent },
		formModalExerciseGroup: { ref: FormModalExerciseGroup },
		formModalTrainingProgram: { ref: FormModalTrainingProgram },
		formModalTrainingProgramDay: { ref: FormModalTrainingProgramDay },
		formModalCalendarEvent: { ref: FormModalCalendarEvent }
	};
</script>

<div class="app">
	<Header user={data.user} />

	<Modal components={modalComponentRegistry} />
	<div class="container mx-auto px-3">
		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	.app {
		min-height: 100vh;
	}
</style>
