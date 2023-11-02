import './config.mjs';
import './db.mjs';

import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

const formatDate = (date) => {
    return moment(date).format('MMMM D, YYYY');
}


app.get('/', async (req, res) => {
    const data = {};
    data.blogPosts = await mongoose.model('BlogPost').find().populate('author');
    console.log(data.blogPosts);
    res.render('index', { data: data });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const User = mongoose.model('User');
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.firstname + ' ' + req.body.lastname,
    });
    await user.save();
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const User = mongoose.model('User');
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

app.get('/create-blog', (req, res) => {
    res.render('create-blog');
});

app.post('/create-blog', async (req, res) => {
    // get user1
    const user = await mongoose.model('User').findOne({ username: 'user1' });
    const BlogPost = mongoose.model('BlogPost');
    const blogPost = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        author: user._id,
        publicationDate: Date.now(),
        lastUpdated: Date.now(),
        tags: req.body.tags.split(','),
    });
    await blogPost.save();
    res.redirect('/');
});

app.get('/blog/:id', async (req, res) => {
    const blogPost = await mongoose.model('BlogPost').findById(req.params.id).populate('author');
    res.render('blog-post', { blogPost: blogPost });
});

app.get('/u/:username', async (req, res) => {
    const user = await mongoose.model('User').findOne({ username: req.params.username });
    const blogPosts = await mongoose.model('BlogPost').find({ author: user._id });
    res.render('public-user-blogs', { username: user.username, blogPosts: blogPosts });
});

app.get('/dashboard', async (req, res) => {
    const user = await mongoose.model('User').findOne({ username: 'user1' });
    const blogPosts = await mongoose.model('BlogPost').find({ author: user._id });
    res.render('dashboard', { 
        username: user.username,
        userBlogs: blogPosts,
        
    });
});

app.get('/blog/:id/edit', async (req, res) => {
    const blogPost = await mongoose.model('BlogPost').findById(req.params.id);
    res.render('blog-edit', { blogPost: blogPost });
});

app.post('/blog/:id/edit', async (req, res) => {
    const blogPost = await mongoose.model('BlogPost').findById(req.params.id);
    blogPost.title = req.body.title;
    blogPost.content = req.body.content;
    blogPost.lastUpdated = Date.now();
    blogPost.tags = req.body.tags.split(',');
    await blogPost.save();
    res.redirect('/blog/' + req.params.id);
});

app.get('/blog/:id/delete', async (req, res) => {
    const BlogPost = mongoose.model('BlogPost');
    await BlogPost.deleteOne({_id: req.params.id});
    res.redirect('/dashboard');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});