<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormCustomQuery from '../forms/FormCustomQuery.svelte';
	import FormModal from './FormModal.svelte';

	let showOperator = $modalStore[0]?.meta?.showOperator;
</script>

<FormModal let:data let:action let:id>
	<span slot="content">
		<FormCustomQuery
			{data}
			{action}
			{id}
			{showOperator}
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
