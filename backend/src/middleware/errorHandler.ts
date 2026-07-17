import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error:', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  res.status(500).json({ message: 'Internal server error' });
};
