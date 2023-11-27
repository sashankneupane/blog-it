import bcryptjs from "bcryptjs";
import passport from "passport";
import User from "../db/models/User.mjs";
import fs from "fs/promises";
import axios from "axios"
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootdir = path.dirname(__dirname);

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

async function fetchRandomImage(destinationPath) {
  const apiUrl = 'https://api.unsplash.com/photos/random';
  const params = {
    'client_id': process.env.UNSPLASH_ACCESS_KEY,
    'query': 'nature ai'
  };

  try {
    const response = await axios.get(apiUrl, {
      params: params,
      responseType: 'json'
    });

    const imageResponse = await axios.get(response.data.urls.regular, {
      responseType: 'arraybuffer'
    });
    await fs.writeFile(destinationPath, imageResponse.data);
  } catch (error) {
    console.error('Error fetching image:', error);
  }
}

export async function registerUser(req, res) {
  try {
    // check if user already exists
    const existingUser = await User.findOne({ username: req.body.username });
    const existingEmail = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcryptjs.hash(req.body.password, 10),
      name: req.body.firstname + " " + req.body.lastname,
    });

    await user.save();
    const destinationPath = path.join(__rootdir, `/public/img/dp/${ user._id}.png`);
    fetchRandomImage(destinationPath);

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/home");
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.redirect("/auth/register");
  }
}

export async function getUserInfo(req, res) {
  const userWithoutPassword = req.user.toObject();
  delete userWithoutPassword.password;

  res.json(userWithoutPassword);
}

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
