import db from '../../../db.ts';
import opentelemetry from '@opentelemetry/api';
const tracer = opentelemetry.trace.getTracer('correx');

import { sendDirectMessage } from '@/twitterV2';

const { NODE_ENV } = process.env;
if (NODE_ENV === undefined) { throw "NODE_ENV must be defined"; }

export async function post(req, res) {
  const parentSpan = tracer.startSpan('api-invite-user');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
  const { user } = req.body;

  if (req.session && req.session.passport && req.session.passport.user) {
    const connection = await db.getConnection(NODE_ENV);
    const { User } = db.entities;

    let userRepo = connection.getRepository(User);

    let existingUser = await userRepo.findOne({ where: { twitterId: user.twitterId } });
    if (existingUser) {
      res.writeHead(422, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: "user already invited"
      }));

      return
    }

    let newUser = new User();
    newUser.name = user.name
    newUser.twitterId = user.twitterId;
    newUser.screenname = user.screenname;
    newUser.description = user.description;
    newUser.verified = user.verified;
    newUser.twitterCreatedAt = user.twitterCreatedAt;
    newUser.avatarUrl = user.avatarUrl;
    newUser.admin = user.role === "admin" ? true : false;

    const saveUserSpan = tracer.startSpan("db-save-user", undefined, ctx);
    let userSaved = await userRepo.save(newUser);
    saveUserSpan.setAttribute("id", userSaved.id);
    saveUserSpan.end();

    if (userSaved) {
      await sendDirectMessage(`You've been invited to <a href="https://www.correx.news/auth/twitter">Correx</a>! You can sign in with this Twitter account.`, newUser, req.session.passport.user);
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
