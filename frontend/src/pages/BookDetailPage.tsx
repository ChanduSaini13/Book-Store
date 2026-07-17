import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../layouts/Layout.js';
import { booksAPI, categoriesAPI, favoritesAPI } from '../services/api.js';
import { Button } from '../components/common/Button.js';
import { BookDetailSkeleton } from '../components/common/Skeleton.js';
import { Breadcrumb } from '../components/common/Breadcrumb.js';
import { FavoriteButton } from '../components/common/FavoriteButton.js';
import { useAuth } from '../hooks/useAuth.js';
import { showToast } from '../utils/toast.js';
import { getCategoryBreadcrumb } from '../utils/helpers.js';
import type { Book, Category } from '../types/index.js';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookResponse, categoriesResponse] = await Promise.all([
          booksAPI.getBook(id!),
          categoriesAPI.getCategories(),
        ]);
        setBook(bookResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        showToast('Failed to load book details', 'error');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!book) return;

    setIsFavoriteLoading(true);
    try {
      if (book.isFavorite) {
        await favoritesAPI.removeFavorite(book.id);
        setBook({ ...book, isFavorite: false });
        showToast('Removed from favorites', 'success');
      } else {
        await favoritesAPI.addFavorite(book.id);
        setBook({ ...book, isFavorite: true });
        showToast('Added to favorites', 'success');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update favorite', 'error');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookDetailSkeleton />
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Book not found</h1>
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to Books
          </Button>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = book.category
    ? [
        { label: 'All Books' },
        ...getCategoryBreadcrumb(categories, book.categoryId)
          .split(' > ')
          .map((name) => ({ label: name })),
      ]
    : [{ label: 'All Books' }];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="secondary" onClick={() => navigate('/')} className="mb-6">
          ← Back to Books
        </Button>

        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Book Cover */}
          <div>
            <img
              src={'/image1.jpg'}
              alt={book.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600">by {book.author}</p>
              </div>
              <FavoriteButton
                isFavorite={book.isFavorite || false}
                onClick={handleFavoriteToggle}
                isLoading={isFavoriteLoading}
              />
            </div>

            {book.category && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="text-gray-900">
                  {getCategoryBreadcrumb(categories, book.categoryId) || 'Unknown'}
                </p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About this book</h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>

            {user ? (
              <Button
                onClick={handleFavoriteToggle}
                isLoading={isFavoriteLoading}
                className="w-full"
              >
                {book.isFavorite ? '❤ Remove from Favorites' : '🤍 Add to Favorites'}
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} className="w-full">
                Login to Add to Favorites
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetailPage;
