# Docker Deployment Guide

## Quick Start with Docker Compose

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Start the Application

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database on `localhost:5432`
- Backend API on `localhost:5000`
- Frontend on `localhost:5173`

### Stop the Application

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
```

The `-v` flag removes volumes (database data).

## Production Deployment on Cloud

### Option 1: AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t3.medium or larger
   - Security group: Allow ports 80, 443

2. **Install Docker**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

3. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd Project
   ```

4. **Update Environment Variables**
   ```bash
   # Update docker-compose.yml with production values
   # Set proper DATABASE_URL, JWT_SECRET, etc.
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d yourdomain.com
   ```

6. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL Add-on**
   ```bash
   heroku addons:create heroku-postgresql:standard-0
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Push Code to GitHub**
2. **Connect to DigitalOcean**
   - Go to DigitalOcean App Platform
   - Select GitHub repository
   - Set build command: `npm install`
   - Set run command: `npm start` (for backend)

3. **Add PostgreSQL Database**
4. **Set Environment Variables**
5. **Deploy**

### Option 4: Self-Hosted (VPS)

1. **SSH into Server**
   ```bash
   ssh root@your_server_ip
   ```

2. **Install Docker and Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clone Repository**
   ```bash
   git clone <your-repo>
   cd Project
   ```

4. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   ```

   Create `/etc/nginx/sites-available/bookstore`:
   ```nginx
   upstream backend {
     server backend:5000;
   }

   upstream frontend {
     server frontend:5173;
   }

   server {
     listen 80;
     server_name yourdomain.com;

     location /api/ {
       proxy_pass http://backend/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }

     location / {
       proxy_pass http://frontend/;
       proxy_set_header Host $host;
     }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/bookstore /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Start Application**
   ```bash
   docker-compose up -d
   ```

6. **Setup SSL**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Environment Variables for Production

### Backend
```env
DATABASE_URL="postgresql://user:password@db-host:5432/books_db"
JWT_SECRET="generate-strong-random-key-here"
NODE_ENV="production"
PORT="5000"
FRONTEND_URL="https://yourdomain.com"
```

### Frontend
```env
VITE_API_URL="https://yourdomain.com/api"
```

## Database Backups

### Automated Daily Backups (Docker)

Create `backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups/bookstore"
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

mkdir -p $BACKUP_DIR

docker exec books_db pg_dump -U postgres books_db > $BACKUP_FILE

# Keep last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Add to crontab:
```bash
crontab -e
0 2 * * * /path/to/backup.sh
```

## Monitoring

### Check Container Status
```bash
docker ps
docker stats
```

### View Container Logs
```bash
docker logs -f books_backend
docker logs -f books_frontend
```

### Container Health Checks
```bash
docker exec books_backend wget -q -O- http://localhost:5000/health
```

## Scaling

### Load Balancing (nginx)
```nginx
upstream backend {
  server backend1:5000 weight=1;
  server backend2:5000 weight=1;
  server backend3:5000 weight=1;
}
```

### Database Connection Pooling
Use PgBouncer with Docker:
```yaml
pgbouncer:
  image: pgbouncer/pgbouncer
  environment:
    DATABASES_HOST: postgres
    POOL_MODE: transaction
    MAX_CLIENT_CONN: 1000
  ports:
    - "6432:6432"
```

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Use secrets management (AWS Secrets Manager, etc.)
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up log aggregation

## Monitoring & Logging

### Setup ELK Stack (Optional)

1. **Elasticsearch**
   ```yaml
   elasticsearch:
     image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
     environment:
       discovery.type: single-node
   ```

2. **Logstash** - Collect logs from containers

3. **Kibana** - Visualize logs

### Application Monitoring
- New Relic, DataDog, or Sentry
- Set up alerts for errors
- Monitor performance metrics

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build and Push
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: yourname/bookstore:latest
```

## Troubleshooting

### Container Won't Start
```bash
docker logs <container-id>
docker inspect <container-id>
```

### Database Connection Failed
```bash
docker exec postgres pg_isready
docker logs postgres
```

### Out of Memory
```bash
docker stats
# Increase memory in docker-compose.yml
```

### Permission Denied
```bash
sudo usermod -aG docker $USER
newgrp docker
```
