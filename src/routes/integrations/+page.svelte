<script>
  import { parse, serialize } from 'cookie';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import FaReddit from 'svelte-icons/fa/FaReddit.svelte';
  import FaTwitterSquare from 'svelte-icons/fa/FaTwitterSquare.svelte';
  import { removeIntegration } from '$lib/api';

  let { user } = $page.data;

  async function getTwitterAuthLink() {
    const linkResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/twitter/link`);
    const { link } = await linkResponse.json();

    window.location = link;
  }

  async function handleRemoveIntegration(integration) {
    const response = await removeIntegration(integration);
    const updatedUser = await response.json();
    console.log('updatedUser', updatedUser);
    user = updatedUser;
  }
</script>

<div class="login">
  <div class="twitter">
    <h1>Twitter</h1>
    {#if user.twitter_access_token}
      <p>
        Signed in as <a href="https://www.twitter.com/{user.twitter_username}" target="_twitter"
          >{user.twitter_username}</a
        >.
      </p>
      <button
        class="btn btn-danger btn-sm"
        on:click={() => {
          handleRemoveIntegration('twitter');
        }}>Remove this integration</button
      >
    {:else}
      <p>Login with your Twitter account to enable searching Twitter.</p>
      <button class="btn btn-primary btn-sm" on:click={getTwitterAuthLink}>
        <div class="icon">
          <FaTwitterSquare />
        </div>
        <span>Login</span>
      </button>
    {/if}
  </div>

  <div class="reddit">
    <h1>Reddit</h1>

    {#if user.reddit_access_token}
      <p>
        Signed in as <a href="https://www.reddit.com/u/{user.reddit_username}" target="_reddit"
          >{user.reddit_username}</a
        >.
      </p>
      <button
        class="btn btn-danger btn-sm"
        on:click={() => {
          handleRemoveIntegration('reddit');
        }}>Remove this integration</button
      >
    {:else}
      <p>Login with your Reddit account to enable searching with Reddit.</p>
      <button
        class="btn btn-primary btn-sm"
        on:click={() => {
          goto('/api/auth/reddit/authorize?redirect=/integrations');
        }}
      >
        <div class="icon">
          <FaReddit />
        </div>
        <span>Login</span>
      </button>
    {/if}
  </div>
</div>

<style>
  .login {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    gap: 20px;
  }

  button {
    display: inline-flex;
    justify-content: center;
    padding: 5px 10px;
  }

  .icon {
    display: inline-block;
    height: 16px;
    margin-right: 0.25rem;
  }
</style>
