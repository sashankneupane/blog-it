import bcryptjs from "bcryptjs";
import passport from "passport";
import User from "../db/models/User.mjs";


export async function getRegisterPage(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/u/dashboard");
  }
  res.render("register", {
    user: req.user,
  });
}

export async function getLoginPage(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/u/dashboard");
  }
  res.render("login", {
    user: req.user,
  });
}

export async function registerUser(req, res) {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: await bcryptjs.hash(req.body.password, 10),
    name: req.body.firstname + " " + req.body.lastname,
  });
  try {
    await user.save();
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/home');
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.redirect('/auth/register');
  }
}

export async function getUserInfo(req, res) {

  const userWithoutPassword = req.user.toObject();
  delete userWithoutPassword.password;

  res.json(userWithoutPassword);
};

export async function loginUser(req, res, next) {
  const redirectTo = req.session.returnTo || "/home";
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error:", err);
      return next(err);
    }
    if (!user) {
      return res.redirect("/auth/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error:", err);
        return next(err);
      }
      return res.redirect(redirectTo);
    });
  })(req, res, next);
}

export function logout(req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
