<script lang="ts">
	import dayjs from 'dayjs';

	export let format = 'YYYY-MM-DD';
	export let date = new Date();
	export let name = '';
	export let style = '';

	let internal: string;

	const input = (x: Date) => (internal = dayjs(x).format(format));
	const output = (x: string) => (date = dayjs(x, format).toDate());

	$: input(date);
	$: output(internal);
</script>

<input {name} type="date" {style} bind:value={internal} />
