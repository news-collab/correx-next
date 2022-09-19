import { serialize, parse } from "cookie";
import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client'
import { TwitterApi } from 'twitter-api-v2';
import { getUserSession } from "$lib/session";

export async function GET({ request, url }) {
  console.log('headers', parse(request.headers.get('cookie')));
  const session = getUserSession(request.headers);
  console.log('session', session);
  const prisma = new PrismaClient()
  const existingUser = await prisma.users.findUnique({
    where: {
      id: session.user.id,
    }
  });

  if (!existingUser) {
    console.error("could not authenticate user");
    throw error(403, "could not authenticate user");
  }

  // Extract tokens from query string
  const oauth_token = url.searchParams.get('oauth_token');
  const oauth_verifier = url.searchParams.get('oauth_verifier');
  const cookies = parse(request.headers.get('cookie') || '');
  const { oauth_token_secret } = JSON.parse(cookies['twitter-auth']);

  const twitterConfig = {
    appKey: import.meta.env.VITE_TWITTER_API_KEY,
    appSecret: import.meta.env.VITE_TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  };

  const twitterClient = new TwitterApi({
    appKey: import.meta.env.VITE_TWITTER_API_KEY,
    appSecret: import.meta.env.VITE_TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  });

  try {
    const { client: loggedClient, accessToken, accessSecret } = await twitterClient.login(oauth_verifier);
    const twitterUser = await loggedClient.currentUser();

    // Get user
    const platformWhere = {
      id: existingUser.id
    };

    const platformFields = {
      name: twitterUser.screen_name,
      avatar_url: twitterUser.profile_image_url_https,
      twitter_user_id: twitterUser.id,
      twitter_username: twitterUser.screen_name,
      twitter_access_token: accessToken,
      twitter_access_secret: accessSecret
    }

    // Get or create user.
    const user = await prisma.users.update({
      where: platformWhere,
      data: platformFields
    });

    const userSession = {
      ...session,
      user: {
        ...user
      }
    };
    delete userSession.user.password;

    const status = 302;
    const headers = {
      'Location': '/integrations',
      'set-cookie': [serialize('session', JSON.stringify(userSession), { path: '/' })],
    }

    return new Response(null, { status, headers });
  } catch (e) {
    throw error(500, `could not authenticate with Twitter: ${e}`);
  }
}
