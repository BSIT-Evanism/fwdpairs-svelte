<script>
	import { Heart, MessageCircle, User, Settings } from 'lucide-svelte';
</script>

<nav class="bg-pink-500 p-4 shadow-md">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/connect" class="text-white text-2xl font-bold">LoveConnect</a>
		<div class="space-x-4 flex items-center gap-2">
			<a
				href="/connect/matches"
				class="text-white hover:text-pink-200 transition-colors flex items-center"
			>
				<Heart class="w-5 h-5 mr-2" />Matches
			</a>
			<a
				href="/connect/messages"
				class="text-white hover:text-pink-200 transition-colors flex items-center"
			>
				<MessageCircle class="w-5 h-5 mr-2" />Messages
			</a>
			<a
				href="/connect/profile"
				class="text-white hover:text-pink-200 transition-colors flex items-center"
			>
				<User class="w-5 h-5 mr-2" />Profile
			</a>
			<a
				href="/connect/settings"
				class="text-white hover:text-pink-200 transition-colors flex items-center"
			>
				<Settings class="w-5 h-5 mr-2" />Settings
			</a>
		</div>
	</div>
</nav>
