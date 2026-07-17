import prisma from '../utils/prisma.js';

export const getDashboardReports = async () => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Books favorited last month
  const favoritesLastMonth = await prisma.favorite.count({
    where: {
      createdAt: {
        gte: lastMonth,
        lt: currentMonthStart,
      },
    },
  });

  // Monthly statistics for the last 6 months
  const monthlyStats: any[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const count = await prisma.favorite.count({
      where: {
        createdAt: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    });

    monthlyStats.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      count,
    });
  }

  // Top categories by favorites
  const topCategories = await prisma.category.findMany({
    include: {
      books: {
        include: {
          favorites: true,
        },
      },
    },
  });

  const categoryStats = topCategories
    .map((cat) => ({
      name: cat.name,
      count: cat.books.reduce((sum, book) => sum + book.favorites.length, 0),
    }))
    .filter((cat) => cat.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top favorited books
  const topBooks = await prisma.book.findMany({
    include: {
      _count: { select: { favorites: true } },
    },
    orderBy: { favorites: { _count: 'desc' } },
    take: 5,
  });

  // Recently added books
  const recentBooks = await prisma.book.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return {
    favoriteCount: favoritesLastMonth,
    chartData: monthlyStats,
    topCategories: categoryStats,
    topBooks: topBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      count: book._count.favorites,
    })),
    recentBooks: recentBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverImage: book.coverImage,
      categoryId: book.categoryId,
      createdAt: book.createdAt.toISOString(),
      category: book.category
        ? {
            id: book.category.id,
            name: book.category.name,
            level: book.category.level,
            parentId: book.category.parentId,
          }
        : null,
    })),
  };
};
