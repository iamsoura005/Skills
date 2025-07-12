# 🎯 FOLLOW THESE EXACT STEPS - Get Your Platform Running in 15 Minutes!

## ⚠️ IMPORTANT: Node.js Installation Issue Detected

Your Node.js installation needs to be fixed first. Follow these steps exactly:

## Step 1: Fix Node.js Installation

### Option A: Restart and Test (Try This First)
1. **Close ALL Command Prompt/PowerShell windows**
2. **Restart your computer** (this updates the PATH)
3. **Open a NEW Command Prompt as Administrator**
   - Press `Windows + X`
   - Click "Windows PowerShell (Admin)" or "Command Prompt (Admin)"
4. **Test Node.js:**
   ```bash
   node --version
   npm --version
   ```
   
If both show version numbers, **skip to Step 2**. If not, continue to Option B.

### Option B: Reinstall Node.js Properly
1. **Download Node.js:**
   - Go to [https://nodejs.org](https://nodejs.org)
   - Click the **LTS version** (left button - recommended)
   - Download the Windows Installer (.msi file)

2. **Install Node.js:**
   - **Right-click the downloaded file**
   - **Select "Run as administrator"**
   - **Follow the installer:**
     - Click "Next" through the setup
     - **IMPORTANT: Make sure "Add to PATH" is checked** ✅
     - Complete the installation

3. **Restart your computer** (this is crucial!)

4. **Test the installation:**
   - Open **Command Prompt as Administrator**
   - Type: `node --version` (should show v18.x.x or v20.x.x)
   - Type: `npm --version` (should show version number)

## Step 2: Install Project Dependencies

Once Node.js is working, run these commands:

```bash
# Navigate to your project folder
cd "C:\Users\soura\OneDrive\Desktop\oddo"

# Install all dependencies (this may take 2-3 minutes)
npm install
```

**Expected output:** You should see packages being downloaded and installed.

## Step 3: Set Up Environment File

```bash
# Copy the environment template
copy .env.local.example .env.local
```

## Step 4: Set Up Supabase Database (5 minutes)

### Create Your Supabase Project:
1. **Go to [https://supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub, Google, or email**
4. **Click "New Project"**
5. **Fill in:**
   - Organization: Create new or use existing
   - Name: `skill-swap-platform`
   - Database Password: Create a strong password (SAVE THIS!)
   - Region: Choose closest to you
6. **Click "Create new project"**
7. **Wait 2-3 minutes** for setup to complete

### Set Up Database Tables:
1. **In your Supabase dashboard, click "SQL Editor"**
2. **Open the file `database/schema.sql` from your project folder**
3. **Copy ALL the SQL code** (Ctrl+A, then Ctrl+C)
4. **Paste it in the Supabase SQL Editor**
5. **Click "Run"** (bottom right)
6. **You should see "Success. No rows returned"**

### Add Sample Skills (Optional but Recommended):
1. **Open the file `database/sample-data.sql`**
2. **Copy all the SQL code**
3. **Paste and run it in Supabase SQL Editor**
4. **This adds 20 sample skills to get started**

### Get Your API Keys:
1. **In Supabase, click "Settings" (gear icon) in the sidebar**
2. **Click "API"**
3. **Copy these values:**
   - **Project URL** (starts with https://...)
   - **anon public** key (long string starting with eyJ...)
   - **service_role** key (another long string - keep this secret!)

## Step 5: Configure Your Environment

1. **Open the `.env.local` file** in your project folder
2. **Replace the placeholder values** with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Save the file** (Ctrl+S)

## Step 6: Start Your Platform

```bash
# Start the development server
npm run dev
```

**Expected output:**
```
> skill-swap-platform@0.1.0 dev
> next dev

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

## Step 7: Open Your Platform

1. **Open your web browser**
2. **Go to: [http://localhost:3000](http://localhost:3000)**
3. **You should see your Skill Swap Platform homepage!**

## 🎉 What You'll See

### Homepage:
- **SkillSwap** logo and branding
- **"Learn New Skills by Teaching What You Know"** headline
- **"Start Swapping Skills"** and **"Browse Skills"** buttons
- **How It Works** section with 4 steps

### Available Features:
1. **Click "Get Started"** → Register your account
2. **Complete your profile** → Add personal info
3. **Manage your skills** → Add skills you can teach/want to learn
4. **Browse other users** → Find people to swap skills with
5. **Send swap requests** → Start exchanging skills
6. **Rate experiences** → Build your reputation

## 🔧 Troubleshooting

### If npm install fails:
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### If you get "EACCES" or permission errors:
```bash
# Run Command Prompt as Administrator
# Then try npm install again
```

### If port 3000 is already in use:
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace XXXX with the PID)
taskkill /PID XXXX /F

# Try npm run dev again
```

### If Supabase connection fails:
1. **Double-check your .env.local file**
2. **Make sure you copied the URLs and keys correctly**
3. **Verify there are no extra spaces or quotes**
4. **Restart the dev server** (Ctrl+C, then npm run dev)

## 🎯 Test Your Platform

### Create Your First Account:
1. **Click "Get Started"**
2. **Fill in the registration form**
3. **Complete your profile**
4. **Add some skills you can teach**
5. **Add skills you want to learn**

### Test the Features:
1. **Browse other users** (if you added sample data)
2. **Send a test swap request**
3. **Check the admin dashboard** (change your role to 'admin' in Supabase)

## 🚀 You're Done!

**Congratulations!** You now have a fully functional Skill Swap Platform with:

✅ **User authentication and profiles**
✅ **Skill management system**
✅ **Browse and discovery features**
✅ **Swap request workflow**
✅ **Rating and feedback system**
✅ **Admin dashboard**
✅ **Modern, responsive design**
✅ **Mobile-friendly interface**

## 📞 Need Help?

If you get stuck:
1. **Check the error messages** in the terminal
2. **Verify Node.js is properly installed** (`node --version`)
3. **Make sure all environment variables are set correctly**
4. **Restart the development server** if needed
5. **Check the browser console** for any errors (F12 → Console)

## 🎉 Next Steps

Once everything is working:
1. **Customize the design** and branding
2. **Add more skills** to the database
3. **Invite friends** to test the platform
4. **Deploy to production** using the DEPLOYMENT_GUIDE.md
5. **Launch your skill-sharing community!**

**Your Skill Swap Platform is ready to help people connect and learn! 🎓✨**
