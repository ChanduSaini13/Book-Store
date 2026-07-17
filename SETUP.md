# Installation & Setup Guide

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **npm**: v9 or higher
- **Git**: Latest version

## Quick Start (Local Development)

### Step 1: Clone and Navigate
```bash
cd Project
```

### Step 2: Setup PostgreSQL Database

#### On Windows (using PostgreSQL installation):
1. Open pgAdmin 4 or use psql command
2. Create a new database:
```sql
CREATE DATABASE books_db;
```

#### On macOS/Linux:
```bash
createdb books_db
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and set your DATABASE_URL if different from localhost

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 4: Setup Frontend (in new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env if backend is on different URL

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Admin Account

After seeding, you can login with:
- **Email**: admin@example.com
- **Password**: admin123

Regular users can register through the signup page.

## Available Scripts

### Backend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio (GUI for DB)
npm run type-check       # Check TypeScript types
```

### Frontend
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Type check with TypeScript
```

## Project Features

### User Features
- ✅ Browse books with search and filters
- ✅ View book details
- ✅ Add/remove favorites
- ✅ View favorite books
- ✅ Register and login
- ✅ Pagination (20 books per page)

### Admin Features
- ✅ Manage books (Create, Read, Update, Delete)
- ✅ Manage categories (3-level hierarchy)
- ✅ View reports and statistics
- ✅ Upload book cover images
- ✅ Dashboard with charts

### Technical Features
- ✅ JWT Authentication
- ✅ bcrypt Password hashing
- ✅ PostgreSQL database
- ✅ Prisma ORM
- ✅ React 19 + Vite
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Recharts for dashboards
- ✅ React Hook Form + Zod validation
- ✅ TanStack Query
- ✅ Hero Icons
- ✅ Responsive design
- ✅ Loading skeletons
- ✅ Toast notifications
- ✅ Error boundaries

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure PostgreSQL is running
- Windows: Check Services > PostgreSQL
- macOS: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

### Port Already in Use
If port 5000 or 5173 is already in use:
```bash
# Backend: Change PORT in .env
PORT=5001

# Frontend: Change port in vite.config.ts
server: { port: 5174 }
```

### JWT Authentication Error
**Solution**: Make sure JWT_SECRET in .env is set

### Migrations Failed
```bash
# Reset database (WARNING: deletes all data)
npm run prisma:migrate reset

# Then seed again
npm run prisma:seed
```

## Database Schema

### Users
- id, name, email, password (hashed), role (ADMIN/USER), createdAt

### Categories
- id, name, level (1-3), parentId (for hierarchy), createdAt

### Books
- id, title, author, description, coverImage, categoryId, createdAt

### Favorites
- id, userId, bookId, createdAt
- Unique constraint on (userId, bookId)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Books
- `GET /books` - Get books (paginated, searchable)
- `GET /books/:id` - Get book details
- `POST /books` - Create book (Admin only)
- `PUT /books/:id` - Update book (Admin only)
- `DELETE /books/:id` - Delete book (Admin only)

### Categories
- `GET /categories` - Get all categories
- `GET /categories/tree` - Get category tree
- `POST /categories` - Create category (Admin only)
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Favorites
- `GET /favorites` - Get user's favorites
- `POST /favorites/:bookId` - Add favorite
- `DELETE /favorites/:bookId` - Remove favorite

### Reports
- `GET /reports/dashboard` - Get admin reports

## File Upload

Book cover images are stored in `backend/uploads/` directory. This directory is:
- Created automatically by multer
- Served as static files at `/uploads`
- Limited to 5MB per image
- Accepts: JPEG, PNG, GIF, WebP

## Production Deployment

### Build Backend
```bash
cd backend
npm run build
npm start
```

### Build Frontend
```bash
cd frontend
npm run build
# Serve dist/ folder with nginx or other static server
```

### Environment Variables
Set production environment variables:
- `DATABASE_URL`: Production PostgreSQL URL
- `JWT_SECRET`: Strong random secret
- `NODE_ENV`: "production"
- `FRONTEND_URL`: Production frontend URL

### Using Docker
```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Backend on port 5000
- Frontend on port 5173

## Security Considerations

1. **Passwords**: All user passwords are hashed with bcryptjs (salt rounds: 10)
2. **Authentication**: JWT tokens valid for 7 days
3. **Authorization**: Role-based access control (Admin/User)
4. **CORS**: Enabled only for frontend URL
5. **Input Validation**: Zod schemas on frontend and server
6. **SQL Injection**: Protected by Prisma ORM

## Performance Optimization

- Server-side pagination (20 items per page)
- Debounced search (300ms)
- Image lazy loading
- Optimized database queries with Prisma
- React code splitting with Vite
- Tailwind CSS optimization

## Support & Documentation

- Backend API: `http://localhost:5000/health` (health check)
- Prisma Studio: `npm run prisma:studio`
- Frontend: http://localhost:5173

## License

MIT
