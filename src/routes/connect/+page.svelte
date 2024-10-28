<script lang="ts">
	const { data } = $props();
</script>

<div class="flex gap-4 justify-center p-2 items-center h-screen relative">
	<div class="bg-pink-200 h-32 w-52 absolute top-3/4 left-0 rounded-r-full z-10"></div>
	<div class="w-1/2 h-full relative bg-slate-50 rounded-xl p-4"></div>
	<div class="w-1/2 h-full bg-slate-50 rounded-xl p-4">
		<h1 class="text-2xl font-bold">Messages</h1>
	</div>
</div>
