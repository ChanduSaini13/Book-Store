import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { hashPassword } from '../utils/password.js';

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

// Temporary endpoint to reset admin password to a known value (admin123)
router.post('/reset-admin', async (req: Request, res: Response): Promise<Response> => {
  const debugHeader = req.headers['x-debug'];
  if (!debugHeader || debugHeader !== 'true') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const hashed = await hashPassword('admin123');
  const updated = await prisma.user.updateMany({ where: { email: 'admin@example.com' }, data: { password: hashed } });
  return res.json({ updatedCount: updated.count });
});

export default router;

