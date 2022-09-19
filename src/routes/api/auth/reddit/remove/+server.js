import { serialize } from "cookie";
import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client'
import { Client } from "$lib/reddit/client";
import { getUserSession } from "$lib/session";

/** @type {import('../../../../../../.svelte-kit/types/src/routes/api/auth/reddit/authorize/$types').RequestHandler} */
export async function POST({ request, url }) {
  try {
    const session = getUserSession(request.headers);
    const prisma = new PrismaClient()
    const updatedUser = await prisma.users.update({
      where: {
        id: session.user.id,
      },
      data: {
        reddit_user_id: null,
        reddit_username: null,
        reddit_access_token: null,
        reddit_refresh_token: null
      }
    });

    if (!updatedUser) {
      console.error("could not update user");
      throw error(403, "could not update user");
    }

    const userSession = {
      ...session,
      user: updatedUser,
    };
    delete userSession.user.password;

    const status = 200;
    const headers = {
      'set-cookie': [serialize('session', JSON.stringify(userSession), { path: '/' })],
    }

    return new Response(JSON.stringify(updatedUser), { status, headers });
  } catch (e) {
    throw error(500, `could not update user: ${e}`);
  }
}
