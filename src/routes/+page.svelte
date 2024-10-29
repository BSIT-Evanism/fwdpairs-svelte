<script>
	import Authcomp from '$lib/components/authcomp.svelte';
</script>

<div class="page flex flex-col items-center justify-center">
	<Authcomp />
	<div
		class="bg-pink-50 p-10 w-full max-w-2xl min-h-[20rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
	>
		<h1 class="scroll-m-20 text-4xl font-black tracking-tight">Start the connection...</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-black">
			Meet new people, make new friends, and explore the world together.
		</p>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #ffcdd9;
	}
</style>
