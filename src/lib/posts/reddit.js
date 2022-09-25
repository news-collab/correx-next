import opentelemetry from '@opentelemetry/api';
import { PrismaClient, platform } from '@prisma/client'
import moment from "moment";

export async function createRedditPosts(ctx, submissions, subject, user) {
  const tracer = opentelemetry.trace.getTracer('correx');
  const buildPostsSpan = tracer.startSpan("api-build-posts-reddit", undefined, ctx);
  const buildPostsCtx = opentelemetry.trace.setSpan(opentelemetry.context.active(), buildPostsSpan);

  const prisma = new PrismaClient()

  const posts = submissions.map(async (submission) => {
    //const author = twitterUsers.find((u) => u.id === tweet.author_id);
    const attrs = {
      data: {
        subject: { connect: { id: subject.id } },
        platform: platform.REDDIT,
        platform_id: submission.id,
        platform_url: submission.permalink,
        user: { connect: { id: user.id } },
        data: {
          title: submission.title,
          permalink: submission.permalink,
          num_comments: submission.num_comments,
          author: submission.author,
          ups: submission.ups,
          downs: submission.downs,
          upvote_ratio: submission.upvote_ratio,
          score: submission.score,
          gilded: submission.gilded,
          created_at: moment(submission.created * 1000).toISOString()
        }
      }
    };

    const createPostSpan = tracer.startSpan("api-create-post-reddit", undefined, buildPostsCtx);

    const post = await prisma.posts.create(attrs);
    createPostSpan.setAttribute("id", post.id);
    createPostSpan.end();

    return post;
  });
  buildPostsSpan.end();

  return posts;
}
