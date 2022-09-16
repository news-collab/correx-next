import { serialize } from "cookie";
import { error, redirect } from '@sveltejs/kit';
import { TwitterApi } from 'twitter-api-v2';

/** @type {import('./$types').RequestHandler} */
export async function GET() {

  try {
    const twitterClient = new TwitterApi({ appKey: import.meta.env.VITE_TWITTER_API_KEY, appSecret: import.meta.env.VITE_TWITTER_API_SECRET });
    const authLink = await twitterClient.generateAuthLink(import.meta.env.VITE_TWITTER_CALLBACK_URI);
    const { url, oauth_token, oauth_token_secret } = authLink;
    const twitterAuthCookie = serialize('twitter-auth', JSON.stringify({ oauth_token, oauth_token_secret }));

    const status = 200;
    const headers = { 'Set-Cookie': twitterAuthCookie }
    const linkResponse = JSON.stringify({
      link: url
    });

    return new Response(linkResponse, { status, headers });
  } catch (e) {
    throw error(403, `could not authenticate with Twitter: ${e}`);

  }
}
