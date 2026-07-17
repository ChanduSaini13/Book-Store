import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpenIcon, FolderIcon, ChartBarIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth.js';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Books', icon: BookOpenIcon, href: '/admin/books' },
    { label: 'Categories', icon: FolderIcon, href: '/admin/categories' },
    { label: 'Reports', icon: ChartBarIcon, href: '/admin/reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">BookStore Admin</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
