import { error } from '@sveltejs/kit';
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { PrismaClient } from '@prisma/client'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {
  const { email, password } = await request.json();
  try {
    const hash = await bcrypt.hash(password, parseInt(import.meta.env.VITE_USER_PASSWORD_SALT_ROUNDS, 10));
    const prisma = new PrismaClient();
    const user = await prisma.users.create({
      data: {
        email,
        password: hash
      },
    });

    const session = {
      user
    };

    const status = 201;
    const headers = {
      'set-cookie': [serialize('session', JSON.stringify(session), {
        path: '/'
      })],
    }

    return new Response(null, { status, headers });
  } catch (e) {
    console.error("could not complete signup", e);
    throw error(500, "could not complete signup");
  }
}
