import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = true }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        hover ? 'hover:shadow-md' : ''
      } transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardImage: React.FC<{ src?: string; alt: string }> = (props) => (
  <img
    src={'/image1.jpg'}
    alt={props.alt}
    className="w-full h-40 object-cover rounded-t-lg"
    loading="lazy"
  />
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`p-4 ${className}`}>{children}</div>;

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h3 className={`font-bold text-lg text-gray-900 mb-2 ${className}`}>{children}</h3>;

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <p className={`text-gray-600 text-sm mb-3 line-clamp-2 ${className}`}>{children}</p>;
