<script lang="ts">
	import { createProgress, melt, type Toast, type ToastsElements } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import type { ToastData } from './MainToast.svelte';
	import { X } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	export let elements: ToastsElements;
	$: ({ content, title, description, close } = elements);

	export let toast: Toast<ToastData>;
	$: ({ data, id, getPercentage } = toast);

	const percentage = writable(0);
	const {
		elements: { root: progress },
		options: { max }
	} = createProgress({
		max: 100,
		value: percentage
	});

	onMount(() => {
		let frame: number;
		const updatePercentage = () => {
			percentage.set(getPercentage());
			frame = requestAnimationFrame(updatePercentage);
		};
		frame = requestAnimationFrame(updatePercentage);

		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	use:melt={$content(id)}
	in:fly={{ duration: 500, x: '100%' }}
	out:fly={{ duration: 500, x: '100%' }}
	class="relative rounded-lg bg-white text-pink-800 shadow-md border-2 border-slate-300"
>
	<div
		use:melt={$progress}
		class="absolute left-4 top-2 h-0.5 w-[20%] overflow-hidden rounded-full bg-pink-200"
	>
		<div
			class="h-full w-full bg-pink-400"
			style={`transform: translateX(-${100 - (100 * ($percentage ?? 0)) / ($max ?? 1)}%)`}
		></div>
	</div>

	<div
		class="relative flex w-[20rem] max-w-[calc(100vw-2rem)] items-center justify-between gap-3 p-4 pt-6"
	>
		<div>
			<h3 use:melt={$title(id)} class="flex items-center gap-2 font-bold text-pink-600 text-sm">
				{data.title}
			</h3>
			<div use:melt={$description(id)} class="text-pink-700 text-sm">
				{data.description}
			</div>
		</div>
		<button
			use:melt={$close(id)}
			class="absolute right-3 top-3 grid size-6 place-items-center rounded-full text-pink-500
          hover:bg-pink-200 transition-colors duration-200"
		>
			<X class="size-4" />
		</button>
	</div>
</div>
