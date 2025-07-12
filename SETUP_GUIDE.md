# Skill Swap Platform - Complete Setup Guide

This guide will walk you through setting up the complete Skill Swap Platform from scratch.

## Prerequisites

### 1. Install Node.js

**For Windows:**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Verify installation by opening Command Prompt and running:
   ```bash
   node --version
   npm --version
   ```

**For macOS:**
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

**For Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Git (if not already installed)
- Windows: Download from [git-scm.com](https://git-scm.com/)
- macOS: `brew install git` or use Xcode Command Line Tools
- Linux: `sudo apt-get install git`

## Project Setup

### Step 1: Clone or Download the Project
If you have the project files, navigate to the project directory. If not, you can create the project structure as provided.

### Step 2: Install Dependencies
Open terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- And all other required packages

### Step 3: Set Up Supabase Database

1. **Create Supabase Account:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Configure Database:**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy the contents of `database/schema.sql`
   - Paste and run the SQL to create all tables and policies

3. **Add Sample Data (Optional):**
   - Copy the contents of `database/sample-data.sql`
   - Run this SQL to add sample skills to the database

4. **Get API Keys:**
   - Go to Settings > API in your Supabase dashboard
   - Copy your Project URL and anon public key

### Step 4: Environment Configuration

1. **Create Environment File:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Update Environment Variables:**
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 5: Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Features Overview

### ✅ Completed Features

1. **User Authentication**
   - Registration and login
   - Protected routes
   - Role-based access (User/Admin)

2. **Profile Management**
   - Personal information
   - Privacy settings (public/private)
   - Availability settings

3. **Skill Management**
   - Add skills you can teach
   - Add skills you want to learn
   - Proficiency levels and priorities

4. **Browse & Discovery**
   - Search users by skills
   - Filter by categories
   - View public profiles

5. **Swap Request System**
   - Send skill swap requests
   - Accept/reject requests
   - Track request status

6. **Rating & Feedback**
   - Rate completed swaps
   - Leave feedback
   - View ratings received

7. **Admin Dashboard**
   - Platform statistics
   - User management
   - Data export tools

## Testing the Application

### 1. Create Test Accounts
1. Register as a regular user
2. Complete your profile
3. Add some skills you can teach and want to learn

### 2. Create Admin Account
1. Register a user account
2. In Supabase, go to Table Editor > profiles
3. Find your user and change the `role` from 'user' to 'admin'
4. Refresh the app to see admin features

### 3. Test Core Features
1. Browse other users' skills
2. Send a skill swap request
3. Accept/reject requests
4. Complete a swap and leave ratings

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables

### Option 3: Traditional Hosting
1. Build the project: `npm run build`
2. Upload the build files to your hosting provider
3. Configure environment variables on your server

## Troubleshooting

### Common Issues

1. **Node.js not found:**
   - Ensure Node.js is properly installed
   - Restart your terminal/command prompt
   - Check PATH environment variable

2. **Supabase connection errors:**
   - Verify your environment variables
   - Check Supabase project URL and keys
   - Ensure database schema is properly set up

3. **Build errors:**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Next.js cache: `rm -rf .next`
   - Check for TypeScript errors: `npm run type-check`

4. **Database errors:**
   - Verify RLS policies are enabled
   - Check table permissions
   - Ensure sample data is loaded correctly

### Getting Help

1. Check the browser console for error messages
2. Review the terminal output for build errors
3. Verify all environment variables are set correctly
4. Ensure Supabase database is properly configured

## Next Steps

After setup, you can:
1. Customize the design and branding
2. Add more skill categories
3. Implement additional features
4. Set up monitoring and analytics
5. Configure email notifications
6. Add more admin tools

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Regularly update dependencies
- Monitor Supabase usage and security

## Support

For additional support:
- Check the README.md for detailed feature documentation
- Review the code comments for implementation details
- Consult Next.js and Supabase documentation for advanced configurations
