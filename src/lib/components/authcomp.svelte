<script lang="ts" module>
	export type ToastData = {
		title: string;
		description: string;
		color: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { authClient } from '$lib/client';
	import { createDialog, melt, createTabs } from '@melt-ui/svelte';
	import { flip } from 'svelte/animate';
	import { crossfade, fade, fly } from 'svelte/transition';
	import * as v from 'valibot';
	import { X } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import MainToast from './MainToast/MainToast.svelte';
	import { cubicInOut } from 'svelte/easing';

	let mainToast: MainToast;

	const LoginSchema = v.object({
		email: v.pipe(v.string(), v.minLength(1), v.email()),
		password: v.pipe(v.string(), v.minLength(1))
	});

	const SignUpSchema = v.object({
		name: v.pipe(v.string(), v.minLength(1)),
		email: v.pipe(v.string(), v.minLength(1), v.email()),
		password: v.pipe(v.string(), v.minLength(1))
	});

	const toastData: ToastData[] = [
		{
			title: 'Success',
			description: 'Congratulations! It worked!',
			color: 'bg-green-500'
		},
		{
			title: 'Warning',
			description: 'Please check again.',
			color: 'bg-orange-500'
		},
		{
			title: 'Error',
			description: 'Something did not work!',
			color: 'bg-red-500'
		}
	];

	function addAuthToast(type: 'success' | 'warning' | 'error') {
		mainToast.createNewToast(toastData[type === 'success' ? 0 : type === 'warning' ? 1 : 2]);
	}

	const session = authClient.useSession();

	let email = $state('');
	let password = $state('');
	let name = $state('');
	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open }
	} = createDialog({
		forceVisible: true
	});

	const triggers = [
		{
			label: 'Sign in',
			id: 'signin'
		},
		{
			label: 'Sign up',
			id: 'signup'
		}
	];

	let className = $state('');
	export { className as class };

	const {
		elements: { root: tabsroot, list: tablist, content: tabcontent, trigger: tabtrigger },
		states: { value }
	} = createTabs({
		defaultValue: 'signin'
	});

	async function signIn({ email, password }: { email: string; password: string }) {
		console.log(email, password);

		try {
			const result = v.parse(LoginSchema, {
				email,
				password
			});

			await authClient.signIn.email(
				{
					email: result.email,
					password: result.password
				},
				{
					onError: (error) => {
						console.log(error);
						addAuthToast('error');
						open.set(false);
					},
					onSuccess: () => {
						open.set(false);
					}
				}
			);
		} catch (error) {
			console.log(error);
		}
	}

	async function signUp({
		email,
		password,
		name
	}: {
		email: string;
		password: string;
		name: string;
	}) {
		console.log(email, password, name);

		try {
			const result = v.parse(SignUpSchema, {
				email,
				password,
				name
			});

			await authClient.signUp.email(
				{
					name: result.name,
					email: result.email,
					password: result.password
				},
				{
					onError: (error) => {
						console.log(error);
						addAuthToast('error');
					},
					onSuccess: () => {
						open.set(false);
					}
				}
			);
		} catch (error) {
			console.log(error);
		}
	}

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});
</script>

<div class="absolute top-10 right-10">
	<MainToast bind:this={mainToast} />
	{@render authConditional()}
</div>

