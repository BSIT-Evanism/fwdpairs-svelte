<script lang="ts">
	import { authClient } from '$lib/client';
	import { createDialog, melt, createToaster } from '@melt-ui/svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import * as v from 'valibot';
	import { X } from 'lucide-svelte';

	const LoginSchema = v.object({
		email: v.pipe(v.string(), v.minLength(1), v.email()),
		password: v.pipe(v.string(), v.minLength(1))
	});

	type ToastData = {
		title: string;
		description: string;
		color: string;
	};

	const {
		elements: {
			content: toastContent,
			title: toastTitle,
			description: toastDescription,
			close: toastClose
		},
		helpers: { addToast },
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>();

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
		addToast({
			data: toastData[type === 'success' ? 0 : type === 'warning' ? 1 : 2]
		});
	}

	const session = authClient.useSession();

	let email = $state('');
	let password = $state('');

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open }
	} = createDialog({
		forceVisible: true
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
</script>

<div class="absolute top-10 right-10">
	{@render toast()}
	{@render authConditional()}
</div>

{#snippet authConditional()}
	{#if $session.isPending}
		<div>Loading...</div>
	{:else if $session.data?.session}
		<div>
			<button
				class="bg-red-500 text-white px-4 py-2 rounded-full"
				onclick={async () => await authClient.signOut()}
			>
				Sign out
			</button>
			<a href="/connect">
				<button class="bg-blue-500 text-white px-4 py-2 rounded-md">
					Start the connection...
				</button>
			</a>
		</div>
	{:else}
		<div>
			<button use:melt={$trigger} class="bg-blue-500 text-white px-4 py-2 rounded-full">
				Sign in
			</button>
			{#if $open}
				<div
					use:melt={$overlay}
					class="fixed inset-0 bg-black/50"
					transition:fade={{ duration: 200 }}
				>
					<div
						class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg"
						use:melt={$content}
						transition:fade={{ duration: 200 }}
					>
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
								class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-magnum-600 hover:bg-magnum-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-magnum-500"
								>Sign In</button
							>
						</form>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet toast()}
	<div
		class="fixed right-0 top-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
		use:portal
	>
		{#each $toasts as { id, data } (id)}
			<div
				use:melt={$toastContent(id)}
				animate:flip={{ duration: 500 }}
				in:fly={{ duration: 150, x: '100%' }}
				out:fly={{ duration: 150, x: '100%' }}
				class="rounded-lg bg-neutral-800 text-white shadow-md"
			>
				<div
					class="relative flex w-[24rem] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 p-5"
				>
					<div>
						<h3 use:melt={$toastTitle(id)} class="flex items-center gap-2 font-semibold">
							{data.title}
							<span class="size-1.5 rounded-full {data.color}" />
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
{/snippet}
