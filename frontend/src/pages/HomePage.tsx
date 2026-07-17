import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../layouts/Layout.js';
import { booksAPI, categoriesAPI } from '../services/api.js';
import { Input } from '../components/common/Input.js';
import { Card, CardImage, CardBody, CardTitle, CardDescription } from '../components/common/Card.js';
import { BookCardSkeleton } from '../components/common/Skeleton.js';
import { Pagination } from '../components/common/Pagination.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { showToast } from '../utils/toast.js';
import type { Book, Category } from '../types/index.js';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, sortBy]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await booksAPI.getBooks(page, 20, debouncedSearch, selectedCategory, sortBy);
        setBooks(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        showToast('Failed to load books', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [page, debouncedSearch, selectedCategory, sortBy]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    fetchCategories();
  }, []);

  const flattenCategories = (cats: Category[], result: any[] = []): any[] => {
    cats.forEach((cat) => {
      if (cat.level === 3) {
        result.push({ id: cat.id, name: cat.name });
      }
      if (cat.children) {
        flattenCategories(cat.children, result);
      }
    });
    return result;
  };

  const leafCategories = flattenCategories(categories);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Discover Books</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            >
              <option value="">All Categories</option>
              {leafCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? Array(8)
                .fill(0)
                .map((_, i) => <BookCardSkeleton key={i} />)
            : books.map((book) => (
                <Card
                  key={book.id}
                  onClick={() => navigate(`/books/${book.id}`)}
                  hover
                >
                  <CardImage src={book.coverImage} alt={book.title} />
                  <CardBody>
                    <CardTitle>{book.title}</CardTitle>
                    <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                    <CardDescription>{book.description}</CardDescription>
                  </CardBody>
                </Card>
              ))}
        </div>

        {!isLoading && books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No books found</p>
          </div>
        )}

        {!isLoading && books.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
