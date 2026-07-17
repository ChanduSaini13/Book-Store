import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma.js';

const router = Router();

// Temporary debug endpoint: returns counts when request includes header x-debug: true
router.get('/status', async (req: Request, res: Response): Promise<Response> => {
  const debugHeader = req.headers['x-debug'];
  if (!debugHeader || debugHeader !== 'true') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const [usersCount, booksCount, categoriesCount, favoritesCount] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.category.count(),
    prisma.favorite.count(),
  ]);

  return res.json({ usersCount, booksCount, categoriesCount, favoritesCount });
});

export default router;
