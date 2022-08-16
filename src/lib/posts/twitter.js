import opentelemetry from '@opentelemetry/api';
import { PrismaClient, platform } from '@prisma/client'

export async function createPostsFromTweets(ctx, tweets, twitterUsers, subject, user) {
  const tracer = opentelemetry.trace.getTracer('correx');
  const buildPostsSpan = tracer.startSpan("api-build-posts", undefined, ctx);
  const buildPostsCtx = opentelemetry.trace.setSpan(opentelemetry.context.active(), buildPostsSpan);

  const prisma = new PrismaClient()

  const posts = tweets.map(async (tweet) => {
    const author = twitterUsers.find((u) => u.id === tweet.author_id);
    const attrs = {
      data: {
        subject: { connect: { id: subject.id } },
        platform: platform.TWITTER,
        platform_id: tweet.id,
        platform_url: `https://twitter.com/${author.username}/status/${tweet.id}`,
        data: {
          id_str: tweet.id,
          created_at: tweet.created_at,

          retweet_count: tweet.public_metrics.retweet_count,
          user: {
            followers_count: author.public_metrics.followers_count,
            screen_name: author.username,
            name: author.username
          },
          tweet: {
            favorite_count: tweet.public_metrics.like_count,
            retweet_count: tweet.public_metrics.retweet_count,
            created_at: tweet.created_at,
          }
        },
        user: { connect: { id: user.id } },
      }
    };

    const createPostSpan = tracer.startSpan("api-create-post", undefined, buildPostsCtx);

    const post = await prisma.posts.create(attrs);
    createPostSpan.setAttribute("id", post.id);
    createPostSpan.end();

    return post;
  });
  buildPostsSpan.end();

  return posts;
}
