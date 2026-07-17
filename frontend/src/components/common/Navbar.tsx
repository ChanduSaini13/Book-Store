import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-blue-600 cursor-pointer"
          >
            BookStore
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              All Books
            </button>

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin/books')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </button>
            )}

            {user ? (
              <>
                <button
                  onClick={() => navigate('/favorites')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <HeartIcon className="w-5 h-5" />
                  Favorites
                </button>
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                  <span className="text-sm text-gray-600">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              All Books
            </button>

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => {
                  navigate('/admin/books');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Admin
              </button>
            )}

            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate('/favorites');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Favorites
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
