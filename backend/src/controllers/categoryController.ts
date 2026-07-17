import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as categoryService from '../services/categoryService.js';
import { badRequestError } from '../utils/errors.js';

export const createCategory = async (req: AuthRequest, res: Response) => {
  const { name, parentId } = req.body;

  if (!name) {
    throw badRequestError('Category name is required');
  }

  const category = await categoryService.createCategory({ name, parentId });
  res.status(201).json(category);
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  const categories = await categoryService.getCategories();
  res.status(200).json(categories);
};

export const getCategoryTree = async (req: AuthRequest, res: Response) => {
  try {
    const tree = await categoryService.getCategoryTree();
    res.status(200).json(tree);
  } catch (error) {
    console.error('getCategoryTree error:', error);
    throw error;
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, parentId } = req.body;

  if (!name) {
    throw badRequestError('Category name is required');
  }

  const category = await categoryService.updateCategory(id, { name, parentId });
  res.status(200).json(category);
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await categoryService.deleteCategory(id);
  res.status(204).send();
};
