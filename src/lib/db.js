import { PrismaClient } from '@prisma/client'

export async function updatePost(data) {
  const prisma = new PrismaClient()
  return await prisma.posts.update({
    where: {
      id: data.id
    },
    data,
  })
}

export async function starPosts(postIds) {
  const prisma = new PrismaClient()
  return await prisma.posts.updateMany({
    where: {
      id: {
        in: postIds
      }
    },
    data: {
      starred: true
    }
  })
}

export async function starredPosts(subjectId) {
  const prisma = new PrismaClient()
  return await prisma.posts.findMany({
    where: {
      subject_id: subjectId,
      starred: true
    }
  })
}
