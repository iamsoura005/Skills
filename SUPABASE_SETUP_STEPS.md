# 🗄️ SUPABASE DATABASE SETUP - Simple Steps

## Step 1: Create Supabase Account (2 minutes)

1. **Go to [https://supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub** (recommended) or email
4. **Click "New Project"**
5. **Fill in:**
   - Name: `skill-swap-platform`
   - Database Password: Create strong password (SAVE THIS!)
   - Region: Choose closest to you
6. **Click "Create new project"**
7. **Wait 2-3 minutes** for setup

## Step 2: Run Database Setup (3 minutes)

### 2.1 Open SQL Editor
1. **In Supabase dashboard, click "SQL Editor"** (left sidebar)
2. **Click "New query"**

### 2.2 Copy and Run the Complete Setup
1. **Open the file `database/complete-setup.sql`** from your project
2. **Copy ALL the SQL code** (Ctrl+A, then Ctrl+C)
3. **Paste it in Supabase SQL Editor**
4. **Click "Run"** (bottom right)
5. **Wait for completion** (should see success messages)

**Expected Result:**
```
✅ Database setup completed successfully!
📊 Tables created: profiles, skills, user_skills_offered, user_skills_wanted, swap_requests, ratings
🔒 Row Level Security enabled with proper policies
⚡ Performance indexes created
🔄 Triggers and functions set up
🎯 Sample skills added (40+ skills across 8 categories)
🎉 Your Skill Swap Platform database is ready!
```

## Step 3: Get Your API Keys (1 minute)

1. **Click "Settings"** (gear icon in sidebar)
2. **Click "API"**
3. **Copy these 3 values:**
   - **Project URL** (starts with https://)
   - **anon public key** (long string starting with eyJ...)
   - **service_role key** (another long string - keep secret!)

## Step 4: Update Environment File (1 minute)

1. **Open `.env.local`** in your project folder
2. **Replace with your actual values:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Save the file** (Ctrl+S)

## ✅ Database Setup Complete!

Your database now has:
- ✅ **6 tables** with proper relationships
- ✅ **Row Level Security** for data protection
- ✅ **User permissions** properly configured
- ✅ **40+ sample skills** across 8 categories
- ✅ **Automatic profile creation** on user signup
- ✅ **Performance optimizations**

## 🚀 Ready to Launch!

Now you can:
1. **Start your server:** `npm run dev`
2. **Open browser:** `http://localhost:3000`
3. **Create account** and test all features!

## 🔍 What Each Table Does:

- **profiles** - User accounts and settings
- **skills** - Available skills (Programming, Design, Music, etc.)
- **user_skills_offered** - Skills users can teach
- **user_skills_wanted** - Skills users want to learn
- **swap_requests** - Skill exchange requests
- **ratings** - User ratings and feedback

## 🛡️ Security Features:

- **Row Level Security (RLS)** - Users can only see/edit their own data
- **Public/Private profiles** - Users control visibility
- **Admin permissions** - Special access for platform management
- **Secure authentication** - Handled by Supabase Auth

## 🎯 Sample Skills Added:

**Programming:** JavaScript, React, Python, Node.js, TypeScript, HTML/CSS, SQL, Git
**Design:** Photoshop, Figma, Illustrator, UI/UX Design, Logo Design
**Music:** Guitar, Piano, Singing, Music Production
**Languages:** Spanish, French, German, English
**Lifestyle:** Cooking, Baking, Gardening, Photography
**Fitness:** Yoga, Personal Training, Running, Swimming
**Business:** Excel, Public Speaking, Marketing, Project Management
**Crafts:** Woodworking, Knitting, Pottery, Jewelry Making
**Creative:** Video Editing, Writing, Drawing
**Games:** Chess, Poker

Your Skill Swap Platform database is fully configured and ready! 🎉
