import { PrismaClient } from '@prisma/client'
import opentelemetry from '@opentelemetry/api';
const tracer = opentelemetry.trace.getTracer('correx');

export async function GET({ request, params }) {
  const prisma = new PrismaClient()
  const parentSpan = tracer.startSpan('api-get-source');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  const { id } = params;
  const getSubjectSpan = tracer.startSpan("db-get-subject", undefined, ctx);
  const subject = await prisma.subjects.findUnique({ where: { id }, include: { posts: true } });

  getSubjectSpan.setAttribute("id", subject.id);
  getSubjectSpan.setAttributes("posts_count", subject.posts.length);
  getSubjectSpan.end();

  parentSpan.end();

  if (subject) {
    let content = {
      id: id,
      subject: subject,
      title: subject.metadata?.title,
      twitter: subject.posts
    };

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: content
    };

  }

  return {
    status: 404,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      message: `Not found`
    }
  };

}
