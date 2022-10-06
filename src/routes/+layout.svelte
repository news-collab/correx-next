<script>
  import NavBar from '@/components/NavBar.svelte';
  import IntegrationSetup from '@/components/IntegrationSetup.svelte';
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<NavBar user={data.user} />
<div class="main container-xl">
  <IntegrationSetup user={data.user} />
  <slot />
</div>
