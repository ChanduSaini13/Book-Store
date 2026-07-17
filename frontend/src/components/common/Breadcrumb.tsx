import React from 'react';

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">/</span>}
          {item.href ? (
            <a href={item.href} className="text-blue-600 hover:underline">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
