import { error } from '@sveltejs/kit';
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { PrismaClient } from '@prisma/client'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {
  try {
    const { email, password } = await request.json();
    const prisma = new PrismaClient();
    const user = await prisma.users.findUnique({
      where: {
        email: email
      }
    });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw error(401, "invalid email or password");
    }

    const session = {
      user
    };

    const status = 200;
    const headers = {
      'set-cookie': [serialize('session', JSON.stringify(session), {
        path: '/',
      })],
    }

    return new Response(null, { status, headers });
  } catch (e) {
    console.error("could not login", e);
    throw error(500, "could not login");
  }
}
