<script>
  import { onMount, tick } from "svelte";

  let replySheet = [];
  let enableTweeting = false;
  let sendReply = () => {};

  onMount(async () => {
    await tick();
  });
</script>

<div>
  {#each replySheet as entry}
    <div>
      <div class="tweet">
        <div>
          {entry.post.data.user.name} (<a
            href="https://twitter.com/{entry.post.data.user.screen_name}"
            >@{entry.post.data.user.screen_name}</a
          >)
        </div>
        <p>{entry.post.data.text}</p>
      </div>
      {#if entry.showReply}
        <div class="reply-pane">
          <p>
            reply with (<span
              on:click={() => (entry.showReply = false)}
              class="link">hide</span
            >)
          </p>
          <textarea bind:value={entry.reply} />
          <button
            disabled={entry.replySent || !enableTweeting}
            on:click|preventDefault={() => sendReply(entry)}>send reply</button
          >
        </div>
      {:else}
        <div class="reply-link">
          <span
            on:click={() => {
              entry.showReply = true;
            }}
            class="link"
          >
            {#if entry.reply && entry.reply == ""}
              write a reply
            {:else}
              show reply
            {/if}
          </span>
        </div>
      {/if}
    </div>
  {:else}
    <p>No Tweets Selected {JSON.stringify(replySheet)}</p>
  {/each}
</div>

<style>
  textarea {
    min-height: 5em;
    min-width: 600px;
    font-size: 16px;
    padding: 16px;
    margin: auto;
  }

  .tweet {
    border: 1px solid black;
    margin: 8px;
    padding: 8px;
    border-radius: 4px;
  }

  .reply-pane {
    margin: 8px;
    padding: 8px;
  }

  .link {
    text-decoration: underline;
    cursor: pointer;
  }

  button {
    font-size: 16px;
  }
</style>
