import React from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar.js';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 overflow-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};
