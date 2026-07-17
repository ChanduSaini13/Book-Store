import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/me', authMiddleware, asyncHandler(authController.getCurrentUser));

export default router;
