<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormExerciseEvent from '../forms/FormExerciseEvent.svelte';
	import FormModal from './FormModal.svelte';

	let exerciseToMarkCompleted = $modalStore[0]?.meta?.exerciseToMarkCompleted;
	let dateToMarkCompleted = $modalStore[0]?.meta?.dateToMarkCompleted;
	let showDifficulty = $modalStore[0]?.meta?.showDifficulty;
	let showDate = $modalStore[0]?.meta?.showDate;
	let exercises = $modalStore[0]?.meta?.exercises;
</script>

<FormModal let:data let:action let:id>
	<span slot="content">
		<FormExerciseEvent
			{exercises}
			{data}
			{action}
			{id}
			{exerciseToMarkCompleted}
			{dateToMarkCompleted}
			{showDifficulty}
			{showDate}
			showSubmitButton={false}
			onSuccess={() => {
				modalStore.close();
			}}
		/>
	</span>
	<span slot="footer">
		<button class="btn variant-filled" form={id}>Submit</button>
	</span>
</FormModal>
