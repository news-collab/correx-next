import { search } from '$lib/twitter/twitterV2';
import opentelemetry from '@opentelemetry/api';
import { PrismaClient, platform } from '@prisma/client'
import { session } from '$app/stores';
import { extractMetadata } from "$lib/meta";
import { getUserSession } from "$lib/session";

const tracer = opentelemetry.trace.getTracer('correx');

export async function GET(event) {
  const userSession = getUserSession(event.request.headers);
  const prisma = new PrismaClient()
  const user = await prisma.users.findUnique({
    where: {
      id: userSession.userId,
    }
  });

  const parentSpan = tracer.startSpan('api-get-subjects');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);


  if (user) {
    const getSubjectsSpan = tracer.startSpan("db-get-subjects", undefined, ctx);
    const subjects = await prisma.subjects.findMany({
      where: { submitter_id: user.id }
    });
    getSubjectsSpan.setAttribute("subjects", subjects.length);
    getSubjectsSpan.end();

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: subjects
    }
    parentSpan.end();
  }

  return {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
    data: { message: "Unauthorized: please log in" }
  }
  parentSpan.end();
}

export async function POST({ request }) {
  const userSession = getUserSession(request.headers);
  const tokens = { oauthToken: userSession?.tokens?.twitter?.oauth_token, oauthTokenSecret: userSession?.tokens?.twitter?.oauth_token_secret };
  const prisma = new PrismaClient()
  const user = await prisma.users.findUnique({
    where: {
      id: userSession.userId,
    }
  });

  if (!user) {
    return {
      status: 401,
      body: {
        message: "Unauthorized: please log in"
      }
    }
  }

  const parentSpan = tracer.startSpan('api-create-source');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  const { url } = await request.json();

  // Use existing subject if possible.
  let subject = await prisma.subjects.findFirst({ where: { url: url, submitter_id: user.id } });
  if (!subject) {
    let metadata;
    try {
      metadata = await extractMetadata(url);
    } catch (error) {
      console.log(`error extracting metadata: ${JSON.stringify(error)} `);
    }
    const saveSubjectSpan = tracer.startSpan("db-save-subject", undefined, ctx);
    subject = await prisma.subjects.create({
      data: {
        url, metadata, submitter: {
          connect: { id: user.id }
        }
      }
    });
    saveSubjectSpan.setAttribute("id", subject.id);
    saveSubjectSpan.end();
  }

  const getTweetsSpan = tracer.startSpan("twitter-get-tweets", undefined, ctx);
  const twitterSearchResponse = await search(subject.url, tokens);
  const tweets = twitterSearchResponse.data;

  getTweetsSpan.setAttribute("tweets", tweets.length);
  getTweetsSpan.end();
  const buildPostsSpan = tracer.startSpan("api-build-posts", undefined, ctx);
  const buildPostsCtx = opentelemetry.trace.setSpan(opentelemetry.context.active(), buildPostsSpan);

  const posts = tweets.map(async (data) => {
    const author = twitterSearchResponse.includes.users.find((u) => u.id === data.author_id);
    const attrs = {
      data: {
        subject: { connect: { id: subject.id } },
        platform: platform.twitter,
        platform_id: data.id,
        platform_url: `https://twitter.com/${author.username}/status/${data.id}`,
        data: {
          id_str: data.id,
          created_at: data.created_at,

          retweet_count: data.public_metrics.retweet_count,
          user: {
            followers_count: author.public_metrics.followers_count,
            screen_name: author.username,
            name: author.username
          },
          tweet: {
            favorite_count: data.public_metrics.like_count,
            retweet_count: data.public_metrics.retweet_count,
            created_at: data.created_at,
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

  return {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
    body: subject
  };

  parentSpan.end();
}
