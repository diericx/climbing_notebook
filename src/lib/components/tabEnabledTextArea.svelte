<script lang="ts">
	export let cols, rows, name, placeholder, value;
	let className;
	export { className as class };

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key == 'Tab') {
			let target = e.target as HTMLInputElement;
			e.preventDefault();
			var start = target.selectionStart;
			var end = target.selectionEnd;
			// If either start or end is null, this logic cannot be applied here
			// and it will be best to simply disable the key
			if (start == null || end == null) {
				return;
			}
			target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);
		}
	};
</script>

<textarea {name} {cols} {rows} {placeholder} class={className} bind:value on:keydown={onKeyDown} />
