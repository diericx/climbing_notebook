<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormExerciseEvent from '../forms/FormExerciseEvent.svelte';
	import FormModal from './FormModal.svelte';

	let exerciseToMarkCompleted = $modalStore[0]?.meta?.exerciseToMarkCompleted;
	let dateToMarkCompleted = $modalStore[0]?.meta?.dateToMarkCompleted;
</script>

<FormModal let:data let:action let:id>
	<span slot="content">
		<FormExerciseEvent
			{data}
			{action}
			{id}
			{exerciseToMarkCompleted}
			{dateToMarkCompleted}
			showSubmitButton={false}
			onSuccess={() => {
				modalStore.close();
			}}
		/>
	</span>
	<span slot="footer">
		<button type="submit" class="btn variant-filled" form={id}>Submit</button>
	</span>
</FormModal>
