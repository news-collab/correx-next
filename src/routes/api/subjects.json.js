import { parse } from "cookie";
import { getTweets } from '../../twitter';
import { search } from '../../twitterV2';
import opentelemetry from '@opentelemetry/api';
import { PrismaClient } from '@prisma/client'
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
    const subjects = prisma.subjects.findMany({
      submitter_id: user.id
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

export async function POST(req, res) {
  console.log(req.session);
  const parentSpan = tracer.startSpan('api-create-source');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
  const { user } = req.session;
  const prisma = new PrismaClient()
  const { url } = req.body;


  if (user) {
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
          url, metadata, submitter_id: user.id
        }
      });
      saveSubjectSpan.setAttribute("id", subject.id);
      saveSubjectSpan.end();

      const getTweetsSpan = tracer.startSpan("twitter-get-tweets", undefined, ctx);
      const response = await search(subject.url, req.session.user);
      console.log(JSON.stringify(response));
      const tweets = response.data;

      getTweetsSpan.setAttribute("tweets", tweets.length);
      getTweetsSpan.end();
      const buildPostsSpan = tracer.startSpan("api-build-posts", undefined, ctx);
      const buildPostsCtx = opentelemetry.trace.setSpan(opentelemetry.context.active(), buildPostsSpan);

      const posts = tweets.map((data) => {
        const author = response.includes.users.find((u) => u.id === data.author_id);
        const attrs = {
          subject: subject,
          platformId: data.id,
          url: `https://twitter.com/${author.username}/status/${data.id}`,
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
          user: req.session.passport.user,
        };

        const createPostSpan = tracer.startSpan("api-create-post", undefined, buildPostsCtx);

        const post = PostRepository.create(attrs);
        createPostSpan.setAttribute("id", post.id);
        createPostSpan.end();

        //console.log(post.platformId, data.id_str);
        //console.log(post.url);

        return post;
      });
      buildPostsSpan.end();

      const savePostsSpan = tracer.startSpan("db-save-posts", undefined, ctx);
      await PostRepository.save(posts);
      savePostsSpan.end();
      console.log(posts);

      if (subjectSaved) {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(subject));
        return;
      } else {
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          message: `One of the two of us messed up`,
          log: subject
        }));
        return;
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(subject));
      return;
    }

  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
  }
  parentSpan.end();
}
