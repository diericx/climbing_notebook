<script lang="ts">
  import FormButton from '$lib/components/forms/FormButton.svelte';
  import type { User } from 'lucia';

  let showMenu = false;

  function toggleNavbar() {
    showMenu = !showMenu;
  }

  function closeNavbar() {
    showMenu = false;
  }

  export let user: User;
</script>

<header>
  <div>
    <div class="bg-white">
      <nav class="px-6 py-3 mx-auto md:flex md:items-center">
        <div class="flex items-center justify-between">
          <a href="/" class="flex items-center">
            <span
              style="line-height: 20px"
              class="self-center text-xl font-semibold whitespace-nowrap text-gray-800"
              >Climbing <br />Notebook</span
            >
          </a>

          <!-- Mobile menu button -->
          <div class="flex md:hidden">
            <button
              class="py-1 text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
              on:click={toggleNavbar}
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
          class="flex-1 md:flex flex-col md:flex-row justify-between md:items-center mt-5 md:mt-0 md:space-x-10 {showMenu
            ? 'flex'
            : 'hidden'}"
        >
          <div class="mx-3 flex flex-col md:flex-row space-y-1 md:space-y-0">
            <a
              class="px-3 text-gray-600 hover:text-blue-400 text-left"
              href="/"
              on:click={closeNavbar}
            >
              Home
            </a>
            <a
              class="px-3 text-gray-600 hover:text-blue-400"
              href="/journalEntry"
              on:click={closeNavbar}>Journal</a
            >
            <a
              class="px-3 text-gray-600 hover:text-blue-400"
              href="/exerciseEvent"
              on:click={closeNavbar}>Exercise Log</a
            >
            <a
              class="px-3 text-gray-600 hover:text-blue-400"
              href="/trainingCycle"
              on:click={closeNavbar}>Training Cycles</a
            >
            <div style="position: relative">
              <a
                class="px-3 text-gray-600 hover:text-blue-400"
                href="/feedback"
                on:click={closeNavbar}>Feedback</a
              >
              <span
                class="rounded-full bg-green-400 text-xs text-white px-1"
                style="position: absolute; top: -10px; left: 65px">New</span
              >
            </div>
          </div>

          <div
            class="flex flex-col md:flex-none md:flex-row mx-3 mt-4 md:mt-0 md:mx-0 w-fit-content"
          >
            {#if user}
              <a
                href="/profile"
                class="px-3 text-left md:text-center border text-gray-800 bg-white hover:text-indigo-600 rounded-md lg:inline border-0"
              >
                {user.username}
              </a>

              <div class="hidden md:inline">|</div>
              <FormButton action="/?/signout" class="border-0 shadow-none mt-0">Logout</FormButton>
            {:else}
              <a
                href="/login"
                class="py-3 px-3 text-center border text-gray-800 bg-white hover:text-indigo-600 rounded-md block lg:inline border-0"
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
