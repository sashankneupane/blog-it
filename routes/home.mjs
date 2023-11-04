import express from 'express';

import BlogPost from '../db/models/BlogPost.mjs';

const router = express.Router();

router.get('/home', async (req, res) => {
    const data = {};
    data.blogPosts = await BlogPost.find().populate('author');
    console.log(data.blogPosts);
    res.render('home', { data: data });
});

router.get('/', async (req, res) => {
    res.redirect('/home');
});

export default router;