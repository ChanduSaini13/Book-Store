import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout.js';
import { reportsAPI } from '../../services/api.js';
import { showToast } from '../../utils/toast.js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ReportData } from '../../types/index.js';

const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await reportsAPI.getDashboard();
      setReports(response.data);
    } catch (error) {
      showToast('Failed to load reports', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!reports) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load reports</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Books Favorited Last Month</p>
            <p className="text-4xl font-bold text-blue-600">{reports.favoriteCount}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Total Top Categories</p>
            <p className="text-4xl font-bold text-green-600">{reports.topCategories.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Top Favorited Books</p>
            <p className="text-4xl font-bold text-purple-600">{reports.topBooks.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Recently Added</p>
            <p className="text-4xl font-bold text-orange-600">{reports.recentBooks.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Statistics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Favorites Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reports.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Favorites" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Categories */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.topCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Favorites" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Books */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Favorited Books</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Favorites</th>
                </tr>
              </thead>
              <tbody>
                {reports.topBooks.map((book) => (
                  <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{book.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Added Books */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Added Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.recentBooks.map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <img
                  src={'/image1.jpg'}
                  alt={book.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
