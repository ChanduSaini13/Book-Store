import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

async function ensureUser(email: string, name: string, plainPassword: string, role: 'ADMIN' | 'USER') {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  const hashed = await hashPassword(plainPassword);
  return prisma.user.create({ data: { email, name, password: hashed, role } });
}

async function ensureCategory(name: string, level: number, parentId?: string) {
  const existing = await prisma.category.findFirst({ where: { name, parentId: parentId || null } });
  if (existing) return existing;
  return prisma.category.create({ data: { name, level, parentId } });
}

async function ensureBook(book: { title: string; author: string; description: string; coverImage: string; categoryId: string | undefined }) {
  const existing = await prisma.book.findFirst({ where: { title: book.title, author: book.author } });
  if (existing) return existing;
  return prisma.book.create({ data: { title: book.title, author: book.author, description: book.description, coverImage: book.coverImage, categoryId: book.categoryId } });
}

async function main() {
  console.log('Starting idempotent database seed...');

  // Ensure admin and users
  const admin = await ensureUser('admin@example.com', 'Admin User', 'admin123', 'ADMIN');
  const user1 = await ensureUser('john@example.com', 'John Doe', 'user123', 'USER');
  const user2 = await ensureUser('jane@example.com', 'Jane Smith', 'user123', 'USER');

  // Ensure categories (hierarchy)
  const allBooks = await ensureCategory('All Books', 1);
  const fiction = await ensureCategory('Fiction', 2, allBooks.id);
  const romance = await ensureCategory('Romance', 3, fiction.id);
  const classicFiction = await ensureCategory('Classic', 3, fiction.id);
  const nonFiction = await ensureCategory('Non-Fiction', 2, allBooks.id);
  const technology = await ensureCategory('Technology', 3, nonFiction.id);
  const business = await ensureCategory('Business', 3, nonFiction.id);

  // Create books
  const books = [
    // Romance books
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description:
        'A romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet.',
      coverImage: 'https://via.placeholder.com/300x400?text=Pride+and+Prejudice',
      categoryId: romance.id,
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description:
        'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with the mysterious millionaire Jay Gatsby.',
      coverImage: 'https://via.placeholder.com/300x400?text=The+Great+Gatsby',
      categoryId: classicFiction.id,
    },
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      description:
        'A philosophical novel about a shepherd boy named Santiago who travels from Spain to Egypt in search of treasure.',
      coverImage: 'https://via.placeholder.com/300x400?text=The+Alchemist',
      categoryId: classicFiction.id,
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description:
        'A gripping tale of racial injustice and childhood innocence in the American South during the 1930s.',
      coverImage: 'https://via.placeholder.com/300x400?text=To+Kill+a+Mockingbird',
      categoryId: classicFiction.id,
    },

    // Technology books
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      description:
        'A practical guide for software developers covering best practices, tips, and tools for effective programming.',
      coverImage: 'https://via.placeholder.com/300x400?text=Pragmatic+Programmer',
      categoryId: technology.id,
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description:
        'A handbook of agile software craftsmanship that teaches how to write code that is beautiful and maintainable.',
      coverImage: 'https://via.placeholder.com/300x400?text=Clean+Code',
      categoryId: technology.id,
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      description:
        'A fantasy novel and children\'s book following the journey of home-loving hobbit Bilbo Baggins.',
      coverImage: 'https://via.placeholder.com/300x400?text=The+Hobbit',
      categoryId: classicFiction.id,
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      description:
        'A story about teenage rebellion and alienation following Holden Caulfield in 1950s New York.',
      coverImage: 'https://via.placeholder.com/300x400?text=Catcher+in+the+Rye',
      categoryId: classicFiction.id,
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      description:
        'An exploration of how tiny changes can lead to remarkable results through the power of habit stacking.',
      coverImage: 'https://via.placeholder.com/300x400?text=Atomic+Habits',
      categoryId: business.id,
    },
    {
      title: '1984',
      author: 'George Orwell',
      description:
        'A dystopian novel set in a totalitarian superstate under constant surveillance and propaganda.',
      coverImage: 'https://via.placeholder.com/300x400?text=1984',
      categoryId: classicFiction.id,
    },
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      description:
        'A philosophical novel about a shepherd boy named Santiago who travels from Spain to Egypt in search of treasure.',
      coverImage: 'https://via.placeholder.com/300x400?text=The+Alchemist',
      categoryId: romance.id,
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      description:
        'A sweeping history of humankind from the Stone Age to modern times, exploring what made us human.',
      coverImage: 'https://via.placeholder.com/300x400?text=Sapiens',
      categoryId: business.id,
    },
    {
      title: 'The Time Machine',
      author: 'H.G. Wells',
      description:
        'A science fiction novella about a time traveler who journeys far into the future.',
      coverImage: 'https://via.placeholder.com/300x400?text=Time+Machine',
      categoryId: classicFiction.id,
    },
    {
      title: 'The Lean Startup',
      author: 'Eric Ries',
      description:
        'A methodology for building startups that emphasizes rapid prototyping and validated learning.',
      coverImage: 'https://via.placeholder.com/300x400?text=Lean+Startup',
      categoryId: business.id,
    },
    {
      title: 'Design Patterns',
      author: 'Gang of Four',
      description:
        'A comprehensive guide to software design patterns that solve common design problems.',
      coverImage: 'https://via.placeholder.com/300x400?text=Design+Patterns',
      categoryId: technology.id,
    },
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      description:
        'An exploration of the two systems of thought: fast intuitive thinking and slow deliberate thinking.',
      coverImage: 'https://via.placeholder.com/300x400?text=Thinking+Fast+Slow',
      categoryId: business.id,
    },
    {
      title: 'Foundation',
      author: 'Isaac Asimov',
      description:
        'A science fiction novel series about a mathematician who uses psychohistory to predict the future.',
      coverImage: 'https://via.placeholder.com/300x400?text=Foundation',
      categoryId: classicFiction.id,
    },
    {
      title: 'The Moon is a Harsh Mistress',
      author: 'Robert A. Heinlein',
      description:
        'A science fiction novel about a lunar colony revolt against Earth rule.',
      coverImage: 'https://via.placeholder.com/300x400?text=Moon+Harsh+Mistress',
      categoryId: classicFiction.id,
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      description:
        'An epic science fiction novel set on the desert planet Arrakis in the distant future.',
      coverImage: 'https://via.placeholder.com/300x400?text=Dune',
      categoryId: classicFiction.id,
    },
    {
      title: 'The Giver',
      author: 'Lois Lowry',
      description:
        'A dystopian novel set in a seemingly perfect community where individuality is suppressed.',
      coverImage: 'https://via.placeholder.com/300x400?text=The+Giver',
      categoryId: classicFiction.id,
    },
  ];

  for (const bookData of books) {
    // map category names to IDs where necessary
    let categoryId = bookData.categoryId as any;
    if (categoryId === 'romance') categoryId = romance.id;
    if (categoryId === 'classic') categoryId = classicFiction.id;
    if (categoryId === 'technology') categoryId = technology.id;
    if (categoryId === 'business') categoryId = business.id;
    await ensureBook({ title: bookData.title, author: bookData.author, description: bookData.description, coverImage: bookData.coverImage, categoryId });
  }

  // Ensure at least some favorites exist (non-destructive)
  const existingFavorites = await prisma.favorite.findMany({ take: 1 });
  if (existingFavorites.length === 0) {
    const sampleBooks = await prisma.book.findMany({ take: 5 });
    for (let i = 0; i < sampleBooks.length; i++) {
      const userId = i % 2 === 0 ? user1.id : user2.id;
      try {
        await prisma.favorite.create({ data: { userId, bookId: sampleBooks[i].id } });
      } catch (e) {
        // ignore duplicates or FK issues
      }
    }
  }

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
