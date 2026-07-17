import React from 'react';
import { resolveBookCoverImage, createDummyBookCoverRaw } from '../../utils/helpers.js';

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

export const CardImage: React.FC<{ src?: string; alt: string; title?: string; author?: string }> = (props) => {
  const src = props.src ? resolveBookCoverImage(props.src, props.title || '', props.author) : resolveBookCoverImage(undefined, props.title || '', props.author);

  // If the cover is an SVG data URL, render the raw SVG inline to avoid data: URL or CSP issues.
  if (typeof src === 'string' && src.startsWith('data:image/svg+xml')) {
    const svg = createDummyBookCoverRaw(props.title || '', props.author);
    return (
      <div className="w-full h-40 rounded-t-lg overflow-hidden">
        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    );
  }

  // Use a background-image div to render covers (works reliably with urls)
  return (
    <div
      role="img"
      aria-label={props.alt}
      className="w-full h-40 bg-center bg-cover rounded-t-lg"
      style={{ backgroundImage: `url("${src}")` }}
    />
  );
};

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
