<script lang="ts">
	import Header from './Header.svelte';
	import './styles.css';
	import '../app.css';
	import { page } from '$app/stores';
	import { handleSession } from '@lucia-auth/sveltekit/client';

	handleSession(page);
</script>

<div class="app">
	<Header />

	<div class="container mx-auto">
		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	.app {
		min-height: 100vh;
	}
</style>
