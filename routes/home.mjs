import express from 'express';
import { 
    getHomePage,
    redirectToHomePage 
} from '../controllers/homeController.mjs';

const router = express.Router();

router.get('/home', getHomePage);
router.get('/', redirectToHomePage);

export default router;