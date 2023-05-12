<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormWidget from '../forms/FormWidget.svelte';
	import FormModal from './FormModal.svelte';

	let showType = $modalStore[0]?.meta?.showType;
	let showOrder = $modalStore[0]?.meta?.showOrder;
</script>

<FormModal let:data let:action let:id>
	<span slot="content">
		<FormWidget
			{data}
			{action}
			{id}
			{showType}
			{showOrder}
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
