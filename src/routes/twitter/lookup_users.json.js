import {
  lookupUsers
} from '@/twitterV2';
import opentelemetry from '@opentelemetry/api';
const tracer = opentelemetry.trace.getTracer('correx');

export async function get(req, res) {
  const parentSpan = tracer.startSpan('api-lookup-twitter-users');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;

    const lookupUsersSpan = tracer.startSpan("twitter-lookup-users", undefined, ctx);

    var response;
    try {
      response = await lookupUsers(req.query.screenname, req.session.passport.user);
      lookupUsersSpan.setAttribute("users", response.length);
      lookupUsersSpan.end();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      parentSpan.end();
      res.end(JSON.stringify({ users: response }));
    } catch (e) {
      console.log(`error getting twitter users: ${JSON.stringify(e)}`);
      lookupUsersSpan.setAttribute("error", response);
      lookupUsersSpan.end();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ users: [] }));
      parentSpan.end();
    }
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    parentSpan.end();
    res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
  }
}
