import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as favoriteController from '../controllers/favoriteController.js';
import { authMiddleware, userMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, userMiddleware, asyncHandler(favoriteController.getFavorites));
router.post('/:bookId', authMiddleware, userMiddleware, asyncHandler(favoriteController.addFavorite));
router.delete('/:bookId', authMiddleware, userMiddleware, asyncHandler(favoriteController.removeFavorite));

export default router;
