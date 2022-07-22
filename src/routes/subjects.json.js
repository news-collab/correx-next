import db from '../db.ts';
import * as uuid from 'uuid';
import { getTweets } from '../twitter';
import { search } from '../twitterV2';
import opentelemetry from '@opentelemetry/api';

const tracer = opentelemetry.trace.getTracer('correx');

const { NODE_ENV } = process.env;
if (NODE_ENV === undefined) { throw "NODE_ENV must be defined"; }

export async function get(req, res) {
  const parentSpan = tracer.startSpan('api-get-sources');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;
    const connection = await db.getConnection(NODE_ENV);
    const { Subject } = db.entities;

    const subjectRepo = connection.getRepository(Subject);
    const getSubjectsSpan = tracer.startSpan("db-get-subjects", undefined, ctx);
    const subjects = await subjectRepo.find({ where: { user: user }, relations: ["posts"] });
    getSubjectsSpan.setAttribute("subjects", subjects.length);
    getSubjectsSpan.end();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    parentSpan.end();
    res.end(JSON.stringify({ subjects }));

    return
  }

  res.writeHead(401, { 'Content-Type': 'application/json' });
  parentSpan.end();
  res.end(JSON.stringify({ message: "Unauthorized: please log in" }));

}

export async function post(req, res) {
  const parentSpan = tracer.startSpan('api-create-source');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
  //console.log("BODY", req.body);
  const { url } = req.body;

  //console.log("Is there a user?", req.session && req.session.passport && req.session.passport.user);
  if (req.session && req.session.passport && req.session.passport.user) {
    const connection = await db.getConnection(NODE_ENV);
    const { Subject, Post } = db.entities;

    let subjectRepo = connection.getRepository(Subject);

    // Use existing subject if possible.
    let subject = await subjectRepo.findOne({ where: { url: url, user: req.session.passport.user.id } });
    if (!subject) {
      subject = new Subject(req.session.passport.user, url);
      subject.uuid = uuid.v4(); // this needs to be automated.

      try {
        subject.metadata = await subject.extractMetadata();
      } catch (error) {
        console.log(`error extracting metadata: ${JSON.stringify(error)}`);
      }

      const saveSubjectSpan = tracer.startSpan("db-save-subject", undefined, ctx);
      let subjectSaved = await subjectRepo.save(subject);
      saveSubjectSpan.setAttribute("id", subjectSaved.id);
      saveSubjectSpan.end();

      const PostRepository = connection.getRepository(Post);
      const getTweetsSpan = tracer.startSpan("twitter-get-tweets", undefined, ctx);
      const response = await search(subject.url, req.session.passport.user);
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
