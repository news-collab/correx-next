import { platform, PrismaClient } from '@prisma/client';

export async function getUser(id) {
  const prisma = new PrismaClient();
  return await prisma.users.findUnique({
    where: {
      id
    }
  });
}

export async function updatePost(data) {
  const prisma = new PrismaClient();
  return await prisma.posts.update({
    where: {
      id: data.id
    },
    data
  });
}

export async function starPosts(postIds) {
  const prisma = new PrismaClient();
  return await prisma.posts.updateMany({
    where: {
      id: {
        in: postIds
      }
    },
    data: {
      starred: true
    }
  });
}

export async function starredPosts(subjectId, platform) {
  const prisma = new PrismaClient();
  return await prisma.posts.findMany({
    where: {
      subject_id: subjectId,
      starred: true,
      platform
    },
    include: {
      replies: {
        where: {
          platform
        }
      }
    }
  });
}

export async function getPost(id) {
  const prisma = new PrismaClient();
  return await prisma.posts.findUnique({
    where: {
      id
    }
  });
}

export async function getReply(id) {
  const prisma = new PrismaClient();
  return await prisma.replies.findUnique({
    where: {
      id
    }
  });
}

export async function createReply(data) {
  const prisma = new PrismaClient();
  let reply = await prisma.replies.create({
    data
  });

  return await prisma.replies.findUnique({
    where: {
      id: reply.id
    },
    include: {
      author: true
    }
  });
}
