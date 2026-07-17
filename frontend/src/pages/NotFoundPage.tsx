import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button.js';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
