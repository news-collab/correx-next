import { getConversation } from "@/twitterV2";
import opentelemetry from '@opentelemetry/api';

const tracer = opentelemetry.trace.getTracer('correx');

export async function post(req, res) {
  const parentSpan = tracer.startSpan('api-get-conversation');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;

    const { id } = req.body;
    console.log(id)

    const getConversationSpan = tracer.startSpan("twitter-get-conversation", undefined, ctx);
    const conversation = await getConversation(id);
    getConversationSpan.setAttribute("conversation", conversation.data.length);
    getConversationSpan.end();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    parentSpan.end();
    res.end(JSON.stringify({ conversation }));

    return
  }

  res.writeHead(401, { 'Content-Type': 'application/json' });
  parentSpan.end();
  res.end(JSON.stringify({ message: "Unauthorized: please log in" }));

}
