import fs from 'fs';
import db from '../../db.ts';
const { NODE_ENV } = process.env;
const serverRoot = __dirname;
import opentelemetry from '@opentelemetry/api';
const tracer = opentelemetry.trace.getTracer('correx');

export async function get(req, res) {
  const parentSpan = tracer.startSpan('api-get-source');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  const { Subject, Post, User } = db.entities;
  const connection = await db.getConnection(NODE_ENV);
  const SubjectRepository = connection.getRepository(Subject);
  const PostRepository = connection.getRepository(Post);

  const { id } = req.params;

  const getSubjectSpan = tracer.startSpan("db-get-subject", undefined, ctx);
  const subject = await SubjectRepository.findOne({ where: { uuid: id }, relations: ["posts"] });
  getSubjectSpan.setAttribute("id", subject.id);
  getSubjectSpan.setAttributes("posts_count", subject.posts.length);
  getSubjectSpan.end();

  if (subject) {
    let content = JSON.stringify({
      id: id,
      subject: subject,
      title: subject.title(),
      twitter: subject.posts
    });

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(content);
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      message: `Not found`
    }));
  }

  parentSpan.end();
}
