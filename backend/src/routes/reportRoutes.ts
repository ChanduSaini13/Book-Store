import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as reportController from '../controllers/reportController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authMiddleware, adminMiddleware, asyncHandler(reportController.getDashboardReports));

export default router;
