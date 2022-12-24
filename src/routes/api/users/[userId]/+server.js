import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';


export async function PUT({ request, params, url }) {
  const data = await request.json();
  const prisma = new PrismaClient();
  const { userId: id } = params;
  await prisma.users.update({
    where: { id },
    data
  });

  const user = await prisma.users.findUnique({
    where: { id }
  });

  if (user) {
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return error(404, 'could not find user');
}
