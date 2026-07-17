export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const createDummyBookCover = (title: string, author?: string) => {
  const safeTitle = escapeXml(title || 'Book Cover').slice(0, 24);
  const safeAuthor = escapeXml(author || 'BookStore').slice(0, 24);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
      <rect width="600" height="900" fill="#2563eb" />
      <rect x="50" y="60" width="500" height="780" rx="28" fill="#f8fafc" opacity="0.95" />
      <rect x="90" y="110" width="420" height="28" rx="14" fill="#60a5fa" />
      <rect x="90" y="168" width="300" height="22" rx="11" fill="#93c5fd" />
      <rect x="90" y="330" width="290" height="18" rx="9" fill="#64748b" />
      <rect x="90" y="368" width="240" height="18" rx="9" fill="#64748b" />
      <rect x="90" y="406" width="200" height="18" rx="9" fill="#64748b" />
      <circle cx="300" cy="660" r="96" fill="#1d4ed8" opacity="0.18" />
      <path d="M210 740c30-80 156-80 186 0" stroke="#1d4ed8" stroke-width="18" fill="none" stroke-linecap="round" />
      <text x="300" y="780" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#0f172a">${safeTitle}</text>
      <text x="300" y="826" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#475569">${safeAuthor}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

import { API_BASE_URL } from './constants';

export const resolveBookCoverImage = (src: string | undefined, title: string, author?: string) => {
  if (!src || /via\.placeholder\.com|placehold\.co/i.test(src)) {
    return createDummyBookCover(title, author);
  }

  // If src is a relative uploads path, prefix with backend API base URL
  if (src.startsWith('/uploads') || src.startsWith('uploads')) {
    return `${API_BASE_URL.replace(/\/$/, '')}${src}`;
  }

  return src;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const getCategoryBreadcrumb = (categories: any[], categoryId: string): string => {
  // Flatten nested category tree into a flat array
  const flatCategories: any[] = [];
  const flatten = (cats: any[]) => {
    cats.forEach((cat) => {
      flatCategories.push(cat);
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children);
      }
    });
  };
  flatten(Array.isArray(categories) ? categories : []);

  const findPath = (id: string, path: string[] = []): string[] => {
    const category = flatCategories.find((c) => c.id === id);
    if (!category) return path;

    path.push(category.name);

    if (category.parentId) {
      return findPath(category.parentId, path);
    }
    return path;
  };

  const path = findPath(categoryId);
  return path.reverse().join(' > ');
};
