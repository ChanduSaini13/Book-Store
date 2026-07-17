import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as reportService from '../services/reportService.js';

export const getDashboardReports = async (_req: AuthRequest, res: Response) => {
  const reports = await reportService.getDashboardReports();
  res.status(200).json(reports);
};
