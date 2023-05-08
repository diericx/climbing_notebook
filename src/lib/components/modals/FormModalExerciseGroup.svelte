<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormExerciseGroup from '../forms/FormExerciseGroup.svelte';
	import FormModal from './FormModal.svelte';
</script>

<FormModal let:data let:action let:id>
	<span slot="content">
		<FormExerciseGroup
			{data}
			{id}
			{action}
			showSubmitButton={false}
			onSuccess={() => modalStore.close()}
		/>
	</span>
	<span slot="footer">
		<button class="btn variant-filled" form={id}>Submit</button>
	</span>
</FormModal>
