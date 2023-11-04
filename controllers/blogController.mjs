import mongoose from 'mongoose';

import BlogPost from '../db/models/Blogpost.mjs';

async function getBlogPostById(id) {
    const blogPost = await BlogPost.findById(id).populate('author');
    return blogPost;
};


export async function getWriteBlogPage(req, res) {
    res.render('write');
}

export async function writeBlogPost(req, res) {
    const user = await User.findOne({ username: 'user1' });
    const blogPost = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        author: user._id,
        publicationDate: Date.now(),
        lastUpdated: Date.now(),
        comments: [],
        likes: [],
    });
    await blogPost.save();
    res.redirect(`/blog/${blogPost._id}`);
};


export async function getBlogPageById(req, res) {
    const blogPost = await getBlogPostById(req.params.blogId);
    res.render('blog-post', { blogPost: blogPost });
}


export async function getBlogEditPageById(req, res) {
    const blogPost = await getBlogPostById(req.params.blogId);
    res.render('blog-edit', { blogPost: blogPost });
}


export async function editBlogPostById(req, res) {
    const updatedFields = {
        title: req.body.title,
        content: req.body.content,
        lastUpdated: Date.now(),
        tags: req.body.tags.split(','),
    };

    try {
        const result = await BlogPost.findByIdAndUpdate(
            req.params.blogId,
            { $set: updatedFields },
            { new: true }
        );

        if (result) {
            res.redirect(`/blog/${req.params.blogId}`);
        } else {
            res.status(404).send('Blog post not found.');
        }
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).send('Internal Server Error');
    }
}


export async function deleteBlogPostById(req, res) {
    try {
        const result = await BlogPost.findByIdAndDelete(req.params.blogId);
        if (result) {
            res.redirect('/dashboard');
        } else {
            res.status(404).send('Blog post not found.');
        }
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).send('Internal Server Error');
    }
}