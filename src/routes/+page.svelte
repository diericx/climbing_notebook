<script lang="ts">
	import type { PageData } from './$types';
	import { getUser } from '@lucia-auth/sveltekit/client';
	import TrainingProgramWeeklyCalendar from './trainingProgram/weekCalendar.svelte';
	import type { ProfileWithActiveTrainingProgram } from '$lib/profile';

	export let data: PageData;
	const user = getUser();
	const profile: ProfileWithActiveTrainingProgram =
		data.profile as ProfileWithActiveTrainingProgram;
</script>

<br />

{#if profile}
	<div class="pb-4">
		<h1 class="inline">Your Goals</h1>
		<a href={`/profile/${$user?.userId}/edit?redirectTo=/`}>Edit</a>

		<hr />
		{#if !profile.goals || profile.goals == ''}
			<p class="text-gray-400">
				You don't have any goals yet! Edit your <a
					href={`/profile/${$user?.userId}/edit?redirectTo=/`}>Profile</a
				> set some.
			</p>
		{:else}
			<div class="whitespace-pre border bg-white w-full px-1 py-3">
				{profile.goals}
			</div>
		{/if}
	</div>

	<div class="pb-4">
		<h1>Your Training Program Schedule</h1>
		<hr />
		{#if profile.activeTrainingProgram}
			<TrainingProgramWeeklyCalendar trainingProgram={profile.activeTrainingProgram} />
		{:else}
			<p class="text-gray-400">
				You don't have an active training program! Go to the <a href="/trainingProgram"
					>Training Programs</a
				> page to create and set one.
			</p>
		{/if}
	</div>
{:else}
	<h1>Welcome to the Climbing Notebook</h1>
	<hr />

	<p>
		<br />
		This website is a no-fluff set of tools to help climbers with their training.
		<br />
		This is a <b>very early version</b> and is actively being worked on by myself only.
		<br />
		I am currently jobless and am willing to work on this nearly full time right now.
		<br />
		<br />
		<b>If you want to help out</b> we can chat about what tooling you want added next.
		<br />
		zacharyholland[at]gmail[dot]com
	</p>

	<br />

	<h1>Current Features</h1>
	<hr />
	<br />

	<ul class="roman">
		<li>
			<h2><b>Recovery Tracker</b></h2>
			Implementation of the recovery tracking too suggested by Bechtel and Manganiello in<i
				>Unstoppale Force: Strength Training for Climbing (pg. 92).</i
			>
			<ul class="list-disc px-6">
				<li>Each activity falls under <b>work</b> or <b>rest</b></li>
				<li>
					Short term work/recovery is calculated by subtracting rest from work and displayed there
				</li>
				<li>
					Short term work is displayed on the front page dashboard to get a quick glance at what
					might affect your performance today.
				</li>
			</ul>
		</li>
		<li>
			<h2><b>Climbing Journal</b></h2>
			A place to keep nots on progress and more importantly<b>injuries</b> as suggested by MacLeod
			in
			<i>Make or Break (pg. 22, 27)</i>
			<ul class="list-disc px-6">
				<li>Simple and open ended journaling tool; jot notes any day it seems useful</li>
			</ul>
		</li>
	</ul>
{/if}
