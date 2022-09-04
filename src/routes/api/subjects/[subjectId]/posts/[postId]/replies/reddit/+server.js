import { error } from '@sveltejs/kit';
import { Client as RedditClient } from '$lib/reddit/client';
import { createRedditReply, getPost, getUser } from '$lib/db';
import { getUserSession } from "$lib/session";

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request }) {
  const session = getUserSession(request.headers);
  const user = await getUser(session.user.id);
  const redditClient = new RedditClient(import.meta.env.VITE_REDDIT_API_KEY, import.meta.env.VITE_REDDIT_API_SECRET, session.redditTokens.refreshToken);

  try {
    const createReplyData = await request.json();
    const post = await getPost(params.postId);

    if (!post) {
      throw error(404, `could not find post: ${params.postId}`);
    }

    const redditReply = await redditClient.reply(post.platform_id, createReplyData.reply);

    const reply = await createRedditReply({
      post_id: post.id,
      author_id: user.id,
      platform_id: redditReply.id,
      data: {
        id: redditReply.id,
        body: redditReply.body,
        permalink: redditReply.permalink,
        author: redditReply.author.name
      }
    });

    return new Response(JSON.stringify(reply));
  } catch (e) {
    throw error(500, `could not create reply: ${e}`);
  }
}
