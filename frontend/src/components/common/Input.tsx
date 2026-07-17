import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
          error
            ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
            : 'border-gray-300 focus:border-blue-600 focus:ring-blue-100'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};
