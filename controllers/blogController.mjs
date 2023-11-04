import User from '../db/models/User.mjs';
import BlogPost from '../db/models/Blogpost.mjs';
import Tag from '../db/models/Tag.mjs';

async function getBlogPostById(id) {
    return await BlogPost.findById(id)
};

async function getUserByID(id) {
    return await User.findById(id);
};

export async function ensureOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        const blogPost = await getBlogPostById(req.params.blogId);
        if (blogPost && req.user._id.toString() === blogPost.author.toString()) {
            return next();
        }
    }
    if (req.isAuthenticated()) {
        res.redirect('/u/dashboard');
    } else {
        res.redirect('/auth/login');
    }
};

export async function getWriteBlogPage(req, res) {
    res.render('write');
};

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
    try {
        const blogPost = await getBlogPostById(req.params.blogId);
        blogPost.author = await getUserByID(blogPost.author);
        for (const comment of blogPost.comments) {
            comment.author = await getUserByID(comment.author);
        }
        res.render('blog-post', { 
            blogPost: blogPost,
            user: req.user, 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};


export async function getBlogEditPageById(req, res) {
    const blogPost = await getBlogPostById(req.params.blogId);
    res.render('blog-edit', { 
        blogPost: blogPost,
        user: req.user,
    });
};


export async function editBlogPostById(req, res) {
    const updatedFields = {
        title: req.body.title,
        content: req.body.content,
        lastUpdated: Date.now(),
        tags: req.body.tags.split(','),
    };
    updatedFields.tags = updatedFields.tags.map((tag) => {
        tag = tag.trim();
        try {
            const tagObj = Tag.findOne({ name: tag });
            return tagObj._id;
        } catch (error) {
            const newTag = new Tag({ name: tag });
            newTag.save();
            return newTag._id;
        }
    });
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
};


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
};