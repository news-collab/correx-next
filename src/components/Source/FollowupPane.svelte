<script>
  import { onMount } from "svelte";
  import Tweet from "../Tweet.svelte";
  import TweetInput from "../TweetInput.svelte";
  export let entry = {};
  export let sendTweet = function () {
    console.log("default sendTweet");
  };

  let senderFactory = function (entry) {
    return (text, el) => sendTweet(entry, text, el);
  };

  let tweetData = entry.post.data;

  onMount(() => {
    tweetData = entry.post.data;
  });
</script>

<div class="followup-pane">
  <!--
  <div class="tweet">
    <div>{entry.post.data.user.name} (<a href="https://twitter.com/{entry.post.data.user.screen_name}">@{entry.post.data.user.screen_name}</a>)</div>
    <p>{entry.post.data.text}</p>
  </div>
  -->
  <Tweet tweet={tweetData} />
  <TweetInput tweet={tweetData} tweetText={entry.replyText} sendTweet={senderFactory(entry)} />
</div>

<style>
  .followup-pane {
    display: flex;
    min-height: 200px;
  }
</style>
