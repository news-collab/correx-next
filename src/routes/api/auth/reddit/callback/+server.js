import { serialize } from "cookie";
import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client'
import { Client } from "$lib/reddit/client";
import { getUserSession } from "$lib/session";

/** @type {import('../../../../../../.svelte-kit/types/src/routes/api/auth/reddit/authorize/$types').RequestHandler} */
export async function GET({ request, url }) {
  const session = getUserSession(request.headers);
  const prisma = new PrismaClient();
  const existingUser = await prisma.users.findUnique({
    where: {
      id: session.user.id,
    }
  });

  if (!existingUser) {
    console.error("could not authenticate user");
    throw error(403, "could not authenticate user");
  }

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

    // Get existing user.
    const platformWhere = {
      id: existingUser.id
    };
    const platformFields = {
      name: profile.name,
      avatar_url: profile.snoovatar_img,
      reddit_user_id: profile.id,
      reddit_username: profile.name,
      reddit_access_token: accessToken,
      reddit_refresh_token: refreshToken
    }

    // Create database client.
    const prisma = new PrismaClient()

    // Get or create user.
    const user = await prisma.users.update({
      where: platformWhere,
      data: platformFields
    });

    const userSession = {
      ...session,
      user,
    };
    delete userSession.user.password;


    const status = 302;
    const headers = {
      'Location': state.redirectURL,
      'set-cookie': [serialize('session', JSON.stringify(userSession), {
        path: '/'
      })],
    }

    return new Response(null, { status, headers });
  } catch (e) {
    throw error(500, `could not authenticate with Reddit: ${e}`);
  }
}
