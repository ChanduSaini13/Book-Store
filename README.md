# Books Management Website

A complete full-stack web application for managing books with admin and user roles. Built with React, Node.js, Express, and PostgreSQL.

## Features

### Admin Features
- Dashboard with statistics and reports
- Book management (Create, Read, Update, Delete)
- Category management with 3-level hierarchy
- Reports with charts (Books Favorited Last Month, Top Categories, etc.)
- User management and analytics

### User Features
- View book list with pagination (20 books per page)
- Search books by title, author, or category
- Sort books (Newest, Oldest, A-Z, Z-A)
- View detailed book information
- Add/remove books from favorites
- View favorite books

### General Features
- JWT Authentication with bcrypt password hashing
- Role-based access control
- Responsive design (Desktop, Tablet, Mobile)
- Loading skeletons and toast notifications
- Image lazy loading
- Debounced search
- Breadcrumb navigation

## Tech Stack

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router v6
- Axios
- React Hook Form
- Zod Validation
- TanStack Query (React Query)
- Recharts
- Hero Icons

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT (jsonwebtoken)
- bcryptjs

## Project Structure

```
.
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Utility functions
│   │   ├── layouts/         # Layout components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                  # Express backend application
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   ├── prisma/          # Database setup
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed data script
│   ├── uploads/             # File upload directory
│   ├── package.json
│   └── .env                 # Environment variables
├── shared/                   # Shared types
│   └── types.ts
├── docker-compose.yml       # Docker Compose configuration
└── README.md

```

## Installation

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### Setup

1. Clone the repository:
```bash
cd Project
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Setup backend environment:
```bash
cd ../backend
cp .env.example .env
# Edit .env with your database credentials
```

5. Setup database:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

6. Start backend server:
```bash
npm run dev
```

7. In a new terminal, start frontend:
```bash
cd frontend
npm run dev
```

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
npm run prisma:studio    # Open Prisma Studio
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Type check with TypeScript
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/books_db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Books
- `GET /books` - Get books list (paginated)
- `GET /books/:id` - Get book details
- `POST /books` - Create book (Admin only)
- `PUT /books/:id` - Update book (Admin only)
- `DELETE /books/:id` - Delete book (Admin only)

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (Admin only)
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Favorites
- `GET /favorites` - Get user's favorite books
- `POST /favorites/:bookId` - Add book to favorites
- `DELETE /favorites/:bookId` - Remove book from favorites

### Reports
- `GET /reports/dashboard` - Get admin dashboard data

## Database Schema

### User
- id (UUID, Primary Key)
- name (String)
- email (String, Unique)
- password (String, hashed)
- role (Enum: ADMIN, USER)
- createdAt (DateTime)

### Book
- id (UUID, Primary Key)
- title (String)
- author (String)
- description (Text)
- coverImage (String)
- categoryId (UUID, Foreign Key)
- createdAt (DateTime)

### Category
- id (UUID, Primary Key)
- name (String)
- parentId (UUID, Foreign Key, nullable)
- level (Int)

### Favorite
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- bookId (UUID, Foreign Key)
- createdAt (DateTime)

## Docker Setup

Run the entire application with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Backend server
- Frontend application

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with a static server
```

## Authentication Flow

1. User registers or logs in with email and password
2. Password is hashed using bcrypt
3. Server generates JWT token
4. Token is stored in localStorage (frontend)
5. Token is sent in Authorization header for protected routes
6. Server validates token and extracts user info

## Error Handling

- All API endpoints return standard error responses
- Frontend displays toast notifications for errors
- Error boundaries catch React component errors
- Loading skeletons show while data is being fetched

## Security

- Passwords hashed with bcrypt
- JWT for authentication
- Protected API routes with role-based access
- CORS enabled for frontend origin
- Input validation with Zod
- SQL injection prevention with Prisma ORM

## Performance

- Server-side pagination (20 books per page)
- Debounced search (300ms)
- Image lazy loading
- Optimized database queries
- Caching with TanStack Query
- Code splitting in React

## Testing

The application has been tested for:
- Authentication and authorization
- CRUD operations for books and categories
- Favorite functionality
- Search and pagination
- Reports and dashboard
- Error handling
- Responsive design

## Troubleshooting

### Database connection errors
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### JWT errors
- Check JWT_SECRET is set in .env
- Verify token format in Authorization header
- Token should be: `Bearer <token>`

### Frontend API errors
- Verify backend is running on correct port
- Check VITE_API_URL in frontend .env
- Clear browser cache and localStorage

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
