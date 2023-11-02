import './config.mjs';
import './db.mjs';

import express from 'express';
import mongoose from 'mongoose';
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

app.get('/', async (req, res) => {
    const data = {};
    data.blogPosts = await mongoose.model('BlogPost').find().populate('author');
    console.log(data.blogPosts);
    res.render('index', { data: data });
});

app.get('/register', (req, res) => {
    res.render('register');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});