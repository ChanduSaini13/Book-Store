# Testing Guide & Troubleshooting

## Unit Testing Setup

### Backend Testing

1. **Install Testing Dependencies**
```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

2. **Jest Configuration** - Create `jest.config.js`:
```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
};
```

3. **Sample Test** - `src/__tests__/auth.test.ts`:
```typescript
import request from 'supertest';
import app from '../index';

describe('Auth API', () => {
  test('POST /auth/register - should register user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('POST /auth/login - should login user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

### Frontend Testing

1. **Install Testing Dependencies**
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @vitest/ui
```

2. **Vitest Configuration** - Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

3. **Sample Component Test** - `src/__tests__/Button.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../components/common/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('button click handler works', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Manual Testing Checklist

### User Flows

- [ ] **Registration**
  - Register with valid data
  - Register with existing email (should fail)
  - Register with weak password (should fail)
  - Register with mismatched passwords (should fail)

- [ ] **Login**
  - Login with correct credentials
  - Login with wrong password
  - Login with non-existent email
  - Remember me functionality

- [ ] **Book Browsing**
  - View book list with pagination
  - Search by title
  - Search by author
  - Filter by category
  - Sort by different options (newest, oldest, A-Z, Z-A)
  - Navigate between pages

- [ ] **Book Details**
  - View book details page
  - See correct category breadcrumb
  - View book cover image
  - See full description

- [ ] **Favorites**
  - Add book to favorites (as logged-in user)
  - Remove book from favorites
  - View favorites list
  - Pagination on favorites page
  - Redirect to login if not authenticated

### Admin Flows

- [ ] **Admin Login**
  - Admin can login with admin credentials
  - Admin directed to admin dashboard

- [ ] **Books Management**
  - Create book with all required fields
  - Upload cover image
  - Edit existing book
  - Delete book
  - Book appears in user list

- [ ] **Category Management**
  - Create root category (level 1)
  - Create subcategory (level 2)
  - Create leaf category (level 3)
  - Cannot create level 4 category
  - Edit category
  - Delete category
  - View category tree structure

- [ ] **Reports**
  - View dashboard statistics
  - See monthly favorites chart
  - View top categories bar chart
  - See top favorited books list
  - View recently added books

### Edge Cases

- [ ] **Authentication**
  - Logout user
  - Expired token handling
  - Unauthorized access to protected routes
  - Role-based access control

- [ ] **Error Handling**
  - Network error handling
  - Invalid API responses
  - Server errors (500)
  - Not found errors (404)
  - Validation errors display

- [ ] **Performance**
  - Large image uploads
  - Many books in search results
  - Deep category hierarchies
  - Rapid page navigation

- [ ] **Responsive Design**
  - Desktop (1920px)
  - Tablet (768px)
  - Mobile (375px)
  - Mobile menu navigation
  - Touch interactions

## Load Testing

### Using Apache Bench

```bash
# Test homepage
ab -n 100 -c 10 http://localhost:5173/

# Test API
ab -n 100 -c 10 -H "Authorization: Bearer <token>" http://localhost:5000/books
```

### Using k6 Script

Create `load-test.js`:
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 100 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  let response = http.get('http://localhost:5000/books');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

Run:
```bash
k6 run load-test.js
```

## Security Testing

### OWASP Top 10 Checklist

- [ ] **SQL Injection** - Prisma ORM prevents this
- [ ] **Authentication** - JWT tokens properly validated
- [ ] **Sensitive Data** - Passwords hashed with bcrypt
- [ ] **XML External Entity** - Not applicable (JSON API)
- [ ] **Broken Access Control** - Admin middleware enforces roles
- [ ] **Security Misconfiguration** - Environment variables used
- [ ] **XSS Prevention** - React sanitizes output
- [ ] **Insecure Deserialization** - Not applicable
- [ ] **Using Components with Known Vulns** - Regular npm audit
- [ ] **Insufficient Logging** - Server logs errors

### Run Security Audit

```bash
# Frontend
cd frontend
npm audit

# Backend
cd backend
npm audit
```

Fix vulnerabilities:
```bash
npm audit fix
npm audit fix --force (if needed)
```

## Performance Testing

### Lighthouse Report (Frontend)

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

### Backend Performance

```bash
# Time API response
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/books

# Monitor server resources
docker stats books_backend
```

## Database Testing

### Prisma Studio

```bash
cd backend
npm run prisma:studio
```

Provides GUI to:
- View all records
- Create test data
- Edit records
- Delete test data

### Database Queries

```bash
# Connect to DB
psql -U postgres -d books_db

# Check tables
\dt

# Count records
SELECT COUNT(*) FROM books;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM favorites;
```

## API Testing with Postman

### Setup Postman

1. Download and install Postman
2. Create new collection: "BookStore API"

### Create Requests

**Auth Endpoints**
```
POST http://localhost:5000/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

POST http://localhost:5000/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Books Endpoints**
```
GET http://localhost:5000/books?page=1&limit=20&search=gatsby

GET http://localhost:5000/books/{{bookId}}

POST http://localhost:5000/books
(Admin only, multipart form-data)

PUT http://localhost:5000/books/{{bookId}}
(Admin only)

DELETE http://localhost:5000/books/{{bookId}}
(Admin only)
```

**Favorites Endpoints**
```
GET http://localhost:5000/favorites

POST http://localhost:5000/favorites/{{bookId}}

DELETE http://localhost:5000/favorites/{{bookId}}
```

## Common Issues & Solutions

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Backend
npm install
npm run prisma:generate

# Frontend
npm install
npm run type-check
```

### Issue: Database connection refused

**Solution:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start if stopped
sudo systemctl start postgresql

# Verify connection
psql -U postgres -d books_db
```

### Issue: JWT authentication failing

**Solution:**
- Check JWT_SECRET is set in .env
- Verify Authorization header format: `Bearer <token>`
- Check token hasn't expired
- Test with Postman first

### Issue: CORS errors

**Solution:**
- Verify FRONTEND_URL in backend .env
- Check VITE_API_URL in frontend .env
- Ensure ports are correct

### Issue: Images not uploading

**Solution:**
```bash
# Check uploads directory exists and has permissions
ls -la backend/uploads/

# Set correct permissions
chmod 755 backend/uploads/
```

### Issue: Pagination not working

**Solution:**
- Ensure limit parameter is between 1-100
- Check page parameter is >= 1
- Verify totalPages calculation

### Issue: Category hierarchy broken

**Solution:**
- Cannot exceed 3 levels
- Parent must exist before creating child
- Check parentId references valid category

### Issue: Hot reload not working

**Solution:**
```bash
# Frontend - Vite should auto-reload
# If not, try:
npm run dev

# Backend - tsx should watch files
npm run dev
```

## Browser DevTools

### Console Errors
- Check for unhandled promise rejections
- Look for missing imports
- Verify API URLs

### Network Tab
- Monitor API calls
- Check response status codes
- Verify request headers
- Look for failed requests

### React DevTools
- Inspect component state
- Check prop values
- Monitor renders

### Redux DevTools (if using Redux)
- Track state changes
- Time travel debugging

## Production Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database backed up
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Disaster recovery plan
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Documentation updated

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: books_db_test

    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Backend
        run: cd backend && npm install
      
      - name: Test Backend
        run: cd backend && npm test
      
      - name: Install Frontend
        run: cd frontend && npm install
      
      - name: Test Frontend
        run: cd frontend && npm test
      
      - name: Build Frontend
        run: cd frontend && npm run build
```

## Performance Metrics

Target metrics:
- API response time: < 200ms (p95)
- Page load time: < 3s
- Core Web Vitals:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

## Support

For issues not covered here:
1. Check server logs: `docker logs -f books_backend`
2. Check browser console: F12 > Console
3. Check network requests: F12 > Network
4. Use Postman to test APIs directly
5. Check database: `npm run prisma:studio`
