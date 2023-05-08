<script>
	import { modalStore } from '@skeletonlabs/skeleton';
	import FormCalendarEvent from '../forms/FormCalendarEvent.svelte';
	import FormModal from './FormModal.svelte';
</script>

<!--Invalidate all on this form??-->
<FormModal let:data let:action let:id>
	<span slot="content">
		<FormCalendarEvent
			{id}
			{action}
			showSubmitButton={false}
			{data}
			onSuccess={() => modalStore.close()}
		/>
	</span>
	<span slot="footer">
		<button class="btn variant-filled" form={id}>Submit</button>
	</span>
</FormModal>
