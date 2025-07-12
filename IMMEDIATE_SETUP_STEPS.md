# 🚀 IMMEDIATE SETUP STEPS - Get Your Skill Swap Platform Running NOW!

## Step 1: Verify Node.js Installation

### Option A: Check if Node.js is working
1. **Open a NEW Command Prompt or PowerShell window** (important - restart after installing Node.js)
2. Type: `node --version`
3. Type: `npm --version`

If both commands show version numbers, **skip to Step 2**.

### Option B: If Node.js commands don't work
1. **Restart your computer** (this often fixes PATH issues)
2. **Open a NEW Command Prompt as Administrator**
3. Try `node --version` again

### Option C: If still not working, reinstall Node.js
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended)
3. **Run the installer as Administrator**
4. **Check "Add to PATH" option** during installation
5. **Restart your computer**
6. Open new Command Prompt and try `node --version`

## Step 2: Install Project Dependencies

Once Node.js is working, run these commands in your project folder:

```bash
# Navigate to your project folder (if not already there)
cd "C:\Users\soura\OneDrive\Desktop\oddo"

# Install all dependencies
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- All other dependencies

## Step 3: Set Up Environment Variables

1. **Copy the environment template:**
   ```bash
   copy .env.local.example .env.local
   ```

2. **Edit the .env.local file** with your Supabase credentials (we'll set this up next)

## Step 4: Set Up Supabase Database

### Create Supabase Account:
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a **free account**
3. Click **"New Project"**
4. Choose a name: `skill-swap-platform`
5. Set a database password (save this!)
6. Wait for project creation (2-3 minutes)

### Set Up Database Schema:
1. In your Supabase dashboard, go to **"SQL Editor"**
2. Open the file `database/schema.sql` from your project
3. **Copy ALL the SQL code**
4. **Paste it in the Supabase SQL Editor**
5. Click **"Run"** to create all tables

### Add Sample Data (Optional):
1. Open the file `database/sample-data.sql`
2. **Copy the SQL code**
3. **Paste and run it** in Supabase SQL Editor
4. This adds sample skills to get started

### Get Your API Keys:
1. In Supabase, go to **Settings > API**
2. Copy these values:
   - **Project URL**
   - **anon public key**
   - **service_role key** (keep this secret!)

## Step 5: Configure Environment Variables

Edit your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 6: Start the Development Server

```bash
npm run dev
```

## Step 7: Open Your Browser

Go to: [http://localhost:3000](http://localhost:3000)

You should see your Skill Swap Platform homepage!

## 🎉 What You'll See

### Homepage Features:
- Clean, modern landing page
- "Get Started" and "Browse Skills" buttons
- Professional design with your SkillSwap branding

### User Features Available:
1. **Register/Login** - Create your account
2. **Profile Setup** - Add your info, location, bio
3. **Skill Management** - Add skills you can teach and want to learn
4. **Browse Users** - Find people with skills you want
5. **Swap Requests** - Request skill exchanges
6. **Rating System** - Rate completed swaps

### Admin Features:
1. **Admin Dashboard** - Platform statistics
2. **User Management** - Monitor platform activity
3. **Data Export** - Download reports

## 🔧 Troubleshooting

### If npm install fails:
```bash
# Clear cache and try again
npm cache clean --force
npm install
```

### If you get permission errors:
```bash
# Run as Administrator
# Right-click Command Prompt > "Run as Administrator"
```

### If the development server won't start:
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill any process using port 3000
taskkill /PID <process_id> /F

# Try starting again
npm run dev
```

### If Supabase connection fails:
1. Double-check your environment variables
2. Make sure you copied the correct URLs and keys
3. Verify the database schema was created successfully

## 🎯 Next Steps After Setup

1. **Create your first user account**
2. **Set up your profile**
3. **Add some skills you can teach**
4. **Add skills you want to learn**
5. **Browse other users** (use sample data if available)
6. **Test the swap request system**

## 🚀 Ready for Production?

When you're ready to deploy:
1. Follow the **DEPLOYMENT_GUIDE.md**
2. Choose a hosting platform (Vercel recommended)
3. Set up production Supabase project
4. Deploy your app!

## 🆘 Need Help?

If you encounter any issues:
1. Check the **SETUP_GUIDE.md** for detailed instructions
2. Review the **TESTING_GUIDE.md** for troubleshooting
3. Make sure Node.js is properly installed and in your PATH
4. Verify all environment variables are set correctly

## 🎉 Congratulations!

Once everything is running, you'll have a **complete, professional Skill Swap Platform** ready to help users connect and exchange skills!

**Your platform includes:**
✅ User authentication and profiles
✅ Skill management system
✅ Browse and discovery features
✅ Swap request workflow
✅ Rating and feedback system
✅ Admin dashboard
✅ Modern, responsive design
✅ Mobile-friendly interface

**Happy skill swapping! 🎓✨**
