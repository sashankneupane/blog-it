import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'hbs');


app.set('views', path.join(__dirname, 'views'));


const userData = {
  username: 'sampleuser',
  name: 'Sample User',
  email: 'sampleuser@example.com',
  blogPosts: [
    { title: 'Sample Blog Post 1', content: 'Lorem ipsum...' },
    { title: 'Sample Blog Post 2', content: 'Lorem ipsum...' },
  ],
};

// Routes
app.get('/', (req, res) => {
  res.render('layout', { user: userData }); 
});

app.get('/user-profile', (req, res) => {
  res.render('user-profile', { user: userData });
});

app.get('/user-dashboard', (req, res) => {
  res.render('user-dashboard', { user: userData }); 
});

app.get('/blog-create', (req, res) => {
});

app.get('/blog-list', (req, res) => {
  res.render('blog-list', { blogPosts: userData.blogPosts });
});

app.get('/blog-post', (req, res) => {
  const blogPostData = { title: 'Sample Blog Post', content: 'Lorem ipsum...' };
  res.render('blog-post', { blogPost: blogPostData }); // Render the blog-post.hbs template
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});