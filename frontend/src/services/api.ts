import axios, { AxiosInstance } from 'axios';
import { storage } from '../utils/storage.js';
import { API_BASE_URL } from '../utils/constants.js';
import type { Book, Category, PaginatedResponse, AuthResponse, ReportData } from '../types/index.js';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; confirmPassword: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  getMe: () =>
    apiClient.get('/auth/me'),
};

// Books API
export const booksAPI = {
  getBooks: (page: number = 1, limit: number = 20, search?: string, categoryId?: string, sort?: string) =>
    apiClient.get<PaginatedResponse<Book>>('/books', {
      params: { page, limit, search, categoryId, sort },
    }),

  getBook: (id: string) =>
    apiClient.get<Book>(`/books/${id}`),

  createBook: (data: FormData) =>
    apiClient.post<Book>('/books', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateBook: (id: string, data: FormData | Partial<Book>) =>
    apiClient.put<Book>(`/books/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  deleteBook: (id: string) =>
    apiClient.delete(`/books/${id}`),
};

// Categories API
export const categoriesAPI = {
  getCategories: () =>
    apiClient.get<Category[]>('/categories'),

  getCategoryTree: () =>
    apiClient.get<Category[]>('/categories/tree'),

  createCategory: (data: { name: string; parentId?: string }) =>
    apiClient.post<Category>('/categories', data),

  updateCategory: (id: string, data: { name: string; parentId?: string }) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  deleteCategory: (id: string) =>
    apiClient.delete(`/categories/${id}`),
};

// Favorites API
export const favoritesAPI = {
  getFavorites: (page: number = 1, limit: number = 20) =>
    apiClient.get<PaginatedResponse<Book>>('/favorites', {
      params: { page, limit },
    }),

  addFavorite: (bookId: string) =>
    apiClient.post(`/favorites/${bookId}`),

  removeFavorite: (bookId: string) =>
    apiClient.delete(`/favorites/${bookId}`),
};

// Reports API
export const reportsAPI = {
  getDashboard: () =>
    apiClient.get<ReportData>('/reports/dashboard'),
};

export default apiClient;
