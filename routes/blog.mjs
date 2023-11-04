import express from 'express';
import { 
    getWriteBlogPage,
    writeBlogPost,
    getBlogPageById,
    getBlogEditPageById,
    editBlogPostById,
    deleteBlogPostById,
} from '../controllers/blogController.mjs';

const router = express.Router();

// Page to write a new blog post
router.get('/write', getWriteBlogPage);
router.post('/write', writeBlogPost);

// Page to view a single blog post
router.get('/:blogId', getBlogPageById);

// Page to edit a blog post
router.get('/:blogId/edit', getBlogEditPageById);
router.post('/:blogId/edit', editBlogPostById);

// DELETE a blog post
router.get('/:blogId/delete', deleteBlogPostById);

export default router;