import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as authService from '../services/authService.js';
import { badRequestError } from '../utils/errors.js';

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    throw badRequestError('Name, email, and password are required');
  }

  if (password !== confirmPassword) {
    throw badRequestError('Passwords do not match');
  }

  if (password.length < 6) {
    throw badRequestError('Password must be at least 6 characters');
  }

  const result = await authService.registerUser({ name, email, password });
  res.status(201).json(result);
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw badRequestError('Email and password are required');
  }

  const result = await authService.loginUser({ email, password });
  res.status(200).json(result);
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    id: req.userId,
    email: req.userEmail,
    role: req.userRole,
  });
};
