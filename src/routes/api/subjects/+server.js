import { search } from '$lib/twitter/twitterV2';
import { error } from '@sveltejs/kit';
import opentelemetry from '@opentelemetry/api';
import { PrismaClient, platform } from '@prisma/client'
import { extractMetadata } from "$lib/meta";
import { getUserSession } from "$lib/session";
import { createPostsFromTweets } from '$lib/posts/twitter';
import { createRedditPosts } from '$lib/posts/reddit';
import { Client as RedditClient } from '$lib/reddit/client';

const tracer = opentelemetry.trace.getTracer('correx');

export async function GET(event) {
  const session = getUserSession(event.request.headers);

  if (!session) {
    throw error(403, "not authorized");
  }

  const prisma = new PrismaClient()
  const user = await prisma.users.findUnique({
    where: {
      id: session.user.id,
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

    parentSpan.end();
    return new Response(JSON.stringify(subjects), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  parentSpan.end();
  return new Response(JSON.stringify({ message: "Unauthorized: please log in" }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  const session = getUserSession(request.headers);

  if (!session) {
    throw error(403, "not authorized");
  }

  const prisma = new PrismaClient();
  const user = await prisma.users.findUnique({
    where: {
      id: session.user.id,
    }
  });

  if (!user) {
    throw error(403, "not authorized");
  }

  const parentSpan = tracer.startSpan('api-create-source');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  // The URL to search our platforms for.
  const { url } = await request.json();

  // Use existing subject if possible.
  let subject = await prisma.subjects.findFirst({ where: { url: url, submitter_id: user.id } });
  if (!subject) {
    let metadata = {};
    try {
      metadata = await extractMetadata(url);
    } catch (error) {
      console.error(`error extracting metadata: ${JSON.stringify(error)} `);
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

  // Search Twitter for URL.
  const getTweetsSpan = tracer.startSpan("twitter-get-tweets", undefined, ctx);
  const twitterSearchResponse = await search(subject.url, {
    access_token_key: user.twitter_access_token,
    access_token_secret: user.twitter_access_secret
  });
  // @ts-ignore
  const tweets = twitterSearchResponse.data;
  // @ts-ignore
  const twitterUsers = twitterSearchResponse.includes.users;

  getTweetsSpan.setAttribute("tweets", tweets.length);
  getTweetsSpan.end();

  // Create posts from tweets.
  await createPostsFromTweets(ctx, tweets, twitterUsers, subject, user);


  const redditClient = new RedditClient(import.meta.env.VITE_REDDIT_API_KEY, import.meta.env.VITE_REDDIT_API_SECRET, user.reddit_refresh_token);
  const submissions = await redditClient.searchURL(subject.url);
  await createRedditPosts(ctx, submissions, subject, user);

  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({
    subject
  });
  parentSpan.end();
  return new Response(body, { headers });
}
