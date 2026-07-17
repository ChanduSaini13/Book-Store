import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.js';

// Pages
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import BookDetailPage from './pages/BookDetailPage.js';
import FavoritesPage from './pages/FavoritesPage.js';
import NotFoundPage from './pages/NotFoundPage.js';

// Admin Pages
import AdminBooksPage from './pages/admin/BooksPage.js';
import AdminCategoriesPage from './pages/admin/CategoriesPage.js';
import AdminReportsPage from './pages/admin/ReportsPage.js';

// Components
import { ProtectedRoute } from './components/common/ProtectedRoute.js';

import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />

          {/* Protected Routes */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminCategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
