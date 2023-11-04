import User from '../db/models/User.mjs';
import BlogPost from '../db/models/BlogPost.mjs';

async function getUserByUsername(username) {
    return await User.findOne({ username: username });
}

export async function getPublicUserBlogsPage(req, res) {
    const user = await getUserByUsername(req.params.username);
    const blogPosts = await BlogPost.find({ author: user._id });
    res.render('public-user-blogs', { 
        username: user.username, 
        blogPosts: blogPosts 
    });
}

export async function getDashboardPage(req, res) {
    const user = await getUserByUsername('user1');
    const blogPosts = await BlogPost.find({ author: user._id });
    res.render('dashboard', { 
        username: user.username,
        userBlogs: blogPosts, 
    });
}