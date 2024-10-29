<script>
	import { Heart, MessageCircle, User, Settings } from 'lucide-svelte';
</script>

<nav
	class="bg-pink-500 p-4 w-1/4 fixed top-0 left-0 z-10 border-4 border-t-0 border-l-0 border-black rounded-br-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
>
	<div class="container mx-auto flex justify-between items-center">
		<a
			href="/connect"
			class="text-white text-2xl font-black tracking-tight hover:translate-y-[-2px] transition-transform"
			>FWDPairs</a
		>
		<div class="space-x-4 flex items-center gap-4">
			<a
				href="/connect/matches"
				class="text-white rounded-xl hover:bg-pink-400 hover:translate-y-[-2px] transition-all px-3 py-2 border-2 border-black flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
			>
				<Heart class="w-5 h-5 " />
			</a>

			<a
				href="/connect/profile"
				class="text-white rounded-xl hover:bg-pink-400 hover:translate-y-[-2px] transition-all px-3 py-2 border-2 border-black flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
			>
				<User class="w-5 h-5 " />
			</a>
			<a
				href="/connect/settings"
				class="text-white rounded-xl hover:bg-pink-400 hover:translate-y-[-2px] transition-all px-3 py-2 border-2 border-black flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
			>
				<Settings class="w-5 h-5 " />
			</a>
		</div>
	</div>
</nav>
