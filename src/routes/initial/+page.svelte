<script lang="ts">
	import { HeartCrack, ArrowLeft, ArrowRight, Loader2Icon } from 'lucide-svelte';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade, fade, fly } from 'svelte/transition';
	import { createTagsInput, melt } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import * as v from 'valibot';
	import MainToast from '$lib/components/MainToast/MainToast.svelte';
	const { data } = $props();

	let mainToast: MainToast;

	const UserDetailsSchema = v.object({
		name: v.pipe(v.string(), v.minLength(1, 'name is required')),
		nickname: v.pipe(v.string(), v.minLength(1, 'nickname is required')),
		age: v.pipe(
			v.number(),
			v.minValue(18, 'age must be at least 18'),
			v.maxValue(100, 'age must be at most 100')
		),
		gender: v.picklist(['male', 'female', 'non-binary', 'prefer not to say']),
		topics: v.pipe(v.array(v.string()), v.minLength(1, 'at least one topic is required'))
	});

	const {
		elements: { root, input, tag, deleteTrigger, edit },
		states: { tags }
	} = createTagsInput({
		defaultTags: [],
		allowed: ['Foodtrip', 'Travel', 'Music', 'Art', 'Fashion', 'Beauty', 'Fitness', 'DIY'],
		unique: true,
		add(tag) {
			return { id: tag, value: tag };
		},
		addOnPaste: true
	});

	let step = $state(1);
	let name = $state('');
	let nickname = $state('');
	let age = $state(0);
	let gender = $state<'male' | 'female' | 'non-binary' | 'prefer not to say'>('prefer not to say');
	let missing = $state<string[]>([]);
	let error = $state<string | null>(null);
	let confirm = $state(false);
	let loading = $state(false);

	function updateMissing() {
		const newMissing = [];
		if (!name) newMissing.push('Name');
		if (!nickname) newMissing.push('Nickname');
		if (!age) newMissing.push('Age');
		if (!gender) newMissing.push('Gender');
		if ($tags.length === 0) newMissing.push('Topics');
		missing = newMissing;
	}

	$effect(() => {
		updateMissing();
	});

	function submitData() {
		const result = v.safeParse(UserDetailsSchema, {
			name,
			nickname,
			age,
			gender,
			topics: $tags.map((t) => t.value)
		});
		if (result.success) {
			console.log(result.output);
			error = '';
			confirm = true;
		} else {
			console.log(result.issues);
			error = result.issues.map((issue) => issue.message).join(', ');
			mainToast.createNewToast({
				title: 'Error',
				description: error,
				color: 'bg-red-500'
			});
		}
	}

	async function confirmData() {
		const result = v.safeParse(UserDetailsSchema, {
			name,
			nickname,
			age,
			gender,
			topics: $tags.map((t) => t.value)
		});
		loading = true;

		if (!result.success) {
			loading = false;
			error = result.issues.map((issue) => issue.message).join(', ');
			mainToast.createNewToast({
				title: 'Error',
				description: error,
				color: 'bg-red-500'
			});
			return;
		}

		const data = new FormData();
		data.append('name', name);
		data.append('nickname', nickname);
		data.append('age', age.toString());
		data.append('gender', gender);
		data.append('topics', $tags.map((t) => t.value).join(','));

		const response = await fetch('?/details', {
			method: 'POST',
			body: data
		});
		mainToast.createNewToast({
			title: 'Success',
			description: 'nice to meet you!',
			color: 'bg-green-200'
		});
		loading = false;
		confirm = false;
	}
</script>

