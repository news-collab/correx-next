<script>
  import moment from 'moment';
  import { Circle2 } from 'svelte-loading-spinners';
  import { getTwitterReplies } from '@/lib/api';
  import TwitterReply from '@/components/replies/TwitterReply.svelte';

  export let post;
  export let subjectId;
  export let postId;
  export let reply = {};
  let loading = true;

  let replyComments = [];

  function handleNewReply(e) {
    const { detail: newReply } = e;
    console.log('new reply', newReply);
    const replies = [...post.replies, newReply];

    post = {
      ...post,
      replies
    };
  }

  function updateReplyComments(comments) {
    replyComments = comments;
  }

  $: (async () => {
    loading = true;
    console.log('twitter reply changes', subjectId, postId, reply.id);
    const twitterCommentsResponse = await getTwitterReplies(subjectId, postId, reply.id);
    console.log('twitter replies', twitterCommentsResponse);
    updateReplyComments(await twitterCommentsResponse.json());
    loading = false;
  })();
</script>

<div class="replies">
  {#each post.replies as reply}
    {#if loading && replyComments.length === 0}
      <div class="loading">
        <Circle2 size="60" color="#FF3E00" unit="px" duration="1s" />
      </div>
    {/if}
    {#if replyComments.length > 0}
      <div class="twitter-comment-replies">
        {#each replyComments as comment}
          <div class="comment">
            <div class="header">
              <p>
                <span class="author"
                  ><a
                    href={`https://www.reddit.com/u/${comment.author}`}
                    target="reddit_${comment.author}">{comment.author}</a
                  ></span
                >
                wrote on
                <span class="created">
                  {moment(comment.created_utc * 1000).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                </span>
              </p>
            </div>
            <div class="body"><p>{@html comment.body_html}</p></div>
            <div class="footer">
              <a
                href={`https://www.reddit.com/${comment.permalink}`}
                target="reddit_comment_${comment.id}">permalink</a
              >
            </div>
            <div class="replies">
              {#each comment.replies as reply}
                <div class="header">
                  <p>
                    <span class="author"
                      ><a
                        href={`https://www.reddit.com/u/${comment.author}`}
                        target="reddit_${comment.author}">{reply.author}</a
                      ></span
                    >
                    wrote on
                    <span class="created">
                      {moment(reply.created_utc * 1000).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                    </span>
                  </p>
                </div>
                <div class="body"><p>{@html reply.body_html}</p></div>
                <div class="footer">
                  <a
                    href={`https://www.reddit.com/${reply.permalink}`}
                    target="reddit_comment_${reply.id}">permalink</a
                  >
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</div>

<style>
  .replies {
    margin-bottom: 10px;
  }

  .reply {
    border-bottom: 1px solid rgb(38, 38, 38);
  }

  .reply .header {
    display: flex;
  }

  .author {
    font-weight: bold;
  }

  .created {
    font-size: 0.9em;
  }

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
</style>
