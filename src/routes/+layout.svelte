<script>
  import NavBar from '@/components/NavBar.svelte';
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<NavBar user={data.user} />
<div class="main container-xl">
  <slot />
</div>
