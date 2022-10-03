import { error } from '@sveltejs/kit';
import { Client as RedditClient } from '$lib/reddit/client';
import { reply as twitterReply } from '$lib/twitter/twitterV2';
import { createReply, getPost, getUser } from '$lib/db';
import { getUserSession } from "$lib/session";
import { platform } from "prisma/prisma-client";
import { getConversation } from '@/lib/twitter/twitterV2';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, request }) {
  const session = getUserSession(request.headers);
  const user = await getUser(session.user.id);

  if (!user) {
    throw error(403, 'login to reply');
  }
  const post = await getPost(params.postId);

  if (!post) {
    throw error(500, "could not get post")
  }

  const conversation = await getConversation(post.platform_id, user);
  console.log('conversation', conversation);
  return new Response(JSON.stringify(conversation))
}

/** @type {import('../../../../../../../../.svelte-kit/types/src/routes/api/subjects/[subjectId]/posts/[postId]/replies/reddit/$types').RequestHandler} */
export async function POST({ params, request }) {
  const session = getUserSession(request.headers);
  const user = await getUser(session.user.id);

  if (!user) {
    throw error(403, 'login to reply');
  }

  try {
    const createReplyData = await request.json();
    const post = await getPost(params.postId);

    if (!post) {
      throw error(404, `could not find post: ${params.postId}`);
    }

    let reply;

    if (post.platform === platform.REDDIT) {
      const redditClient = new RedditClient(import.meta.env.VITE_REDDIT_API_KEY, import.meta.env.VITE_REDDIT_API_SECRET, user.reddit_refresh_token);
      const redditReply = await redditClient.reply(post.platform_id, createReplyData.reply);

      reply = await createReply({
        post_id: post.id,
        author_id: user.id,
        platform_id: redditReply.id,
        platform: post.platform,
        data: {
          body: redditReply.body,
          permalink: redditReply.permalink,
        }
      });
    }

    if (post.platform === platform.TWITTER) {
      const newTwitterReply = await twitterReply({
        status: `@${post.data.user.screen_name} ${createReplyData.reply}`,
        in_reply_to_status_id: post.platform_id,
        auto_populate_reply_metadata: true,
      }, user);

      console.log('newTwitterReply', newTwitterReply);

      reply = await createReply({
        post_id: post.id,
        author_id: user.id,
        platform_id: newTwitterReply.id_str,
        platform: post.platform,
        data: {
          body: newTwitterReply.full_text,
          permalink: `https://www.twitter.com/${user.twitter_username}/statuses/${newTwitterReply.id_str}`,
        }
      });
    }

    return new Response(JSON.stringify(reply));
  } catch (e) {
    throw error(500, `could not create reply: ${e}`);
  }
}
