<script context="module">
  export async function load({ params, fetch }) {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/subject/${params.id}.json`);

    if (res.status === 200) {
      const data = await res.json();
      return { props: { source_id: params.id, data } };
    }

    return {
      status: 500
    };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import BreadCrumbs from '../../../../components/Source/Breadcrumbs.svelte';
  import FollowupPane from '../../../../components/Source/FollowupPane.svelte';
  import Switch from '../../../../components/Switch.svelte';
  import Tweet from '../../../../components/Tweet.svelte';
  import enableTweeting from '../../../../components/Source/enableTweeting';

  export let data = {};
  export let source_id;
  let message = ``;
  const defaultMessage = `Type your message to people you want to send a correction to their followers`;
  let posts = {
    twitter: []
  };
  let replySheet = [];

  onMount(() => {
    posts.twitter = data.twitter.map((p) => p.data);
    replySheet = data.twitter
      .filter((p) => p.starred)
      .map((post) => {
        let row = {
          replyText: '',
          replySent: false,
          showReply: false,
          post,
          replies: []
        };
        return row;
      });
  });

  function copyTemplateTextToReplies() {
    replySheet.forEach((row) => {
      row.replyText = message;
      row.showReply = true;
    });
    replySheet = replySheet; // hax to get rerendering.
    alert('Copied message\n' + message);
  }

  async function sendTweet(entry, replyText, el) {
    // { status: entry.reply, in_reply_to_status_id: entry.post.data.id_str }
    const responseEndpoint = `/subject/${source_id}/followup/responses.json`;
    // try goes here
    let payload = { status: replyText };
    if (entry && entry.post && entry.post.data) {
      payload.in_reply_to_status_id = entry.post.data.id_str;
    }
    const response = await fetch(responseEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses: [payload] })
    });
    const tweetResponse = await response.json();
    entry.replyText = '';
    alert('Reply sent!');
  }

  function sendReply(entry) {
    entry.replySent = true;
  }

  import DebugPanel from '../../../../components/DebugPanel.svelte';
  let openDebugPanel = false;
  function handleKeydown(event) {
    const key = event.key;
    const keyCode = event.keyCode;
    if (keyCode == 27) {
      openDebugPanel = !openDebugPanel;
    }
  }

  async function dump() {
    const responseEndpoint = `/subject/${source_id}/followup/responses.json`;
    const response = await fetch(responseEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses: [{ status: 'things' }] })
    });
    const saved = await response.json();
  }
</script>

<svelte:window on:keydown={handleKeydown} />
{#if openDebugPanel}
  <DebugPanel {dump} />
{/if}

<h1>Follow up</h1>

<header>
  <BreadCrumbs id={source_id} active={'followup'} />
  <Switch bind:state={$enableTweeting}>Enable Sending Tweets</Switch>
</header>
<!-- list of tweets sent from the tool here. -->

<section id="correction">
  <h2>Write a tweet to your followers</h2>
  <textarea name="" id="" bind:value={message} placeholder={defaultMessage} />
  <div>
    <button disabled={!$enableTweeting} on:click={() => sendTweet({ replyText: message }, message)}
      >send tweet</button
    >
  </div>

  <hr />

  <h2>Write replies to selected tweets</h2>

  <!--<div>
    <button on:click|preventDefault={copyTemplateTextToReplies}>
      Copy message as reply
    </button>
  </div>-->
</section>

<section>
  <div class="accordion" id="accordionExample">
    {#each replySheet as entry}
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#followup-${entry.post.data.id_str}`}
            aria-expanded="true"
            aria-controls={`followup-${entry.post.data.id_str}`}
          >
            @{entry.post.data.user.name}
            {entry.post.data.user.followers_count} followers
            {entry.post.data.retweet_count} retweets
          </button>
        </h2>
        <div
          id={`followup-${entry.post.data.id_str}`}
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <FollowupPane {entry} enableTweeting={$enableTweeting} {sendTweet} />
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  textarea {
    min-height: 5em;
    min-width: 600px;
    font-size: 16px;
    padding: 16px;
    margin: auto;
  }

  button {
    font-size: 16px;
  }

  hr {
    margin: 16px;
  }
</style>
