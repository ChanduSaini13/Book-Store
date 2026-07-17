import prisma from '../utils/prisma.js';
import { paginate, calculatePaginationMeta } from '../utils/pagination.js';
import { notFoundError } from '../utils/errors.js';

export interface CreateBookInput {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  categoryId: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  description?: string;
  coverImage?: string;
  categoryId?: string;
}

export const createBook = async (input: CreateBookInput) => {
  const book = await prisma.book.create({
    data: {
      title: input.title,
      author: input.author,
      description: input.description,
      coverImage: input.coverImage,
      categoryId: input.categoryId,
    },
    include: { category: true },
  });

  return formatBook(book);
};

export const getBooks = async (page: number = 1, limit: number = 20, search?: string, categoryId?: string, sort: string = 'newest', userId?: string) => {
  const { skip, take, page: validPage } = paginate(page, limit);

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const orderBy: any = {};
  switch (sort) {
    case 'oldest':
      orderBy.createdAt = 'asc';
      break;
    case 'title-asc':
      orderBy.title = 'asc';
      break;
    case 'title-desc':
      orderBy.title = 'desc';
      break;
    case 'newest':
    default:
      orderBy.createdAt = 'desc';
      break;
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { category: true },
    }),
    prisma.book.count({ where }),
  ]);

  const booksWithFavorites = await Promise.all(
    books.map(async (book) => {
      if (!userId) return formatBook(book);
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_bookId: { userId, bookId: book.id },
        },
      });
      return { ...formatBook(book), isFavorite: !!favorite };
    }),
  );

  return {
    data: booksWithFavorites,
    meta: calculatePaginationMeta(total, validPage, take),
  };
};

export const getBookById = async (id: string, userId?: string) => {
  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!book) {
    throw notFoundError('Book');
  }

  if (!userId) return formatBook(book);

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_bookId: { userId, bookId: book.id },
    },
  });

  return { ...formatBook(book), isFavorite: !!favorite };
};

export const updateBook = async (id: string, input: UpdateBookInput) => {
  const book = await prisma.book.update({
    where: { id },
    data: input,
    include: { category: true },
  });

  return formatBook(book);
};

export const deleteBook = async (id: string) => {
  await prisma.book.delete({ where: { id } });
};

const formatBook = (book: any) => {
  return {
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
  };
};
