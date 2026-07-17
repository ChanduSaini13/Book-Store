export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  categoryId: string;
  createdAt: string;
  isFavorite?: boolean;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  children?: Category[];
}

export interface Favorite {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ReportData {
  favoriteCount: number;
  chartData: MonthlyStatistic[];
  topCategories: CategoryStat[];
  topBooks: BookStat[];
  recentBooks: Book[];
}

export interface MonthlyStatistic {
  month: string;
  count: number;
}

export interface CategoryStat {
  name: string;
  count: number;
}

export interface BookStat {
  id: string;
  title: string;
  author: string;
  count: number;
}
