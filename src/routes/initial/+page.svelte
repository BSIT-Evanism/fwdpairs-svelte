<script lang="ts">
    import {HeartCrack} from  'lucide-svelte'
    const { data } = $props();


    let step = $state(1)
    let name = $state("")
    let nickname = $state("")
    let age = $state(0)
    let gender = $state<"male" | "female" | "non-binary" | "prefer not to say">("prefer not to say")
    let missing = $state<string[]>([])

    function updateMissing() {
        const newMissing = [];
        if (!name) newMissing.push("Name");
        if (!nickname) newMissing.push("Nickname");
        if (!gender) newMissing.push("Gender");
        missing = newMissing;
    }

    $effect(() => {
        updateMissing()
    })
</script>

{#snippet step1({ name }: { name: string })}
        <div class="p-2">
            <h1 class="text-4xl font-bold">Good day, {name}</h1>
            <h2>Let's get you started</h2>
        </div>
        <div
            class="flex flex-col justify-center items-center h-80 w-full bg-slate-100 rounded-xl p-4 gap-4"
        >
            <button onclick={() => step++} class=" bg-pink-500 text-white p-2 rounded-md">
                Continue
            </button>
        </div>
{/snippet}

{#snippet step2()}
    <div class="p-2">
        <h1 class="text-4xl font-bold">What would you like to be called?</h1>
        <p>please enter your name and nickname</p>
    </div>
    <div class="flex flex-col justify-center items-center h-80 w-full bg-slate-100 rounded-xl p-4 gap-4">
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
{/snippet}

{#snippet step3()}
    <div>Step 3</div>
{/snippet}

{#snippet missingInputs({ missing }: { missing: string[] })}
    <div class={`flex flex-col gap-2 absolute top-5 justify-center items-center bg-white border-2 border-pink-200 rounded-xl p-4 -z-10  w-32 h-32 shadow-lg transition-all duration-300 ${missing.length > 0 ? '-left-[120px]' : 'left-0'}`}>
        <HeartCrack class="w-10 h-10 text-pink-500" />
        <p>{missing.length} missing fields</p>
    </div>
{/snippet}

<div class="page flex flex-col items-center justify-center">
    <div
        class="w-full max-w-2xl h-full min-h-96 bg-white border-2 border-pink-200 rounded-3xl relative p-10 shadow-lg"
    >
        {@render missingInputs({ missing })}
        {#if step === 1}
            {@render step1({name: data.name})}
        {:else if step === 2}
            {@render step2()}
        {:else if step === 3}
            {@render step3()}
        {/if}
    </div>
</div>




<style>
    .page {
        min-height: 100vh;
    }
</style>
