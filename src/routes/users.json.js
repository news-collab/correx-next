import db from '../db.ts';
import opentelemetry from '@opentelemetry/api';
const tracer = opentelemetry.trace.getTracer('correx');

const { NODE_ENV } = process.env;
if (NODE_ENV === undefined) { throw "NODE_ENV must be defined"; }

export async function get(req, res) {
  const parentSpan = tracer.startSpan('api-get-users');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  //console.log("Is there a user in subjects.json?", req.session && req.session.passport && req.session.passport.user);
  if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;
    const connection = await db.getConnection(NODE_ENV);
    const { User } = db.entities;

    const userRepo = connection.getRepository(User);
    const getUsersSpan = tracer.startSpan("db-get-users", undefined, ctx);
    const users = await userRepo.find();
    getUsersSpan.setAttribute("users", users.length);
    getUsersSpan.end();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    parentSpan.end();
    res.end(JSON.stringify({ users }));

    return
  }

  res.writeHead(401, { 'Content-Type': 'application/json' });
  parentSpan.end();
  res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
}

export async function post(req, res) {
  const parentSpan = tracer.startSpan('api-create-user');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
  const { username, role } = req.body.user;

  //console.log("Is there a user?", req.session && req.session.passport && req.session.passport.user);
  if (req.session && req.session.passport && req.session.passport.user) {
    const connection = await db.getConnection(NODE_ENV);
    const { User } = db.entities;

    let userRepo = connection.getRepository(User);

    let user = new User();
    user.screenname = username;
    user.admin = role === "admin" ? true : false;

    const saveUserSpan = tracer.startSpan("db-save-user", undefined, ctx);
    let userSaved = await userRepo.save(user);
    saveUserSpan.setAttribute("id", userSaved.id);
    saveUserSpan.end();

    if (userSaved) {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userSaved));
    } else {
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });

      res.end(JSON.stringify({
        message: `One of the two of us messed up`,
        log: subject
      }));
    }
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
  }
  parentSpan.end();
}
