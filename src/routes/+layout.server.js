import { redirect } from '@sveltejs/kit';
import { PrismaClient, platform } from '@prisma/client'
import { getUserSession } from "$lib/session";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ request, url }) {
  const session = getUserSession(request.headers);

  if (!session) {
    return {};
  }

  if (session?.user?.id) {
    const prisma = new PrismaClient()
    const user = await prisma.users.findUnique({
      where: {
        id: session.user.id,
      }
    });

    console.log('user approved', user.approved);

    // Don't allow user to login if not approved.
    if (user.approved === false && url.pathname !== '/waitlist') {
      throw redirect(302, '/waitlist');
    }

    // Don't return data for waitlist page.
    /*if (user.approved === false && url.pathname === '/waitlist') {
      return {};
    }*/

    return {
      user,
      session
    };
  }

  return {}
}
