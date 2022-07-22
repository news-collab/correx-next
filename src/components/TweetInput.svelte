<script>
  import { onMount } from "svelte";
  import twitterText from "twitter-text";
  import moment from "moment";
  import enableTweeting from "./Source/enableTweeting.js";
  import { getConversation } from "@/api";

  export let sendTweet = function () {
    console.log("default sendTweet");
  };
  export let tweet = {
    text: "dummy text",
    lang: "en",
    user: {
      screen_name: "user",
      name: "user",
    },
  };
  export let tweetText = "";
  let tweetParse;
  let textIsTooLong = false;
  let textIsEmpty = false;
  let tweets = [];
  let users = {};

  async function getConvo(id) {
    const conversationResponse = await getConversation(tweet.id_str);
    try {
      const conversationJSON = await conversationResponse.json();
      tweets = conversationJSON.conversation.data;
      conversationJSON.conversation.includes.users.forEach(u => {
        users[u.id] = u;
      });
    } catch (e) {
      console.log(`could not get conversation: ${e}`);
    }
  }

  onMount(async () => {
    getConvo(tweet.id_str);
  });

  $: {
    tweetParse = twitterText.parseTweet(tweetText);
    textIsTooLong = tweetParse.weightedLength > 280;
    textIsEmpty = tweetParse.weightedLength == 0;
    //if (textIsTooLong) { console.log(`Text is too long! ${tweetParse.weightedLength} / 280`) }
    getConvo(tweet.id_str);
  }
</script>

<div class="reply-pane">
  {#each tweets as tweet}
  <div class="tweet">
    <div>{users[tweet.author_id].username} - {moment(tweet.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
    <p>{tweet.text}</p>
  </div>
  {/each}
  <textarea class:error={textIsTooLong} bind:value={tweetText} />
  <div>
    <button
      disabled={!$enableTweeting || textIsTooLong || textIsEmpty}
      on:click|preventDefault={() => sendTweet(tweetText)}>send tweet</button
    >
    <div class:error={textIsTooLong}>{tweetParse.weightedLength} / 280</div>
  </div>
</div>

<style>
  textarea {
    min-height: 5em;
    min-width: 600px;
    font-size: 16px;
    padding: 16px;
    margin: auto;
    border-radius: 10px;
    border-color: rgb(207, 217, 222);
  }

  textarea.error {
    -webkit-box-shadow: 0px 0px 2px 4px red; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
    -moz-box-shadow: 0px 0px 2px 4px red; /* Firefox 3.5 - 3.6 */
    box-shadow: 0px 0px 2px 4px red; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
  }

  div.error {
    color: red;
  }

  .reply-pane {
    margin: 5px;
    padding: 5px;
  }

  button {
    font-size: 16px;
  }
</style>
