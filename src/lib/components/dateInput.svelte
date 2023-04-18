<script>
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	export let format = 'YYYY-MM-DD';
	export let date = new Date();
	export let name = '';
	export let style = '';

	let internal;

	const input = (x) => (internal = dayjs(x).format(format));
	const output = (x) => (date = dayjs(x, format).toDate());

	$: input(date);
	$: output(internal);
</script>

<input {name} type="date" {style} bind:value={internal} />
