import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as categoryController from '../controllers/categoryController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, asyncHandler(categoryController.createCategory));
router.get('/tree', asyncHandler(categoryController.getCategoryTree));
router.get('/', asyncHandler(categoryController.getCategories));
router.put('/:id', authMiddleware, adminMiddleware, asyncHandler(categoryController.updateCategory));
router.delete('/:id', authMiddleware, adminMiddleware, asyncHandler(categoryController.deleteCategory));

export default router;
