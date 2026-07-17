import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../utils/jwt.js';
import { unauthorizedError } from '../utils/errors.js';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'ADMIN' | 'USER';
  userEmail?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw unauthorizedError('Missing or invalid authorization header');
    }

    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.userRole = payload.role === 'ADMIN' ? 'ADMIN' : 'USER';
    req.userEmail = payload.email;

    next();
  } catch (error) {
    const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 401;
    const message = error instanceof Error ? error.message : 'Unauthorized';
    res.status(statusCode).json({ message });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.userRole !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};

export const userMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  next();
};
