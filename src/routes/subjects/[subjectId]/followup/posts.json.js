import { PrismaClient, platform } from '@prisma/client'
import { getTweets } from "$lib/twitter/twitterV2";
import { getUserSession } from "$lib/session";

export async function GET({ request, params }) {
  const userSession = getUserSession(request.headers);
  const prisma = new PrismaClient()
  const user = await prisma.users.findUnique({
    where: {
      id: userSession.userId,
    }
  });

  if (user) {
    const { id } = params;

    const subject = await prisma.subjects.findUnique({ where: { id }, include: { posts: true } });

    return {
      status: 200,
      body: {
        posts: subject.posts
      }
    };

  }

  return {
    status: 401
  }
}

export async function POST({ request, params }) {
  const userSession = getUserSession(request.headers);
  const prisma = new PrismaClient()
  const user = await prisma.users.findUnique({
    where: {
      id: userSession.userId,
    }
  });

  if (user) {
    const { id } = params;
    const postData = await request.json();
    if (postData?.posts?.length > 0) {
      // get the subject
      /*const subject = await prisma.subjects.findUnique({
        where: {
          id,
        },
        include: {
          posts: true
        }
      });*/

      // Get posts and update their starred status.
      const posts = postData.posts;
      const postIds = posts.map(post => post.id);
      //let postsToUpdate = subject.posts.filter(post => postIds.find(id => id == post.id));
      // update the posts
      /*postsToUpdate.forEach(post => {
        const data = posts.find(d => d.id == post.id);
        Object.entries(data).forEach(([key, value]) => { post[key] = value; });
        // Update post.
        prisma.posts.update({
          where: {
            id: post.id
          },
          data: post
        });
      });*/

      // Since we really only want to update starred status, just mark it for each post.
      await prisma.posts.updateMany({
        where: {
          id: { in: postIds }
        },
        data: {
          starred: true
        }
      });

      // Now get all of the subject's posts.
      const subject = await prisma.subjects.findUnique({
        where: {
          id,
        },
        include: {
          posts: true
        }
      });

      return {
        status: 200,
        body: {
          posts: subject.posts
        }
      };
    }
  }

  return {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
    body: { message: "Unauthorized: please log in" }
  }

}
