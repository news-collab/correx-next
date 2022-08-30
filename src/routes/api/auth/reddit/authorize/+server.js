import { error, redirect } from '@sveltejs/kit';

/** @type {import('../../../../../../.svelte-kit/types/src/routes/api/auth/reddit/authorize/$types').RequestHandler} */
export function GET({ url }) {
  const redirectURL = `${import.meta.env.VITE_BASE_URL}${url.searchParams.get('redirect')}`;
  const state = encodeURIComponent(JSON.stringify({
    redirectURL: redirectURL
  }));
  const scopes = encodeURIComponent("identity edit history privatemessages read save submit subscribe vote");

  const authorizeURL = `https://www.reddit.com/api/v1/authorize?client_id=${import.meta.env.VITE_REDDIT_API_KEY}&response_type=code&state=${state}&redirect_uri=${import.meta.env.VITE_REDDIT_CALLBACK_URI}&duration=permanent&scope=${scopes}`;

  const status = 302;
  const headers = { Location: authorizeURL }

  return new Response(null, { status, headers });
}
