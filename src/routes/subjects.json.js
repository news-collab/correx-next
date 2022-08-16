import { search } from '$lib/twitter/twitterV2';
import opentelemetry from '@opentelemetry/api';
import { PrismaClient, platform } from '@prisma/client'
import { session } from '$app/stores';
import { extractMetadata } from "$lib/meta";
import { getUserSession } from "$lib/session";
import { createPostsFromTweets } from '$lib/posts/twitter';

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
  if (userSession === null) {
    return {
      status: 401,
      body: {
        message: "Unauthorized: please log in"
      }
    }
  }
  const tokens = { oauthToken: userSession?.tokens?.twitter?.oauth_token, oauthTokenSecret: userSession?.tokens?.twitter?.oauth_token_secret };
  const prisma = new PrismaClient();
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

  // The URL to search our platforms for.
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

  // Search Twitter for URL.
  const getTweetsSpan = tracer.startSpan("twitter-get-tweets", undefined, ctx);
  const twitterSearchResponse = await search(subject.url, tokens);
  const tweets = twitterSearchResponse.data;
  const twitterUsers = twitterSearchResponse.includes.users;

  getTweetsSpan.setAttribute("tweets", tweets.length);
  getTweetsSpan.end();

  // Create posts from tweets.
  const posts = await createPostsFromTweets(ctx, tweets, twitterUsers, subject, user);

  return {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
    body: subject
  };

  parentSpan.end();
}
