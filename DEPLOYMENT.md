# Deployment Guide

This guide covers multiple deployment options for Grant Tracker 2.0, from simple cloud deployments to full containerized production setups.

## Table of Contents

1. [Quick Deploy (Vercel)](#quick-deploy-vercel)
2. [Docker Deployment](#docker-deployment)
3. [Manual Server Deployment](#manual-server-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Quick Deploy (Vercel)

The fastest way to deploy Grant Tracker 2.0 is using Vercel:

### Prerequisites

- Vercel account
- GitHub repository
- PostgreSQL database (Supabase, PlanetScale, or Neon recommended)
- Clerk account for authentication
- UploadThing account for file uploads

### Steps

1. **Fork/Clone the repository**

   ```bash
   git clone https://github.com/your-username/grant-tracker-2.0.git
   cd grant-tracker-2.0
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:

   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   UPLOADTHING_SECRET=sk_live_...
   UPLOADTHING_APP_ID=your_app_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be available at `https://your-app.vercel.app`

### Vercel Configuration

The included [`vercel.json`](vercel.json) file provides:

- Build optimization
- Function timeout configuration
- CORS headers
- Environment variable mapping

## Docker Deployment

For full control and scalability, use Docker deployment:

### Prerequisites

- Docker and Docker Compose installed
- Domain name (optional but recommended)
- SSL certificates (Let's Encrypt recommended)

### Quick Start

1. **Clone and configure**

   ```bash
   git clone https://github.com/your-username/grant-tracker-2.0.git
   cd grant-tracker-2.0
   cp .env.production .env.local
   # Edit .env.local with your values
   ```

2. **Build and run**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Initialize database**
   ```bash
   docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
   docker-compose -f docker-compose.prod.yml exec app npx prisma db seed
   ```

### Production Docker Setup

The production setup includes:

- **Next.js Application**: Main application server
- **PostgreSQL**: Primary database
- **Redis**: Caching layer (optional)
- **Nginx**: Reverse proxy with SSL termination

#### Services Overview

```yaml
# docker-compose.prod.yml includes:
- app: Next.js application (port 3000)
- postgres: PostgreSQL database (port 5432)
- redis: Redis cache (port 6379)
- nginx: Reverse proxy (ports 80/443)
```

#### Scaling

Scale the application horizontally:

```bash
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

## Manual Server Deployment

For deployment on your own server (Ubuntu/Debian):

### Prerequisites

- Ubuntu 20.04+ or Debian 11+
- Node.js 18+
- PostgreSQL 13+
- Nginx
- PM2 (process manager)

### Installation Steps

1. **Server Setup**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y

   # Install Nginx
   sudo apt install nginx -y

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Database Setup**

   ```bash
   sudo -u postgres psql
   CREATE DATABASE grant_tracker_prod;
   CREATE USER grant_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE grant_tracker_prod TO grant_user;
   \q
   ```

3. **Application Deployment**

   ```bash
   # Clone repository
   git clone https://github.com/your-username/grant-tracker-2.0.git
   cd grant-tracker-2.0

   # Install dependencies
   npm ci --only=production

   # Configure environment
   cp .env.production .env.local
   # Edit .env.local with your values

   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate deploy

   # Seed database
   npx prisma db seed

   # Build application
   npm run build

   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/grant-tracker
   sudo ln -s /etc/nginx/sites-available/grant-tracker /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Environment Configuration

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# File Upload
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
```

### Optional Variables

```bash
# Caching
REDIS_URL="redis://localhost:6379"

# Monitoring
SENTRY_DSN="https://..."
NEXT_PUBLIC_ANALYTICS_ID="..."

# Email
SMTP_HOST="smtp.provider.com"
SMTP_USER="user@domain.com"
SMTP_PASSWORD="password"
```

### Security Best Practices

1. **Use strong passwords** for all services
2. **Enable SSL/TLS** for all connections
3. **Restrict database access** to application only
4. **Use environment variables** for all secrets
5. **Enable firewall** and close unnecessary ports
6. **Regular security updates** for all components

## Database Setup

### PostgreSQL Configuration

1. **Production Settings**

   ```sql
   -- /etc/postgresql/13/main/postgresql.conf
   shared_preload_libraries = 'pg_stat_statements'
   max_connections = 100
   shared_buffers = 256MB
   effective_cache_size = 1GB
   work_mem = 4MB
   maintenance_work_mem = 64MB
   ```

2. **Security Settings**

   ```sql
   -- /etc/postgresql/13/main/pg_hba.conf
   local   all             all                                     peer
   host    all             all             127.0.0.1/32            md5
   host    all             all             ::1/128                 md5
   ```

3. **Backup Strategy**

   ```bash
   # Daily backup script
   #!/bin/bash
   pg_dump -h localhost -U grant_user grant_tracker_prod | gzip > backup_$(date +%Y%m%d).sql.gz

   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

### Migrations

```bash
# Production migration
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (DANGER - only for development)
npx prisma migrate reset
```

## SSL/TLS Configuration

### Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Setup

1. **Generate certificates**

   ```bash
   mkdir ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout ssl/key.pem -out ssl/cert.pem
   ```

2. **Configure Nginx**
   ```nginx
   ssl_certificate /etc/nginx/ssl/cert.pem;
   ssl_certificate_key /etc/nginx/ssl/key.pem;
   ```

## Monitoring and Maintenance

### Health Checks

The application includes health check endpoints:

- `/api/health` - Application health
- `/api/db-health` - Database connectivity
- `/health` - Nginx health check

### Logging

```bash
# Application logs (PM2)
pm2 logs grant-tracker

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

### Performance Monitoring

1. **Application Metrics**
   - Response times
   - Error rates
   - Memory usage
   - CPU utilization

2. **Database Metrics**
   - Query performance
   - Connection count
   - Cache hit ratio
   - Disk usage

3. **Infrastructure Metrics**
   - Server resources
   - Network latency
   - Disk I/O
   - Load balancer health

### Backup and Recovery

1. **Database Backups**

   ```bash
   # Full backup
   pg_dump -h localhost -U grant_user grant_tracker_prod > backup.sql

   # Restore
   psql -h localhost -U grant_user grant_tracker_prod < backup.sql
   ```

2. **File Backups**

   ```bash
   # Application files
   tar -czf app-backup.tar.gz /path/to/grant-tracker-2.0

   # Uploaded files (if stored locally)
   tar -czf uploads-backup.tar.gz /path/to/uploads
   ```

3. **Automated Backups**

   ```bash
   #!/bin/bash
   # backup-script.sh
   DATE=$(date +%Y%m%d_%H%M%S)

   # Database backup
   pg_dump -h localhost -U grant_user grant_tracker_prod | gzip > "db_backup_$DATE.sql.gz"

   # Upload to S3 (optional)
   aws s3 cp "db_backup_$DATE.sql.gz" s3://your-backup-bucket/

   # Clean old backups (keep 30 days)
   find . -name "db_backup_*.sql.gz" -mtime +30 -delete
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build

   # Check Node.js version
   node --version  # Should be 18+
   ```

2. **Database Connection Issues**

   ```bash
   # Test connection
   psql $DATABASE_URL

   # Check PostgreSQL status
   sudo systemctl status postgresql

   # Check logs
   sudo tail -f /var/log/postgresql/postgresql-13-main.log
   ```

3. **SSL Certificate Issues**

   ```bash
   # Check certificate validity
   openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout

   # Test SSL configuration
   sudo nginx -t

   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

4. **Performance Issues**

   ```bash
   # Check system resources
   htop
   df -h
   free -m

   # Check application logs
   pm2 logs grant-tracker

   # Database performance
   sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
   ```

### Debug Mode

Enable debug logging:

```bash
# .env.local
NODE_ENV=production
DEBUG=true
LOG_LEVEL=debug
```

### Support

For deployment issues:

1. Check the [GitHub Issues](https://github.com/your-username/grant-tracker-2.0/issues)
2. Review application logs
3. Verify environment configuration
4. Test database connectivity
5. Check SSL certificate validity

## Security Checklist

- [ ] SSL/TLS enabled and configured
- [ ] Database access restricted
- [ ] Strong passwords for all services
- [ ] Firewall configured
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled

## Performance Optimization

1. **Database Optimization**
   - Index frequently queried columns
   - Use connection pooling
   - Regular VACUUM and ANALYZE
   - Monitor slow queries

2. **Application Optimization**
   - Enable Redis caching
   - Optimize images and assets
   - Use CDN for static files
   - Enable gzip compression

3. **Infrastructure Optimization**
   - Use load balancer for multiple instances
   - Configure proper resource limits
   - Monitor and scale based on metrics
   - Use SSD storage for database

This deployment guide provides comprehensive instructions for deploying Grant Tracker 2.0 in various environments, from simple cloud deployments to full production setups with monitoring and security best practices.
