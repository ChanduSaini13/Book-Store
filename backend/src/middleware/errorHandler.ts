import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error('Error:', error);

  const debug = (req.query && (req.query as any).debug === '1') || req.headers['x-debug'] === 'true';

  if (error instanceof ApiError) {
    const payload: any = { message: error.message };
    if (debug && error instanceof Error) payload.stack = error.stack;
    res.status(error.statusCode).json(payload);
    return;
  }

  const payload: any = { message: 'Internal server error' };
  if (debug && error instanceof Error) payload.stack = error.stack;
  res.status(500).json(payload);
};
