import passport from 'passport';
import User from '../db/models/User.mjs';

async function getUserByUsername(username) {
    return await User.findOne({ username: username });
}

export async function getRegisterPage(req, res) {
    res.render('register', {
        user: req.user,
    });
}

export async function getLoginPage(req, res) {
    res.render('login', {
        user: req.user,
    });
}

export async function registerUser(req, res) {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.firstname + ' ' + req.body.lastname,
        blogPosts: [],
    });
    await user.save();
    res.redirect('/');
}

export async function loginUser(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error:', err);
            return next(err);
        }
        if (!user) {
            return res.redirect('/auth/login?message=Incorrect+Credentials');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error:', err);
                return next(err);
            }
            return res.redirect('/home?message=successfully+logged+in');
        });
    })(req, res, next);
}

export function logout(req, res) {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        res.redirect('/');
    });
}