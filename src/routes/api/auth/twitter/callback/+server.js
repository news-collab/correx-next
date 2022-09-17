import { serialize, parse } from "cookie";
import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client'
import { TwitterApi } from 'twitter-api-v2';

/** @type {import('../../../../../../.svelte-kit/types/src/routes/api/auth/reddit/authorize/$types').RequestHandler} */
export async function GET({ request, url }) {

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

    // Create or get user.
    const platformWhere = {
      twitter_user_id: twitterUser.id
    };
    const platformFields = {
      name: twitterUser.screen_name,
      avatar_url: twitterUser.profile_image_url_https,
      twitter_user_id: twitterUser.id,
      twitter_username: twitterUser.screen_name
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
      twitterTokens: {
        accessToken, accessSecret
      }
    };

    const status = 302;
    const headers = {
      'Location': '/',
      'set-cookie': [serialize('session', JSON.stringify(session), { path: '/' })],
    }

    return new Response(null, { status, headers });
  } catch (e) {
    throw error(500, `could not authenticate with Twitter: ${e}`);
  }
}
