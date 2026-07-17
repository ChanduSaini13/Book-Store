import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as bookController from '../controllers/bookController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, uploadMiddleware.single('coverImage'), asyncHandler(bookController.createBook));
router.get('/', asyncHandler(bookController.getBooks));
router.get('/:id', asyncHandler(bookController.getBook));
router.put('/:id', authMiddleware, adminMiddleware, uploadMiddleware.single('coverImage'), asyncHandler(bookController.updateBook));
router.delete('/:id', authMiddleware, adminMiddleware, asyncHandler(bookController.deleteBook));

export default router;
