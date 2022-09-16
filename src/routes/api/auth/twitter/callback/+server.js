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
  const { oauth_token_secret } = cookies['twitter-auth'];

  const twitterClient = new TwitterApi({
    appKey: import.meta.env.VITE_TWITTER_API_KEY,
    appSecret: import.meta.env.VITE_TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  });

  const { client: loggedClient, accessToken, accessSecret } = await twitterClient.login(oauth_verifier);
  console.log(await loggedClient.currentUser())

  if (false) {
    try {
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
      throw error(500, `could not authenticate with Twitter: ${e}`);
    }
  }
}
