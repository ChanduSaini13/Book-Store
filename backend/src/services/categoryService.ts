import prisma from '../utils/prisma.js';
import { notFoundError, badRequestError } from '../utils/errors.js';

export interface CreateCategoryInput {
  name: string;
  parentId?: string;
}

export const createCategory = async (input: CreateCategoryInput) => {
  let level = 1;
  if (input.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: input.parentId } });
    if (!parent) {
      throw notFoundError('Parent category');
    }
    level = parent.level + 1;
    if (level > 3) {
      throw badRequestError('Category level cannot exceed 3');
    }
  }

  const category = await prisma.category.create({
    data: {
      name: input.name,
      parentId: input.parentId || null,
      level,
    },
  });

  return formatCategory(category);
};

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      children: true,
      _count: { select: { books: true } },
    },
    orderBy: { level: 'asc' },
  });

  return buildCategoryTree(categories);
};

export const getCategoryTree = async () => {
  const rootCategories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { include: { children: true } } },
    orderBy: { name: 'asc' },
  });

  return rootCategories.map((cat) => formatCategoryWithChildren(cat));
};

export const updateCategory = async (id: string, input: CreateCategoryInput) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw notFoundError('Category');
  }

  // Prevent changing to same level or higher
  if (input.parentId) {
    const newParent = await prisma.category.findUnique({ where: { id: input.parentId } });
    if (!newParent) {
      throw notFoundError('Parent category');
    }

    const newLevel = newParent.level + 1;
    if (newLevel > 3) {
      throw badRequestError('Category level cannot exceed 3');
    }

    // Check for circular reference
    let current = newParent;
    while (current) {
      if (current.id === id) {
        throw badRequestError('Cannot set category as its own parent');
      }
      if (!current.parentId) break;
      current = await prisma.category.findUnique({ where: { id: current.parentId } });
    }
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: input.name,
      parentId: input.parentId || null,
    },
    include: { children: true },
  });

  return formatCategory(updated);
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw notFoundError('Category');
  }

  const hasBooks = await prisma.book.findFirst({ where: { categoryId: id } });
  if (hasBooks) {
    throw badRequestError('Cannot delete category with books');
  }

  const hasChildren = await prisma.category.findFirst({ where: { parentId: id } });
  if (hasChildren) {
    throw badRequestError('Cannot delete category with subcategories');
  }

  await prisma.category.delete({ where: { id } });
};

export const getCategoryBreadcrumb = async (categoryId: string): Promise<any[]> => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return [];

  const breadcrumb = [category];
  let current = category;

  while (current.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: current.parentId } });
    if (!parent) break;
    breadcrumb.unshift(parent);
    current = parent;
  }

  return breadcrumb;
};

const formatCategory = (cat: any) => ({
  id: cat.id,
  name: cat.name,
  level: cat.level,
  parentId: cat.parentId,
});

const formatCategoryWithChildren = (cat: any): any => ({
  id: cat.id,
  name: cat.name,
  level: cat.level,
  parentId: cat.parentId,
  children: (cat.children || []).map((child: any) => formatCategoryWithChildren(child)),
});

const buildCategoryTree = (categories: any[]) => {
  const roots = categories.filter((cat) => !cat.parentId);
  const buildTree = (cat: any): any => ({
    id: cat.id,
    name: cat.name,
    level: cat.level,
    parentId: cat.parentId,
    children: categories.filter((c) => c.parentId === cat.id).map(buildTree),
  });
  return roots.map(buildTree);
};
