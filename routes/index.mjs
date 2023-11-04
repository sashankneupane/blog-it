import express from 'express';

import homeRoutes from './home.mjs';
import blogRoutes from './blog.mjs';
import userRoutes from './user.mjs';
import authRoutes from './auth.mjs';

const router = express.Router();

router.use('/', homeRoutes);
router.use('/blog', blogRoutes);
router.use('/u', userRoutes);
router.use('/auth', authRoutes);

export default router;