{#snippet step1({ name }: { name: string })}
	<div class="overflow-hidden">
		<div class="p-2">
			<h1 class="text-4xl font-bold">Good day, {name}</h1>
			<h2>Let's get you started</h2>
		</div>
		<div
			class="flex flex-col justify-center items-center h-80 w-full bg-slate-100 rounded-xl p-4 gap-4"
		>
			<button
				onclick={() => step++}
				class="w-full h-full text-xl hover:scale-105 transition-all duration-300 bg-pink-500 text-white p-2 rounded-md"
			>
				Continue
			</button>
		</div>
	</div>
{/snippet}

{#snippet step2()}
	<div class="overflow-hidden">
		<div in:fly={{ y: -100 }} class="p-2">
			<h1 class="text-4xl font-bold">What would you like to be called?</h1>
			<p>please enter your name and nickname</p>
		</div>
		<div
			in:fade
			class="flex flex-col justify-center items-center h-80 w-full bg-slate-100 rounded-xl p-4 gap-4"
		>
			<div class="flex flex-col gap-2 w-full">
				<label for="name">Full Name</label>
				<input type="text" id="name" bind:value={name} class="w-full p-2 rounded-md" />
			</div>
			<div class="flex flex-col gap-2 w-full">
				<label for="nickname">Nickname</label>
				<input type="text" id="nickname" bind:value={nickname} class="w-full p-2 rounded-md" />
			</div>
			<button onclick={() => step++} class=" bg-pink-500 self-end text-white p-2 rounded-md">
				Continue
			</button>
		</div>
	</div>
{/snippet}

{#snippet step3()}
	<div class="overflow-hidden">
		<div in:fly={{ y: -100 }} class="p-2">
			<h1 class="text-4xl font-bold">This details would make us easier to match you with others</h1>
			<p>Please input your age and gender</p>
		</div>
		<div
			in:fade
			class="flex flex-col justify-center items-center h-80 w-full bg-slate-100 rounded-xl p-4 gap-4"
		>
			<div class="flex flex-col gap-2 w-full">
				<label for="age">Age</label>
				<input type="number" bind:value={age} class="w-full p-2 rounded-md" />
			</div>
			<div class="flex flex-col gap-2 w-full">
				<label for="gender">Gender</label>
				<select bind:value={gender} class="w-full p-2 rounded-md">
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="non-binary">Non-binary</option>
					<option value="prefer not to say">Prefer not to say</option>
				</select>
			</div>
			<button onclick={() => step++} class=" bg-pink-500 self-end text-white p-2 rounded-md">
				Continue
			</button>
		</div>
	</div>
{/snippet}

{#snippet step4()}
	<div class="overflow-hidden">
		<div in:fly={{ y: -100 }} class="p-2">
			<h1 class="text-4xl font-bold">What are you interested in?</h1>
			<p>select up to 3 topics</p>
		</div>
		<div
			in:fade
			class="flex flex-col justify-center items-center h-80 w-full bg-slate-100 rounded-xl p-4 gap-4"
		>
			<div class="flex flex-col gap-4 w-full">
				<div class="grid grid-cols-3 gap-2">
					<button
						onclick={() => ($tags = [...$tags, { value: 'Foodtrip', id: 'Foodtrip' }])}
						disabled={$tags.some((tag) => tag.value === 'Foodtrip')}
						class="px-3 py-1 rounded-md bg-magnum-300 disabled:bg-magnum-200"
					>
						Foodtrip
					</button>
					<button
						onclick={() => ($tags = [...$tags, { value: 'Travel', id: 'Travel' }])}
						disabled={$tags.some((tag) => tag.value === 'Travel')}
						class="px-3 py-1 rounded-md bg-magnum-300 disabled:bg-magnum-200"
					>
						Travel
					</button>
					<button
						onclick={() => ($tags = [...$tags, { value: 'Music', id: 'Music' }])}
						disabled={$tags.some((tag) => tag.value === 'Music')}
						class="px-3 py-1 rounded-md bg-magnum-300 disabled:bg-magnum-200"
					>
						Music
					</button>
					<button
						onclick={() => ($tags = [...$tags, { value: 'Art', id: 'Art' }])}
						disabled={$tags.some((tag) => tag.value === 'Art')}
						class="px-3 py-1 rounded-md bg-magnum-300 disabled:bg-magnum-200"
					>
						Art
					</button>
					<button
						onclick={() => ($tags = [...$tags, { value: 'Fashion', id: 'Fashion' }])}
						disabled={$tags.some((tag) => tag.value === 'Fashion')}
						class="px-3 py-1 rounded-md bg-magnum-300 disabled:bg-magnum-200"
					>
						Fashion
					</button>
					<button
						onclick={() => ($tags = [...$tags, { value: 'Beauty', id: 'Beauty' }])}
						disabled={$tags.some((tag) => tag.value === 'Beauty')}
						class="px-3 py-1 rounded-md bg-magnum-300 disabled:bg-magnum-200"
					>
						Beauty
					</button>
					<button
						onclick={() => ($tags = [...$tags, { value: 'Fitness', id: 'Fitness' }])}
						disabled={$tags.some((tag) => tag.value === 'Fitness')}
						class="px-3 py-1 rounded-md bg-magnum-300 disabled:bg-magnum-200"
					>
						Fitness
					</button>
					<button
						onclick={() => ($tags = [...$tags, { value: 'DIY', id: 'DIY' }])}
						disabled={$tags.some((tag) => tag.value === 'DIY')}
						class="px-3 py-1 rounded-md bg-magnum-300 disabled:bg-magnum-200"
					>
						DIY
					</button>
				</div>

				<div
					use:melt={$root}
					class="flex min-w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700
    focus-within:ring focus-within:ring-magnum-400"
				>
					{#each $tags as t}
						<div
							use:melt={$tag(t)}
							class="flex items-center overflow-hidden rounded-md bg-magnum-200 text-magnum-900 [word-break:break-word]
      data-[disabled]:bg-magnum-300 data-[selected]:bg-magnum-400 data-[disabled]:hover:cursor-default
        data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
						>
							<span class="flex items-center border-r border-white/10 px-1.5">{t.value}</span>
							<button
								use:melt={$deleteTrigger(t)}
								class="flex h-full items-center px-1 enabled:hover:bg-magnum-300"
							>
								<X class="size-3" />
							</button>
						</div>
						<div
							use:melt={$edit(t)}
							class="flex items-center overflow-hidden rounded-md px-1.5 [word-break:break-word] data-[invalid-edit]:focus:!ring-red-500"
						></div>
					{/each}

					<input
						use:melt={$input}
						type="text"
						placeholder="Enter tags..."
						class="min-w-[4.5rem] shrink grow basis-0 border-0 text-black outline-none focus:!ring-0 data-[invalid]:text-red-500"
					/>
					<button onclick={() => step++} class="bg-pink-500 text-white p-2 rounded-md">
						Continue
					</button>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet final()}
	<div class="overflow-hidden">
		<div class="p-2">
			<h1 class="text-4xl font-bold">You good with these info?</h1>
			<p>Please confirm your information</p>
			<div class="flex flex-col bg-slate-100 p-4 rounded-md gap-2 w-full">
				<p>Name: {name}</p>
				<p>Nickname: {nickname}</p>
				<p>Age: {age}</p>
				<p>Gender: {gender}</p>
				<p class="flex flex-wrap gap-2">
					Topics:
					{#each $tags as t}
						<span class="bg-magnum-200 p-1 w-20 text-center rounded-md">{t.value}</span>
					{/each}
				</p>
			</div>
			{#if !confirm}
				<button
					onclick={() => submitData()}
					class=" bg-pink-500 mt-2 self-end text-white p-2 rounded-md"
				>
					Continue
				</button>
			{:else}
				<button
					onclick={() => confirmData()}
					disabled={loading}
					class=" bg-blue-300 mt-2 self-end text-white p-2 rounded-md flex items-center gap-2"
				>
					Confirm?
					{#if loading}
						<Loader2Icon class="w-4 h-4 animate-spin" />
					{/if}
				</button>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet missingInputs({ missing }: { missing: string[] })}
	<div
		transition:fade
		class={`flex flex-col gap-2 absolute top-5 justify-center items-center bg-white border-2 border-pink-200 rounded-xl p-4 -z-10  w-32 h-32 shadow-lg transition-all duration-300 ${missing.length > 0 ? '-left-[120px]' : 'left-0'}`}
	>
		<HeartCrack class="w-10 h-10 text-pink-500" />
		<p>{missing.length} missing fields</p>
	</div>
{/snippet}
<div
	class="bg-gradient-to-br from-pink-300 to-white border-2 border-pink-100 fixed inset-0 -z-10"
></div>
<div class="page flex flex-col items-center justify-center">
	<MainToast bind:this={mainToast} />
	<div
		class="w-full max-w-2xl h-full min-h-96 bg-white border-2 border-pink-200 rounded-3xl relative p-10 shadow-lg"
	>
		<div>
			<button onclick={() => step >= 2 && step--} aria-label="goback-1">
				<ArrowLeft class="w-4 h-4" />
			</button>
			<button onclick={() => step <= 4 && step++} aria-label="forward-1">
				<ArrowRight class="w-4 h-4" />
			</button>
		</div>
		{@render missingInputs({ missing })}
		{#if step === 1}
			{@render step1({ name: data.name })}
		{:else if step === 2}
			{@render step2()}
		{:else if step === 3}
			{@render step3()}
		{:else if step === 4}
			{@render step4()}
		{:else if step === 5}
			{@render final()}
		{/if}
		{#if error}
			<p class="text-red-500 bg-red-100 p-2 rounded-md mt-2">{error}</p>
		{/if}
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
	}
</style>
