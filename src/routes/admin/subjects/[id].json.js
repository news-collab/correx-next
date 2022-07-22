import db from '@/db.ts';
const { NODE_ENV } = process.env;
import opentelemetry from '@opentelemetry/api';
const tracer = opentelemetry.trace.getTracer('correx');

export async function get(req, res) {
  const parentSpan = tracer.startSpan('api-admin-get-subject');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  const { Subject, Post } = db.entities;
  const connection = await db.getConnection(NODE_ENV);
  const SubjectRepository = connection.getRepository(Subject);

  const { id } = req.params;

  const getSubjectSpan = tracer.startSpan("db-get-subject", undefined, ctx);
  const subject = await SubjectRepository.findOne({ where: { uuid: id } });
  getSubjectSpan.setAttribute("id", subject.id);
  getSubjectSpan.end();

  if (subject) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({
      subject
    }));
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