{#snippet authConditional()}
	{#if $session.isPending}
		<div>Loading...</div>
	{:else if $session.data?.session}
		<div>
			<button
				class="bg-pink-200 text-black px-4 py-2 rounded-full hover:bg-pink-300"
				onclick={async () => await authClient.signOut()}
			>
				Sign out
			</button>
			<a href="/connect">
				<button class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full">
					Start the connection...
				</button>
			</a>
		</div>
	{:else}
		<div>
			<button use:melt={$trigger} class="bg-blue-500 text-white px-4 py-2 rounded-full">
				Sign in / Sign up
			</button>
			{#if $open}
				<div
					use:melt={$overlay}
					class="fixed inset-0 bg-black/50"
					transition:fade={{ duration: 200 }}
				>
					<div
						class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6"
						use:melt={$content}
						transition:fade={{ duration: 200 }}
					>
						<div
							use:melt={$tabsroot}
							class={cn(
								'flex max-w-[25rem] flex-col overflow-hidden rounded-xl shadow-lg  data-[orientation=vertical]:flex-row',
								className
							)}
						>
							<div
								use:melt={$tablist}
								class="flex shrink-0 overflow-x-auto bg-neutral-100
    data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
								aria-label="Manage your account"
							>
								{#each triggers as triggerItem}
									<button use:melt={$tabtrigger(triggerItem.id)} class="trigger relative">
										{triggerItem.label}
										{#if $value === triggerItem.id}
											<div
												in:send={{ key: 'trigger' }}
												out:receive={{ key: 'trigger' }}
												class="absolute bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-pink-400"
											></div>
										{/if}
									</button>
								{/each}
							</div>
							<div use:melt={$tabcontent('signin')} class="grow bg-white p-5">
								<h1 use:melt={$title} class="scroll-m-20 text-3xl font-semibold tracking-tight">
									Sign in
								</h1>
								<p use:melt={$description} class="leading-7 [&:not(:first-child)]:mt-6">
									Sign in to your account to continue.
								</p>
								<form
									class="mt-6 space-y-4"
									onsubmit={async (e) => {
										e.preventDefault();
										await signIn({ email, password });
									}}
								>
									<div>
										<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
										<input
											bind:value={email}
											type="email"
											id="email"
											placeholder="Enter your email"
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-magnum-500 focus:ring-magnum-500"
										/>
									</div>
									<div>
										<label for="password" class="block text-sm font-medium text-gray-700"
											>Password</label
										>
										<input
											bind:value={password}
											type="password"
											id="password"
											placeholder="Enter your password"
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-magnum-500 focus:ring-magnum-500"
										/>
									</div>
									<button
										type="submit"
										class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
									>
										Sign In
									</button>
								</form>
							</div>
							<div use:melt={$tabcontent('signup')} class="grow bg-white p-5">
								<h1 use:melt={$title} class="scroll-m-20 text-3xl font-semibold tracking-tight">
									Sign up
								</h1>
								<p use:melt={$description} class="leading-7 [&:not(:first-child)]:mt-6">
									Sign up to your account to continue.
								</p>
								<form
									class="mt-6 space-y-4"
									onsubmit={async (e) => {
										e.preventDefault();
										await signUp({ email, password, name });
									}}
								>
									<div>
										<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
										<input
											bind:value={name}
											type="text"
											id="name"
											placeholder="Enter your name"
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-magnum-500 focus:ring-magnum-500"
										/>
									</div>
									<div>
										<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
										<input
											bind:value={email}
											type="email"
											id="email"
											placeholder="Enter your email"
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
										/>
									</div>
									<div>
										<label for="password" class="block text-sm font-medium text-gray-700"
											>Password</label
										>
										<input
											bind:value={password}
											type="password"
											id="password"
											placeholder="Enter your password"
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
										/>
									</div>
									<button
										type="submit"
										class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
									>
										Sign In
									</button>
								</form>
								<button
									onclick={async () =>
										await authClient.signIn.social({
											provider: 'google'
										})}
									class="w-full mt-2 py-2 flex items-center justify-center gap-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Sign in with Google <svg
										xmlns="http://www.w3.org/2000/svg"
										x="0px"
										y="0px"
										width="20"
										height="20"
										viewBox="0 0 48 48"
									>
										<path
											fill="#FFC107"
											d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
										></path><path
											fill="#FF3D00"
											d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
										></path><path
											fill="#4CAF50"
											d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
										></path><path
											fill="#1976D2"
											d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
										></path>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

<!-- {#snippet toast()}
	<div
		class="fixed right-0 top-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
		use:portal
	>
		{#each $toasts as { id, data, getPercentage } (id)}
			{@const percentage = getPercentage()}
			<div
				use:melt={$toastContent(id)}
				animate:flip={{ duration: 500 }}
				in:fly={{ duration: 150, x: '100%' }}
				out:fly={{ duration: 150, x: '100%' }}
				class="rounded-lg bg-neutral-800 text-white shadow-md"
			>
				<div
					use:melt={$progress}
					class="absolute left-5 top-2 h-1 w-[10%] overflow-hidden rounded-full bg-black/40"
				>
					<div
						class="h-full w-full bg-magnum-500"
						style={`transform: translateX(-${100 - (100 * percentage) / 100}%)`}
					></div>
				</div>
				<div
					class="relative flex w-[24rem] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 p-5"
				>
					<div>
						<h3 use:melt={$toastTitle(id)} class="flex items-center gap-2 font-semibold">
							{data.title}
							<span class="size-1.5 rounded-full {data.color}"></span>
						</h3>
						<div use:melt={$toastDescription(id)}>
							{data.description}
						</div>
					</div>
					<button
						use:melt={$toastClose(id)}
						class="absolute right-4 top-4 grid size-6 place-items-center rounded-full text-magnum-500
          hover:bg-magnum-900/50"
					>
						<X class="size-4" />
					</button>
				</div>
			</div>
		{/each}
	</div>
{/snippet} -->

<style lang="postcss">
	.trigger {
		display: flex;
		align-items: center;
		justify-content: center;

		cursor: default;
		user-select: none;

		border-radius: 0;
		background-color: theme(colors.neutral.100);

		color: theme(colors.neutral.900);
		font-weight: 500;
		line-height: 1;

		flex: 1;
		height: theme(spacing.12);
		padding-inline: theme(spacing.2);

		&:focus {
			position: relative;
		}

		&:focus-visible {
			@apply z-10 ring-2;
		}

		&[data-state='active'] {
			@apply focus:relative;
			background-color: white;
			color: theme('colors.pink.900');
		}
	}

	input {
		height: theme(spacing.8);
		flex-shrink: 0;
		flex-grow: 1;
		border-radius: theme(borderRadius.md);
		border: 1px solid theme(colors.neutral.200);
		padding-inline: theme(spacing[2.5]);
		line-height: 1;
		color: theme(colors.neutral.900);

		&:focus {
			border-color: theme(colors.pink.400);
		}
	}

	.save {
		display: inline-flex;
		height: theme(spacing.8);
		cursor: default;
		align-items: center;
		justify-content: center;
		border-radius: theme(borderRadius.md);
		background-color: theme(colors.pink.200);
		padding-inline: theme(spacing.4);
		line-height: 1;
		font-weight: theme(fontWeight.semibold);
		color: theme(colors.pink.900);
		@apply transition;

		&:hover {
			opacity: 0.75;
		}

		&:focus {
			@apply !ring-green-600;
		}
	}
</style>
