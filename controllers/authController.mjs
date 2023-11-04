import User from '../db/models/User.mjs';

async function getUserByUsername(username) {
    return await User.findOne({ username: username });
}

export async function getRegisterPage(req, res) {
    res.render('register');
}

export async function getLoginPage(req, res) {
    res.render('login');
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

export async function loginUser(req, res) {
    const user = await getUserByUsername(req.body.username);
    if (!user) {
        res.redirect('/auth/login');
        return;
    }
    if (user.password !== req.body.password) {
        res.redirect('/auth/login');
        return;
    }
    res.redirect('/');
}