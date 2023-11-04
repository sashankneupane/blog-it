import express from 'express';

import User from '../db/models/User.mjs';
import BlogPost from '../db/models/BlogPost.mjs';

const router = express.Router();

router.get('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    const blogPosts = await BlogPost.find({ author: user._id });
    res.render('public-user-blogs', { username: user.username, blogPosts: blogPosts });
});

router.get('/dashboard', async (req, res) => {
    const user = await User.findOne({ username: 'user1' });
    const blogPosts = await BlogPost.find({ author: user._id });
    res.render('dashboard', { 
        username: user.username,
        userBlogs: blogPosts, 
    });
});

export default router;