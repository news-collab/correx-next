import { PrismaClient, platform } from '@prisma/client'
import { getUserSession } from "$lib/session";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ request }) {
  const userSession = getUserSession(request.headers);
  const prisma = new PrismaClient()
  const user = await prisma.users.findUnique({
    where: {
      id: userSession.userId,
    }
  });

  return {
    user,
  };
}
