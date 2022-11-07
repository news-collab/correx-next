<script>
  import moment from 'moment';
  import { Circle2 } from 'svelte-loading-spinners';
  import { getTwitterReplies } from '@/lib/api';

  export let subjectId;
  export let post;
  export let reply = {};
  let loading = true;

  let replyComments = [];

  function updateReplyComments(comments) {
    console.log(comments);
    replyComments = comments;
  }

  $: (async () => {
    loading = true;
    console.log('twitter reply changes', subjectId, post.id, reply.id);
    const replyCommentsResponse = await getTwitterReplies(subjectId, post.id, reply.id);
    const tweetData = await replyCommentsResponse.json();
    updateReplyComments(tweetData);
    console.log('tweet data', tweetData);
    loading = false;
  })();
</script>

<div class="comment-replies">
  {#if reply.author}
    <div class="comment">
      <div class="header">
        <p>
          <span class="author"
            ><a
              href={`https://www.twitter.com/${reply.author.twitter_username}`}
              target="twitter_${reply.author.twitter_user_id}">{reply.author.twitter_username}</a
            ></span
          >
          wrote on
          <span class="created">
            {moment(reply.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
          </span>
        </p>
      </div>
      <div class="body"><p>{@html reply.data.body}</p></div>
      <div class="footer">
        <a href={reply.data.permalink} target="twitter_${reply.platform_id}">permalink</a>
      </div>
    </div>
  {/if}
  {#if loading && replyComments.length === 0}
    <div class="loading">
      <Circle2 size="60" color="#FF3E00" unit="px" duration="1s" />
    </div>
  {/if}
  {#if replyComments.length > 0}
    <div class="replies">
      {#each replyComments as comment}
        <div class="comment">
          <div class="header">
            <p>
              <span class="author"
                ><a
                  href={`https://www.twitter.com/${comment.author.username}`}
                  target="twitter_${comment.tweet.author_id}">{comment.author.username}</a
                ></span
              >
              wrote on
              <span class="created">
                {moment(comment.tweet.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
              </span>
            </p>
          </div>
          <div class="body"><p>{@html comment.tweet.text}</p></div>
          <div class="footer">
            <a
              href={`https://www.twitter.com/${comment.author.username}/status/${comment.tweet.id}`}
              target="twitter_${comment.tweet.id}">permalink</a
            >
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .loading {
    display: flex;
    justify-content: center;
  }

  .created {
    font-weight: bold;
    font-size: 0.8em;
  }

  .footer {
    font-size: 0.8em;
    margin-bottom: 15px;
  }

  .footer a {
    color: #767676;
  }

  .replies {
    margin-left: 20px;
    padding-left: 10px;
    border-left: 1px solid #dddddd;
  }

  .replies {
    margin-left: 20px;
    padding-left: 10px;
    border-left: 1px solid #dddddd;
  }
</style>
