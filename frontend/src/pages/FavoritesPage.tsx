import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layouts/Layout.js';
import { favoritesAPI, categoriesAPI } from '../services/api.js';
import { Button } from '../components/common/Button.js';
import { Card, CardImage, CardBody, CardTitle } from '../components/common/Card.js';
import { BookCardSkeleton } from '../components/common/Skeleton.js';
import { Pagination } from '../components/common/Pagination.js';
import { showToast } from '../utils/toast.js';
import { getCategoryBreadcrumb } from '../utils/helpers.js';
import type { Book, Category } from '../types/index.js';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [booksResponse, categoriesResponse] = await Promise.all([
          favoritesAPI.getFavorites(page, 20),
          categoriesAPI.getCategories(),
        ]);
        setBooks(booksResponse.data.data);
        setTotalPages(booksResponse.data.meta.totalPages);
        setCategories(categoriesResponse.data);
      } catch (error) {
        showToast('Failed to load favorites', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleRemove = async (bookId: string) => {
    try {
      await favoritesAPI.removeFavorite(bookId);
      setBooks(books.filter((b) => b.id !== bookId));
      showToast('Removed from favorites', 'success');
    } catch (error) {
      showToast('Failed to remove from favorites', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Favorite Books</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No favorite books yet</p>
            <Button onClick={() => navigate('/')}>Browse Books</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {books.map((book) => (
                <Card key={book.id} className="flex flex-col">
                  <CardImage src={book.coverImage} alt={book.title} />
                  <CardBody className="flex-1 flex flex-col">
                    <CardTitle>{book.title}</CardTitle>
                    <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                    {book.category && (
                      <p className="text-xs text-gray-400 mb-4">
                        {getCategoryBreadcrumb(categories, book.categoryId) || 'Unknown'}
                      </p>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(book.id)}
                      className="mt-auto"
                    >
                      Remove
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
