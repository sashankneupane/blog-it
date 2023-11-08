import BlogPost from '../db/models/Blogpost.mjs';

async function getBlogPosts(query) {
    return await BlogPost.find(query).populate('author');
}

export async function getHomePage(req, res) {
    const data = {};
    data.blogPosts = await getBlogPosts({});
    res.render('home', { 
        data: data,
        user: req.user, 
    });
}

export async function redirectToHomePage(req, res) {
    res.redirect('/home');
}