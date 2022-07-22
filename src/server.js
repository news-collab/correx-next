import "./tracing";
import opentelemetry from "@opentelemetry/api";

import { handler } from './build/handler.js';

import * as dotenv from 'dotenv';
dotenv.config();

import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import { json } from "body-parser";
import * as sapper from "@sapper/server";

import session from "express-session";
import sessionFileStore from "session-file-store";
//import helmet from 'helmet';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

import passport from "passport";
import * as twitter from "passport-twitter";
import { RedditStrategy } from 'passport-reddit'
import db from "./db.ts";
import dbConfig from "../ormconfig.json";

const twitterConfig = {
  "consumerKey": process.env.TWITTER_CONSUMER_KEY,
  "consumerSecret": process.env.TWITTER_CONSUMER_SECRET,
  "callbackURL": process.env.TWITTER_CALLBACK_URL
};

const User = db.entities.User;

const tracer = opentelemetry.trace.getTracer("correx");

(async () => {
  const dbEnv = dbConfig.find((conf) => conf.name == NODE_ENV);
  const connection = await db.createConnection(dbEnv);
  const UserRepository = connection.getRepository(User);

  passport.serializeUser(function (user, done) {
    //console.log("Serializing...", user);
    done(null, user);
  });

  passport.deserializeUser(async function (userData, done) {
    //console.log("Deserializing...", userData);
    let user = (await UserRepository.findOne(userData.id)) || false;
    done(null, user);
  });

  passport.use(
    new twitter.Strategy(twitterConfig, async function (
      token,
      tokenSecret,
      profile,
      cb
    ) {
      const profileData = profile._json;
      const parentSpan = tracer.startSpan("twitter-auth-callback");
      parentSpan.setAttribute("twitter-user-id", profileData.id_str);
      const ctx = opentelemetry.trace.setSpan(
        opentelemetry.context.active(),
        parentSpan
      );

      const dbGetUserSpan = tracer.startSpan("db-get-user", undefined, ctx);
      let user = await UserRepository.findOne({ twitterId: profile.id });
      // if the user doesn't exist
      if (!user) {
        // create the user record
        user = UserRepository.create({
          twitterId: profileData.id_str,
          name: profileData.name,
          screenname: profileData.screen_name,
          description: profileData.description,
          verified: profileData.verified,
          twitterCreatedAt: profileData.created_at,
          token: token,
          tokenSecret: tokenSecret,
          avatarUrl: profileData.profile_image_url_https,
        });
      } else {
        // otherwise the user exists, and we should update their data.
        user.screenname = profileData.screen_name;
        user.description = profileData.description;
        user.verified = profileData.verified;
        user.avatarUrl = profileData.profile_image_url_https;
        user.token = token;
        user.tokenSecret = tokenSecret;
      }
      dbGetUserSpan.setAttribute("user-id", user.id);
      dbGetUserSpan.end();

      // and save the user account.
      const dbSaveUserSpan = tracer.startSpan("db-save-user", undefined, ctx);
      await UserRepository.save(user);
      dbSaveUserSpan.end();
      parentSpan.end();

      // Don't let non-admin users login.
      if (!user.admin) {
        return cb(null, false, {
          message: "I'm sorry, but you're not allowed to do that.",
        });
      }

      return cb(null, user);
    })
  );

  passport.use(
    new RedditStrategy(
      {
        clientID: process.env.REDDIT_CONSUMER_KEY,
        clientSecret: process.env.REDDIT_CONSUMER_SECRET,
        callbackURL: process.env.REDDIT_CALLBACK_URL,
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({ redditId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    )
  );

  const FileStore = sessionFileStore(session);

  polka() // You can also use Express
    .use(function (req, res, next) {
      // Polka doesn't have a res.redirect function: https://github.com/lukeed/polka/issues/78
      res.redirect = (location) => {
        let str = `Redirecting to ${location}`;
        res.writeHead(302, {
          Location: location,
          "Content-Type": "text/plain",
          "Content-Length": str.length,
        });
        res.end(str);
      };
      next();
    })
    .use(json())
    .use(
      session({
        secret: "change-me-to-something-else",
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 31536000,
        },
        store: new FileStore({
          path: process.env.NOW ? `/tmp/sessions` : `.sessions`,
        }),
      })
    )
    .use(passport.initialize())
    .use(passport.session())
    .get(
      "/auth/twitter",
      passport.authenticate("twitter", {
        successRedirect: "/search",
        failureRedirect: "/401",
      })
    )
    .get("/auth/logout", function (req, res) {
      req.logout();
      res.writeHead(302, { Location: "/" });
      res.end();
    })
    .get(
      "/auth/twitter/callback",
      passport.authenticate("twitter", {
        successRedirect: "/search",
        failureRedirect: "/401",
      })
    )
    .use(
      compression({ threshold: 0 }),
      sirv("static", { dev }),
      sapper.middleware({
        session: (req) => ({
          passport: req.session && req.session.passport,
        }),
      })
    )
    .listen(PORT, (err) => {
      if (err) console.log("error", err);
    });
})();
