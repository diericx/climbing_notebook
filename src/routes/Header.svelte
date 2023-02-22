<script lang="ts">
	import { signOut, getUser } from '@lucia-auth/sveltekit/client';
	import { invalidateAll } from '$app/navigation';
	const user = getUser();

	import logo from '$lib/images/logo.svg';
	let showMenu = false;

	function toggleNavbar() {
		showMenu = !showMenu;
	}
</script>

<header>
	<div>
		<div class="bg-white">
			<nav class="px-6 py-3 mx-auto md:flex  md:items-center">
				<div class="flex items-center justify-between">
					<a href="/" class="flex items-center">
						<img src={logo} class="h-6 mr-3 sm:h-9" alt="Logo" />
						<span class="self-center text-xl font-semibold whitespace-nowrap text-gray-800"
							>Climbing Notebook</span
						>
					</a>

					<!-- Mobile menu button -->
					<div on:click={toggleNavbar} class="flex md:hidden">
						<button
							type="button"
							class="py-1 text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Mobile Menu open: "block", Menu closed: "hidden" -->
				<div
					class="flex flex-1 flex-col justify-between mt-8 space-y-4 md:flex-row md:flex md:space-y-0 md:items-center md:space-x-10 md:mt-0 {showMenu
						? 'flex'
						: 'hidden'}"
				>
					<div class="mx-3 flex flex-col md:flex-row">
						<a class="px-3 text-gray-600 hover:text-blue-400 text-left" href="/"> Home </a>
						<a class="px-3 text-gray-600 hover:text-blue-400" href="/climbingJournal">Journal</a>
					</div>

					<div
						class="w-fit-content flex flex-col md:flex-none md:flex-row"
						style="min-width: 130px"
					>
						{#if $user}
							<a
								href="/profile"
								class="px-4 text-center border text-gray-800 bg-white hover:text-indigo-600 rounded-md lg:inline border-0"
							>
								{$user.username}
							</a>

							<div class="hidden md:inline">|</div>

							<button
								class="border-0 shadow-none"
								style="margin-top: 0px"
								on:click={async () => {
									await signOut();
									invalidateAll();
								}}>Logout</button
							>
						{:else}
							<a
								href="/login"
								class="py-3 px-4 text-center border text-gray-800 bg-white hover:text-indigo-600 rounded-md block lg:inline border-0"
							>
								Login
							</a>
						{/if}
					</div>
				</div>
			</nav>
		</div>
	</div>
</header>
