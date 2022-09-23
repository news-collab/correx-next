import { PrismaClient } from '@prisma/client'
import opentelemetry from '@opentelemetry/api';
import { error } from '@sveltejs/kit';

const tracer = opentelemetry.trace.getTracer('correx');

export async function GET({ request, params, url }) {
  const prisma = new PrismaClient()
  const parentSpan = tracer.startSpan('api-get-source');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  const { subjectId: id } = params;
  const platform = url.searchParams.get('platform');
  const getSubjectSpan = tracer.startSpan("db-get-subject", undefined, ctx);
  const subject = await prisma.subjects.findUnique({
    where: { id },
    include: {
      posts: {
        where: {
          platform
        }
      }
    }
  });

  getSubjectSpan.setAttribute("id", subject.id);
  getSubjectSpan.setAttributes("posts_count", subject.posts.length);
  getSubjectSpan.end();

  parentSpan.end();

  if (subject) {
    return new Response(JSON.stringify(subject), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return error(404, 'could not find subject');
}
