import { error, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import { PrismaClient } from '@prisma/client';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {
  let user;

  try {
    const { email, password } = await request.json();
    const prisma = new PrismaClient();
    user = await prisma.users.findUnique({
      where: {
        email: email
      }
    });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw error(401, 'invalid email or password');
    }

  } catch (e) {
    console.error('could not login', e);
    throw error(500, 'could not login');
  }

  // Don't allow user to login if not approved.
  if (user.approved === false) {
    throw redirect(302, '/waitlist');
  }

  const session = {
    user
  };

  let location = '/search';

  if (!user.reddit_access_token && !user.twitter_access_token) {
    location = '/integrations';
  }

  const status = 200;
  const headers = {
    'set-cookie': [
      serialize('session', JSON.stringify(session), {
        path: '/'
      })
    ],
    Location: location
  };

  return new Response(null, { status, headers });
}
