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
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 600 900">
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

// Return raw SVG markup (not encoded) for inline rendering when needed
export const createDummyBookCoverRaw = (title: string, author?: string) => {
  const safeTitle = escapeXml(title || 'Book Cover').slice(0, 24);
  const safeAuthor = escapeXml(author || 'BookStore').slice(0, 24);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 600 900">
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

  return svg;
};

// Use a single, consistent default cover for all books to avoid instance-local upload issues.
const DEFAULT_COVER_DATAURL = createDummyBookCover('Book Cover', 'BookStore');

export const resolveBookCoverImage = (_src: string | undefined, _title: string, _author?: string) => {
  // Always return the default cover image so UI is consistent across deployments.
  return DEFAULT_COVER_DATAURL;
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
