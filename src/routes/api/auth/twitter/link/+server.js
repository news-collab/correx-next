import { error, redirect } from '@sveltejs/kit';
import { TwitterApi } from 'twitter-api-v2';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
  const twitterClient = new TwitterApi({ appKey: import.env.meta.VITE_TWITTER_API_KEY, appSecret: import.env.meta.VITE_TWITTER_API_SECRET });
  const authLink = await client.generateAuthLink(import.meta.env.VITE_TWITTER_CALLBACK_URI);
  const { url, oauth_token, oauth_token_secret } = authLink;

  const redirectURL = `${import.meta.env.VITE_BASE_URL}${url.searchParams.get('redirect')}`;
  const state = encodeURIComponent(JSON.stringify({
    redirectURL: redirectURL
  }));
  const scopes = encodeURIComponent("identity edit history privatemessages read save submit subscribe vote");

  const authorizeURL = `https://api.twitter.com/oauth/request_token?oauth_callback=${import.meta.env.VITE_REDDIT_CALLBACK_URI}&x_auth_access_type=write`;

  const status = 302;
  const headers = { Location: authorizeURL }

  return new Response(null, { status, headers });
}
