<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormProject from '../forms/FormProject.svelte';
	import FormModal from './FormModal.svelte';
</script>

<FormModal let:data let:action let:id>
	<span slot="content">
		<FormProject
			{data}
			{action}
			{id}
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
