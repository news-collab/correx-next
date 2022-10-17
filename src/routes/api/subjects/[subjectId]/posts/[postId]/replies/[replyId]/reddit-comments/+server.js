import { getUserSession } from '$lib/session';
import { getReply, getUser } from '$lib/db';
import { error } from '@sveltejs/kit';
import { Client as RedditClient } from '$lib/reddit/client.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, request }) {
  const session = getUserSession(request.headers);
  const user = await getUser(session.user.id);

  if (!user) {
    throw error(403, 'login to get Reddit comments');
  }
  const reply = await getReply(params.replyId);

  if (!reply) {
    throw error(500, 'could not get Reddit replies');
  }

  console.log({
    apikey: process.env.VITE_REDDIT_API_KEY,
    apiSecret: process.env.VITE_REDDIT_API_SECRET,
    refreshToken: user.reddit_refresh_token
  });

  const redditClient = new RedditClient(
    process.env.VITE_REDDIT_API_KEY,
    process.env.VITE_REDDIT_API_SECRET,
    user.reddit_refresh_token
  );

  const replies = await redditClient.commentReplies(reply.platform_id);
  console.log('replies', replies);
  return new Response(JSON.stringify(replies));
}
