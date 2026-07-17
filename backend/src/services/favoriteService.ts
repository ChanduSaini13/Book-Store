import prisma from '../utils/prisma.js';
import { notFoundError } from '../utils/errors.js';

export const addFavorite = async (userId: string, bookId: string) => {
  const book = await prisma.book.findUnique({ where: { id: bookId }, include: { category: true } });
  if (!book) {
    throw notFoundError('Book');
  }

  const favorite = await prisma.favorite.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: {},
    create: { userId, bookId },
    include: {
      book: { include: { category: true } },
    },
  });

  return formatFavorite(favorite.book);
};

export const removeFavorite = async (userId: string, bookId: string) => {
  await prisma.favorite.delete({
    where: { userId_bookId: { userId, bookId } },
  });
};

export const getFavorites = async (userId: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      include: { book: { include: { category: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.favorite.count({ where: { userId } }),
  ]);

  return {
    data: favorites.map((fav) => formatFavorite(fav.book)),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const isFavorite = async (userId: string, bookId: string): Promise<boolean> => {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_bookId: { userId, bookId } },
  });
  return !!favorite;
};

const formatFavorite = (book: any) => ({
  id: book.id,
  title: book.title,
  author: book.author,
  description: book.description,
  coverImage: book.coverImage,
  categoryId: book.categoryId,
  createdAt: book.createdAt.toISOString(),
  category: book.category
    ? {
        id: book.category.id,
        name: book.category.name,
        level: book.category.level,
        parentId: book.category.parentId,
      }
    : null,
});
