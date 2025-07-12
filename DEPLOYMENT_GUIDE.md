# Deployment Guide - Skill Swap Platform

This guide covers deploying the Skill Swap Platform to various hosting providers.

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all environment variables are properly configured:
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Database Setup
- Ensure your production Supabase database is configured
- Run the schema from `database/schema.sql`
- Optionally add sample data from `database/sample-data.sql`
- Verify RLS policies are enabled and working

### 3. Build Test
Test the production build locally:
```bash
npm run build
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest option for Next.js applications.

#### Steps:
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add all variables from your `.env.local`

4. **Deploy:**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app.vercel.app`

#### Custom Domain:
- Go to Settings > Domains in Vercel
- Add your custom domain
- Configure DNS records as instructed

### Option 2: Netlify

#### Steps:
1. **Build the project:**
   ```bash
   npm run build
   npm run export  # If using static export
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `out` folder (or connect GitHub)
   - Configure environment variables in Site Settings

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next` (or `out` for static export)

### Option 3: Railway

#### Steps:
1. **Connect GitHub:**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Environment:**
   - Add environment variables in Railway dashboard
   - Railway will auto-detect Next.js and configure build settings

3. **Deploy:**
   - Railway will automatically build and deploy
   - Custom domain available in Pro plan

### Option 4: DigitalOcean App Platform

#### Steps:
1. **Create App:**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository

2. **Configure Build:**
   - Build command: `npm run build`
   - Run command: `npm start`
   - Environment variables: Add all required variables

3. **Deploy:**
   - DigitalOcean will build and deploy automatically

### Option 5: Traditional VPS/Server

#### Requirements:
- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)
- SSL certificate

#### Steps:
1. **Server Setup:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt update
   sudo apt install nginx
   ```

2. **Deploy Application:**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd skill-swap-platform
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "skill-swap" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL Certificate:**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get certificate
   sudo certbot --nginx -d your-domain.com
   ```

## Environment-Specific Configurations

### Production Environment Variables
```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### Staging Environment
```env
# Supabase (Staging)
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
NODE_ENV=production
```

## Post-Deployment Steps

### 1. Verify Functionality
- [ ] User registration and login
- [ ] Profile creation and editing
- [ ] Skill management
- [ ] Browse functionality
- [ ] Swap requests
- [ ] Rating system
- [ ] Admin dashboard (if applicable)

### 2. Performance Optimization
- Enable gzip compression
- Configure CDN (Cloudflare recommended)
- Set up monitoring (Vercel Analytics, Google Analytics)
- Configure error tracking (Sentry)

### 3. Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database RLS policies active
- [ ] Rate limiting configured
- [ ] CORS properly configured

### 4. Monitoring
- Set up uptime monitoring
- Configure error alerts
- Monitor database usage
- Track user analytics

## Troubleshooting

### Common Deployment Issues

1. **Build Failures:**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Environment Variable Issues:**
   - Ensure all variables are set in deployment platform
   - Check variable names match exactly
   - Verify Supabase URLs and keys

3. **Database Connection Issues:**
   - Verify Supabase project is active
   - Check RLS policies
   - Ensure database schema is up to date

4. **Performance Issues:**
   - Enable compression
   - Optimize images
   - Use CDN for static assets
   - Monitor bundle size

### Rollback Strategy
1. Keep previous deployment available
2. Use feature flags for new features
3. Database migrations should be backward compatible
4. Monitor error rates after deployment

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor security vulnerabilities
- [ ] Backup database regularly
- [ ] Review and rotate API keys
- [ ] Monitor performance metrics
- [ ] Update documentation

### Scaling Considerations
- Database connection pooling
- Horizontal scaling with load balancers
- CDN for global distribution
- Caching strategies
- Background job processing

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review error logs
3. Verify environment configuration
4. Test locally with production build
5. Contact platform support if needed
