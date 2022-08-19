import { serialize } from "cookie";
import { error } from '@sveltejs/kit';
import { PrismaClient, platform } from '@prisma/client'
import { Client } from "$lib/reddit/client";

/** @type {import('../../../../../../.svelte-kit/types/src/routes/api/auth/reddit/authorize/$types').RequestHandler} */
export async function GET({ url }) {
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  try {
    let state = JSON.parse(decodeURIComponent(stateParam));

    // Get access tokens.
    const tokenURL = 'https://www.reddit.com/api/v1/access_token';
    const tokenData = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: import.meta.env.VITE_REDDIT_CALLBACK_URI
    };
    const tokenBody = Object.entries(tokenData)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    const tokenResponse = await fetch(tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${import.meta.env.VITE_REDDIT_API_KEY}:${import.meta.env.VITE_REDDIT_API_SECRET}`).toString('base64')}`
      },
      body: tokenBody
    });
    const { access_token: accessToken, refresh_token: refreshToken } = await tokenResponse.json();

    // Create a Reddit client.
    const redditClient = new Client(import.meta.env.VITE_REDDIT_API_KEY, import.meta.env.VITE_REDDIT_API_SECRET, refreshToken);

    // Get Reddit profile.
    const profile = await redditClient.getMe();

    // Create or get user.
    const platformWhere = {
      reddit_user_id: profile.id
    };
    const platformFields = {
      name: profile.name,
      avatar_url: profile.snoovatar_img,
      reddit_user_id: profile.id,
      reddit_username: profile.name
    }

    // Create database client.
    const prisma = new PrismaClient()

    // Get or create user.
    const user = await prisma.users.upsert({
      create: platformFields,
      update: platformFields,
      where: platformWhere
    });

    const session = {
      user,
      redditTokens: {
        accessToken, refreshToken
      }
    };

    const status = 302;
    const headers = {
      'Location': state.redirectURL,
      'set-cookie': [serialize('session', JSON.stringify(session), { path: '/' })],
    }

    return new Response(null, { status, headers });
  } catch (e) {
    throw error(500, `could not retrieve Reddit tokens: ${e}`);
  }
}
