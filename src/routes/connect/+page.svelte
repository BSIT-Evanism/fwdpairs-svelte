<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { createDialog, melt } from '@melt-ui/svelte';
	const { data } = $props();
	import { backInOut, circInOut, cubicIn, cubicInOut, elasticOut } from 'svelte/easing';
	import { authClient } from '$lib/client';

	let blocks = $state(false);
	const options = {
		duration: 500
	};

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open }
	} = createDialog({
		forceVisible: true
	});

	function whoosh(
		node: HTMLElement,
		params: { delay?: number; duration?: number; easing?: (u: number) => number }
	) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || cubicInOut,
			css: (t: number, u: number) => `transform: ${existingTransform} translate(0, ${u * 800}px)`
		};
	}
</script>

<div class="flex gap-4 justify-center p-2 items-center h-screen relative bg-pink-100">
	<div
		class="bg-pink-300 h-32 w-52 flex justify-end absolute top-3/4 left-0 rounded-r-full z-10 -translate-x-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 transition-all"
	>
		<div class="w-24 h-24 m-4 bg-pink-100 rounded-full"></div>
	</div>
	<div
		class="w-1/4 h-[calc(100vh-100px)] flex flex-col overflow-hidden items-center relative mt-20 bg-pink-50 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
	>
		<button
			use:melt={$trigger}
			class="w-full h-36 px-4 gap-2 flex hover:bg-pink-200 items-center justify-center"
		>
			<div class=" w-32 h-24 bg-pink-100 rounded-full"></div>
			<div class="w-full p-2 h-24 bg-pink-100 rounded-xl">
				<h1 class="text-xl uppercase font-black">{data.session.user.name}</h1>
				<p class="text-sm text-gray-500">{data.userDetails.age} years old</p>
				<p class="text-sm text-gray-500">{data.userDetails.gender}</p>
			</div>
		</button>
		<div class="w-full h-1 bg-black"></div>
	</div>
	<div class="w-1 z-10 flex flex-col items-center gap-4 ml-[5px]">
		<div class="w-2 h-2 bg-pink-500 rounded-full"></div>
		<div class="w-2 h-2 bg-pink-500 rounded-full"></div>
		<div class="w-2 h-2 bg-pink-500 rounded-full"></div>
	</div>
	<div
		class="w-1/2 h-[calc(100vh-100px)] gap-2 grid grid-cols-3 grid-flow-row mt-20 relative bg-pink-50 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 border-4 border-black"
	></div>
</div>

{#if $open}
	<div use:melt={$portalled}>
		<div
			use:melt={$overlay}
			transition:fade={{ duration: 150 }}
			class="fixed inset-0 z-50 bg-black/50"
		>
			<div
				use:melt={$content}
				transition:whoosh={{ duration: 150 }}
				class="fixed left-1/2 top-1/2 z-50 h-[55vh] min-w-[60vw]
            max-w-[450px] -translate-x-1/2 -translate-y-1/8 rounded-3xl border-4 border-black border-b-0 rounded-b-none bg-white
            p-6 shadow-lg"
			>
				<h1 class="text-2xl mb-4 font-black">User Details</h1>
				<div class="w-full h-[85%] overflow-hidden rounded-xl relative bg-slate-200">
					{@render blocker()}
					<div class="p-4 flex flex-col gap-4">
						<div class="flex items-center gap-4">
							<div class="w-32 h-32 bg-pink-100 rounded-full border-2 border-black relative">
								<label class="absolute inset-0 flex items-center justify-center cursor-pointer">
									<input type="file" accept="image/*" class="hidden" />
									<span class="text-sm text-gray-500">Upload Photo</span>
								</label>
							</div>
							<div class="flex flex-col gap-2">
								<h2 class="scroll-m-20 text-xl font-semibold tracking-tight">
									{data.session.user.name}
								</h2>
								<p class="text-sm text-gray-500">{data.userDetails.age} years old</p>
								<p class="text-sm text-gray-500">{data.userDetails.gender}</p>
							</div>
						</div>

						<div class="space-y-4">
							<h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Opening Questions</h3>
							<div class="flex flex-wrap gap-2">
								{#each data.userDetails.topics as topic}
									<div class="bg-pink-100 px-3 py-1.5 rounded-full border-2 border-black text-sm">
										{topic.topic}
									</div>
								{/each}
							</div>

							<div class="flex gap-2">
								<input
									type="text"
									placeholder="Add a conversation starter..."
									class="flex-1 px-3 py-2 rounded-xl border-2 border-black"
								/>
								<button
									class="bg-pink-500 text-white px-4 py-2 rounded-xl border-2 border-black hover:bg-pink-600 transition-colors"
								>
									Add
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

{#snippet blocker()}
	{#if !data.hasLinkedGoogle}
		<div
			class="absolute inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-md"
		>
			<div
				class="flex flex-col gap-2 items-center justify-center bg-white rounded-xl p-4 h-1/2 w-1/2"
			>
				<h1 class="text-2xl font-black">Verify your email</h1>
				<p class="text-sm text-gray-500">Please link your email to continue.</p>
				<button
					onclick={async () => {
						await authClient.signIn.social({
							provider: 'google',
							callbackURL: '/connect'
						});
					}}
					class="text-pink-500 bg-slate-100 rounded-xl px-4 py-2"
				>
					Link your google account
				</button>
			</div>
		</div>
	{/if}
{/snippet}
