<script>
  import { getStores, navigating, page } from '$app/stores';
  export let user = {};
</script>

{#if $page.url.pathname != '/integrations' && (!user.reddit_access_token || !user.twitter_access_token)}
  <div class="alert alert-warning" role="alert">
    You don't have all integrations configured and won't be able interact with the missing
    integration's platform specific content without <a href="/integrations">connecting</a> your account
    first.
  </div>
{/if}
