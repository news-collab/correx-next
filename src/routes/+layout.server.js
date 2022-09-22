import { PrismaClient, platform } from '@prisma/client'
import { getUserSession } from "$lib/session";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ request }) {
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

    return {
      user,
      session
    };
  }

  return {}
}
