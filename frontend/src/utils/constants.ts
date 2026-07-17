export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  ME: '/auth/me',

  // Books
  BOOKS: '/books',
  BOOK_DETAIL: (id: string) => `/books/${id}`,
  CREATE_BOOK: '/books',
  UPDATE_BOOK: (id: string) => `/books/${id}`,
  DELETE_BOOK: (id: string) => `/books/${id}`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_TREE: '/categories/tree',
  UPDATE_CATEGORY: (id: string) => `/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `/categories/${id}`,

  // Favorites
  FAVORITES: '/favorites',
  ADD_FAVORITE: (bookId: string) => `/favorites/${bookId}`,
  REMOVE_FAVORITE: (bookId: string) => `/favorites/${bookId}`,

  // Reports
  REPORTS_DASHBOARD: '/reports/dashboard',
};
