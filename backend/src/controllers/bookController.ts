import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as bookService from '../services/bookService.js';
import { badRequestError } from '../utils/errors.js';

export const createBook = async (req: AuthRequest, res: Response) => {
  const { title, author, description, categoryId } = req.body;
  const file = req.file;

  if (!title || !author || !description || !categoryId) {
    throw badRequestError('Title, author, description, and categoryId are required');
  }

  if (!file) {
    // If no file provided (frontend uses default cover), use a placeholder image URL
    // Use the book title to generate a placeholder image label
    // No-op placeholder variable removed; we'll compute external placeholder below when assigning coverImage.
  }

  const coverImage = file ? `/uploads/${file.filename}` : `https://via.placeholder.com/300x400?text=${encodeURIComponent(title || 'Book')}`;

  const book = await bookService.createBook({
    title,
    author,
    description,
    coverImage,
    categoryId,
  });

  res.status(201).json(book);
};

export const getBooks = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;
  const categoryId = req.query.categoryId as string;
  const sort = (req.query.sort as string) || 'newest';

  const result = await bookService.getBooks(page, limit, search, categoryId, sort, req.userId);
  res.status(200).json(result);
};

export const getBook = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const book = await bookService.getBookById(id, req.userId);
  res.status(200).json(book);
};

export const updateBook = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, author, description, categoryId } = req.body;
  const file = req.file;

  const updateData: any = {};

  if (title) updateData.title = title;
  if (author) updateData.author = author;
  if (description) updateData.description = description;
  if (categoryId) updateData.categoryId = categoryId;
  if (file) updateData.coverImage = `/uploads/${file.filename}`;

  if (Object.keys(updateData).length === 0) {
    throw badRequestError('No fields to update');
  }

  const book = await bookService.updateBook(id, updateData);
  res.status(200).json(book);
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await bookService.deleteBook(id);
  res.status(204).send();
};
