import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import crypto from "crypto";

import User from "../db/models/User.mjs";

export function setPassportStrategies(app) {
  const secretKey = crypto.randomBytes(64).toString("hex");
  app.use(
    session({
      secret: secretKey,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser(async (username, done) => {
    const user = await User.findOne({ username: username });
    done(null, user);
  });
}

export function ensureAuthentication(req, res, next) {
  req.session.returnTo = req.originalUrl;
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}
