import express from 'express';

import User from '../db/models/User.mjs';

const router = express.Router();


// REGISTER Page
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.firstname + ' ' + req.body.lastname,
        blogPosts: [],
    });
    await user.save();
    res.redirect('/');
});


// LOGIN Page
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('logic', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.redirect('/login');
        return;
    }
    if (user.password !== req.body.password) {
        res.redirect('/login');
        return;
    }
    res.redirect('/');
});

export default router;