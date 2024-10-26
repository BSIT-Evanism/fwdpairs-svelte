<script>
  import Authcomp from "$lib/components/authcomp.svelte";
</script>

<div class="page flex flex-col items-center justify-center">
  <Authcomp />
  <div
    class="bg-white rounded-3xl p-10 shadow-lg w-full max-w-2xl min-h-[20rem]"
  >
    <h1 class="text-4xl font-bold">Start the connection...</h1>
    <p class="text-sm text-gray-500">
      Meet new people, make new friends, and explore the world together.
    </p>
  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    background:
      linear-gradient(180deg, #fff0 0%, #ffff 100%),
      conic-gradient(from 90deg at 1px 1px, #8880 90deg, #888f 0) center -1px / 50px
        50px;
  }
</style>
