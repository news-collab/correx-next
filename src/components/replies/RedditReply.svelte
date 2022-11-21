<script>
  import moment from 'moment';
  import { Circle2 } from 'svelte-loading-spinners';
  import { getRedditReplies } from '@/lib/api';

  export let subjectId;
  export let postId;
  export let reply = {};
  let loading = true;
  let loadingErrorMessage = '';
  let replyComments = [];

  function updateReplyComments(comments) {
    replyComments = comments;
  }

  $: (async () => {
    try {
      loading = true;
      const replyCommentsResponse = await getRedditReplies(subjectId, postId, reply.id);

      if (replyCommentsResponse.ok) {
        updateReplyComments(await replyCommentsResponse.json());
        loadingErrorMessage = '';
      } else {
        console.error(`could not load replies, status: ${replyCommentsResponse.status}`);
        loadingErrorMessage = `Could not load replies`;
      }
    } catch (e) {
      console.error(`could not load replies ${e}`);
      loadingErrorMessage = `Could not load replies`;
    }
    loading = false;
  })();
</script>

{#if loading && replyComments.length === 0}
  <div class="loading">
    <Circle2 size="60" color="#FF3E00" unit="px" duration="1s" />
  </div>
{/if}
{#if loadingErrorMessage}
  <div class="alert alert-danger" role="alert">
    {loadingErrorMessage}
  </div>
{/if}
{#if replyComments.length > 0}
  <div class="reddit-comment-replies">
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
</style>
