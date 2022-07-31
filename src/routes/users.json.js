import { PrismaClient } from '@prisma/client'

import opentelemetry from '@opentelemetry/api';
const tracer = opentelemetry.trace.getTracer('correx');


export async function GET() {
  const parentSpan = tracer.startSpan('api-get-users');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);

  const prisma = new PrismaClient()

  //console.log("Is there a user in subjects.json?", req.session && req.session.passport && req.session.passport.user);
  /*if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;
    /*const connection = await db.getConnection(NODE_ENV);
    const { User } = db.entities;*/

  //const userRepo = connection.getRepository(User);
  const getUsersSpan = tracer.startSpan("db-get-users", undefined, ctx);
  const users = await prisma.user.findMany();
  getUsersSpan.setAttribute("users", users.length);
  getUsersSpan.end();
  //res.writeHead(200, { 'Content-Type': 'application/json' });
  parentSpan.end();
  //res.end(JSON.stringify({ users }));

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: users
  }
  /*  }
  
    //res.writeHead(401, { 'Content-Type': 'application/json' });
    parentSpan.end();
    return {
      status: 401,
      body: {
        message: "Unauthorized: please log in"
      }
    }*/
  //res.end(JSON.stringify({ message: "Unauthorized: please log in" }));
}

export async function POST(req, res) {
  const parentSpan = tracer.startSpan('api-create-user');
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
  const { username, role } = req.body.user;

  const prisma = new PrismaClient()

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
