import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as favoriteService from '../services/favoriteService.js';

export const addFavorite = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
  const book = await favoriteService.addFavorite(req.userId!, bookId);
  res.status(201).json(book);
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
  await favoriteService.removeFavorite(req.userId!, bookId);
  res.status(204).send();
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await favoriteService.getFavorites(req.userId!, page, limit);
  res.status(200).json(result);
};
