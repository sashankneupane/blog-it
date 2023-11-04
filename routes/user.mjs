import express from 'express';
import {
    getPublicUserBlogsPage,
    getDashboardPage,
} from '../controllers/userController.mjs';

const router = express.Router();

router.get('/:username', (req, res) => {
    if (req.params.username == 'dashboard') {
        getDashboardPage(req, res);
    } else {
        getPublicUserBlogsPage(req, res);
    }
});

export default router;