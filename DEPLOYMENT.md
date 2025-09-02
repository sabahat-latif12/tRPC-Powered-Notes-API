# Deployment Guide

This guide covers deploying your tRPC Notes API to various platforms.

## 🚀 Prerequisites

- Node.js 18+ installed
- Database (Supabase Postgres) configured
- Environment variables set up
- Code committed to version control

## 📋 Pre-deployment Checklist

- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Prisma client generated
- [ ] Build successful (`npm run build`)
- [ ] Security headers configured
- [ ] CORS settings appropriate for production

## 🌐 Platform-Specific Deployment

### 1. Railway

Railway is a modern platform for deploying full-stack applications.

#### Setup
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`

#### Deploy
```bash
# Deploy to Railway
railway up

# Set environment variables
railway variables set DATABASE_URL="your_database_url"
railway variables set NODE_ENV="production"
railway variables set PORT="3000"
```

#### Configuration
Create `railway.json`:
```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Render

Render provides free hosting for web services.

#### Setup
1. Connect your GitHub repository
2. Create a new Web Service
3. Configure build and start commands

#### Build Command
```bash
npm install && npm run build
```

#### Start Command
```bash
npm start
```

#### Environment Variables
- `DATABASE_URL`: Your Supabase Postgres connection string
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render's default)

### 3. Heroku

Heroku is a popular platform for deploying Node.js applications.

#### Setup
1. Install Heroku CLI: `brew install heroku/brew/heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`

#### Deploy
```bash
# Add Heroku Postgres (optional)
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL="your_database_url"

# Deploy
git push heroku main
```

#### Configuration
Create `Procfile`:
```
web: npm start
```

### 4. DigitalOcean App Platform

DigitalOcean's App Platform provides managed hosting.

#### Setup
1. Connect your GitHub repository
2. Choose Node.js as the environment
3. Configure build and run commands

#### Build Command
```bash
npm install && npm run build
```

#### Run Command
```bash
npm start
```

### 5. Vercel

Vercel is excellent for serverless deployments.

#### Setup
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`

#### Configuration
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

## 🗄️ Database Deployment

### Supabase Setup

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for setup to complete

2. **Get Connection String**
   - Go to Settings → Database
   - Copy the connection string
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

3. **Deploy Schema**
   ```bash
   # Update .env with production DATABASE_URL
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

4. **Seed Data (Optional)**
   ```bash
   npm run db:seed
   ```

### Environment Variables

```env
# Production
NODE_ENV=production
PORT=3000
DATABASE_URL=your_supabase_postgres_url

# Optional: Supabase specific
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform-specific secret management
   - Rotate database credentials regularly

2. **CORS Configuration**
   ```typescript
   // Update CORS settings for production
   app.use(cors({
     origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
     credentials: true
   }));
   ```

3. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use(limiter);
   ```

4. **HTTPS Only**
   - Redirect HTTP to HTTPS
   - Use HSTS headers
   - Configure SSL certificates

## 📊 Monitoring & Logging

### Health Checks

Your API already includes a health check endpoint:
```bash
curl https://yourdomain.com/health
```

### Logging

Consider adding structured logging:
```bash
npm install winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Performance Monitoring

- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure and application monitoring
- **Sentry**: Error tracking and performance monitoring

## 🚀 CI/CD Pipeline

### GitHub Actions Example

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
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Railway
      run: |
        npm install -g @railway/cli
        railway login --ci
        railway up
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check firewall settings
   - Ensure database is accessible from deployment platform

3. **Port Issues**
   - Some platforms require specific ports
   - Use `process.env.PORT || 3000`

4. **Memory Issues**
   - Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=2048"`

### Debug Commands

```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
npx prisma db pull

# Check build output
ls -la dist/

# View logs
npm run dev
```

## 📈 Scaling Considerations

### Horizontal Scaling

- Use load balancers
- Implement session management
- Consider database connection pooling

### Vertical Scaling

- Increase memory allocation
- Optimize Node.js settings
- Use PM2 for process management

### Database Scaling

- Implement read replicas
- Use connection pooling
- Consider database sharding for large datasets

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** and alerting
2. **Configure backups** for your database
3. **Set up staging environment** for testing
4. **Implement CI/CD** pipeline
5. **Add performance monitoring**
6. **Set up error tracking**

## 📚 Additional Resources

- [tRPC Deployment Guide](https://trpc.io/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)

---

Happy deploying! 🚀 