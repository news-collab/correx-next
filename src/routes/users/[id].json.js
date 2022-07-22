import db from '../../db.ts';
import opentelemetry from '@opentelemetry/api';
const tracer = opentelemetry.trace.getTracer('correx');

const { NODE_ENV } = process.env;
if (NODE_ENV === undefined) { throw "NODE_ENV must be defined"; }

export async function put(req, res) {
  const parentSpan = tracer.startSpan('api-update-user');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  //console.log("Is there a user in subjects.json?", req.session && req.session.passport && req.session.passport.user);
  if (req.session && req.session.passport && req.session.passport.user) {
    const currentUser = req.session.passport.user;
    const connection = await db.getConnection(NODE_ENV);
    const { User } = db.entities;

    const userRepository = connection.getRepository(User);
    const getUsersSpan = tracer.startSpan("db-update-user", undefined, ctx);
    const id = parseInt(req.params.id, 10);;
    let user = await userRepository.findOne(id);

    // Prevent a user from updating their own admin status.
    if (id !== currentUser.id) {
      user.admin = req.body.admin;
    }

    await userRepository.save(user);
    user = await userRepository.findOne(id);
    getUsersSpan.end();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    parentSpan.end();
    res.end(JSON.stringify({ user }));

    return
  }

  res.writeHead(401, { 'Content-Type': 'application/json' });
  parentSpan.end();
  res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
}
