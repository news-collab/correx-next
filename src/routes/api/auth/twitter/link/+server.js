import { serialize } from "cookie";
import { error, redirect } from '@sveltejs/kit';
import { TwitterApi } from 'twitter-api-v2';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const twitterClient = new TwitterApi({ appKey: import.meta.env.VITE_TWITTER_API_KEY, appSecret: import.meta.env.VITE_TWITTER_API_SECRET });
  const authLink = await twitterClient.generateAuthLink(import.meta.env.VITE_TWITTER_CALLBACK_URI);
  const { url, oauth_token, oauth_token_secret } = authLink;
  const twitterAuthCookie = serialize('twitter-auth', JSON.stringify({ oauth_token, oauth_token_secret }));

  const status = 302;
  const headers = { 'Set-Cookie': twitterAuthCookie }
  const linkResposne = JSON.stringify({
    link: url
  });

  return new Response(linkResposne, { status, headers });
}
