<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormProjectSession from '../forms/FormProjectSession.svelte';
	import FormModal from './FormModal.svelte';
</script>

<FormModal let:data let:action let:id>
	<span slot="content">
		<FormProjectSession
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
