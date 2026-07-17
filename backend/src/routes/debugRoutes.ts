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

// Temporary endpoint to create/upsert an admin via query string
router.get('/create-admin', async (req: Request, res: Response): Promise<Response> => {
  const debugHeader = req.headers['x-debug'];
  if (!debugHeader || debugHeader !== 'true') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const email = String(req.query.email || 'admin2@example.com');
  const name = String(req.query.name || 'Admin 2');
  const password = String(req.query.password || 'admin123');

  const hashed = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, password: hashed, role: 'ADMIN' },
    create: { email, name, password: hashed, role: 'ADMIN' },
  });

  return res.json({ id: user.id, email: user.email });
});

// Temporary endpoint to create sample categories and books (idempotent)
router.get('/seed-books', async (req: Request, res: Response): Promise<Response> => {
  const debugHeader = req.headers['x-debug'];
  if (!debugHeader || debugHeader !== 'true') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // ensure categories
  const allBooks = await prisma.category.upsert({ where: { name: 'All Books' }, update: {}, create: { name: 'All Books', level: 1 } });
  const fiction = await prisma.category.upsert({ where: { name: 'Fiction' }, update: { parentId: allBooks.id }, create: { name: 'Fiction', level: 2, parentId: allBooks.id } });
  const classic = await prisma.category.upsert({ where: { name: 'Classic' }, update: { parentId: fiction.id }, create: { name: 'Classic', level: 3, parentId: fiction.id } });
  const tech = await prisma.category.upsert({ where: { name: 'Technology' }, update: { parentId: allBooks.id }, create: { name: 'Technology', level: 3, parentId: allBooks.id } });
  const business = await prisma.category.upsert({ where: { name: 'Business' }, update: { parentId: allBooks.id }, create: { name: 'Business', level: 3, parentId: allBooks.id } });

  const sampleBooks = [
    { title: 'Pride and Prejudice', author: 'Jane Austen', description: 'Classic romance', coverImage: 'https://via.placeholder.com/300x400?text=Pride+and+Prejudice', categoryId: classic.id },
    { title: 'Clean Code', author: 'Robert C. Martin', description: 'On writing clean code', coverImage: 'https://via.placeholder.com/300x400?text=Clean+Code', categoryId: tech.id },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', description: 'Fantasy adventure', coverImage: 'https://via.placeholder.com/300x400?text=The+Hobbit', categoryId: classic.id },
  ];

  for (const b of sampleBooks) {
    await prisma.book.upsert({ where: { title: b.title }, update: {}, create: b as any });
  }

  return res.json({ message: 'Seeded sample books' });
});

export default router;

