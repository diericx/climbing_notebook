<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormCustomQueryCondition from '../forms/FormCustomQueryCondition.svelte';
	import FormModal from './FormModal.svelte';
	let table = $modalStore[0]?.meta?.table;
</script>

<FormModal let:data let:action let:id>
	<span slot="content">
		<FormCustomQueryCondition
			{data}
			{action}
			{id}
			{table}
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
