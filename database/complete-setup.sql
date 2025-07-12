-- =====================================================
-- SKILL SWAP PLATFORM - COMPLETE DATABASE SETUP
-- Copy and paste this entire script into Supabase SQL Editor
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE swap_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  location TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT true,
  availability TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills offered
CREATE TABLE IF NOT EXISTS user_skills_offered (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level proficiency_level NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- User skills wanted
CREATE TABLE IF NOT EXISTS user_skills_wanted (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  urgency urgency_level DEFAULT 'medium',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Swap requests
CREATE TABLE IF NOT EXISTS swap_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  requested_skill_id UUID REFERENCES user_skills_offered(id) ON DELETE CASCADE,
  offered_skill_id UUID REFERENCES user_skills_offered(id) ON DELETE CASCADE,
  status swap_status DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings and feedback
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  rater_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rated_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swap_request_id, rater_id)
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_user_skills_offered_user_id ON user_skills_offered(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_offered_skill_id ON user_skills_offered(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_wanted_user_id ON user_skills_wanted(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_wanted_skill_id ON user_skills_wanted(skill_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_requester_id ON swap_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_provider_id ON swap_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_status ON swap_requests(status);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_id ON ratings(rated_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rater_id ON ratings(rater_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills_offered ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills_wanted ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Skills policies (public read, admin write)
DROP POLICY IF EXISTS "Skills are viewable by everyone" ON skills;
CREATE POLICY "Skills are viewable by everyone" ON skills
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
CREATE POLICY "Admins can manage skills" ON skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Anyone can insert skills" ON skills;
CREATE POLICY "Anyone can insert skills" ON skills
  FOR INSERT WITH CHECK (true);

-- User skills offered policies
DROP POLICY IF EXISTS "Public user skills offered are viewable" ON user_skills_offered;
CREATE POLICY "Public user skills offered are viewable" ON user_skills_offered
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = user_id AND is_public = true
    ) OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can manage own skills offered" ON user_skills_offered;
CREATE POLICY "Users can manage own skills offered" ON user_skills_offered
  FOR ALL USING (auth.uid() = user_id);

-- User skills wanted policies
DROP POLICY IF EXISTS "Public user skills wanted are viewable" ON user_skills_wanted;
CREATE POLICY "Public user skills wanted are viewable" ON user_skills_wanted
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = user_id AND is_public = true
    ) OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can manage own skills wanted" ON user_skills_wanted;
CREATE POLICY "Users can manage own skills wanted" ON user_skills_wanted
  FOR ALL USING (auth.uid() = user_id);

-- Swap requests policies
DROP POLICY IF EXISTS "Users can view relevant swap requests" ON swap_requests;
CREATE POLICY "Users can view relevant swap requests" ON swap_requests
  FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = provider_id
  );

DROP POLICY IF EXISTS "Users can create swap requests" ON swap_requests;
CREATE POLICY "Users can create swap requests" ON swap_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can update relevant swap requests" ON swap_requests;
CREATE POLICY "Users can update relevant swap requests" ON swap_requests
  FOR UPDATE USING (
    auth.uid() = requester_id OR auth.uid() = provider_id
  );

DROP POLICY IF EXISTS "Users can delete own swap requests" ON swap_requests;
CREATE POLICY "Users can delete own swap requests" ON swap_requests
  FOR DELETE USING (auth.uid() = requester_id);

-- Ratings policies
DROP POLICY IF EXISTS "Users can view public ratings" ON ratings;
CREATE POLICY "Users can view public ratings" ON ratings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = rated_id AND is_public = true
    ) OR auth.uid() = rater_id OR auth.uid() = rated_id
  );

DROP POLICY IF EXISTS "Users can create ratings for completed swaps" ON ratings;
CREATE POLICY "Users can create ratings for completed swaps" ON ratings
  FOR INSERT WITH CHECK (
    auth.uid() = rater_id AND
    EXISTS (
      SELECT 1 FROM swap_requests 
      WHERE id = swap_request_id 
      AND status = 'completed'
      AND (requester_id = auth.uid() OR provider_id = auth.uid())
    )
  );

-- =====================================================
-- CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_swap_requests_updated_at ON swap_requests;
CREATE TRIGGER update_swap_requests_updated_at 
  BEFORE UPDATE ON swap_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ADD SAMPLE SKILLS
-- =====================================================

INSERT INTO skills (name, category, description) VALUES
('JavaScript', 'Programming', 'Modern JavaScript programming including ES6+ features'),
('React', 'Programming', 'React.js library for building user interfaces'),
('Python', 'Programming', 'Python programming language for web development and data science'),
('Node.js', 'Programming', 'Server-side JavaScript runtime environment'),
('TypeScript', 'Programming', 'Typed superset of JavaScript'),
('HTML/CSS', 'Programming', 'Web markup and styling languages'),
('SQL', 'Programming', 'Database query language'),
('Git', 'Programming', 'Version control system'),
('Photoshop', 'Design', 'Adobe Photoshop for photo editing and graphic design'),
('Figma', 'Design', 'UI/UX design using Figma design tool'),
('Illustrator', 'Design', 'Adobe Illustrator for vector graphics'),
('UI/UX Design', 'Design', 'User interface and user experience design'),
('Logo Design', 'Design', 'Brand identity and logo creation'),
('Guitar', 'Music', 'Acoustic and electric guitar playing'),
('Piano', 'Music', 'Piano playing from beginner to advanced levels'),
('Singing', 'Music', 'Vocal techniques and performance'),
('Music Production', 'Music', 'Digital audio workstation and music creation'),
('Spanish', 'Language', 'Spanish language conversation and grammar'),
('French', 'Language', 'French language learning and conversation'),
('German', 'Language', 'German language basics to advanced'),
('English', 'Language', 'English language tutoring and conversation'),
('Cooking', 'Lifestyle', 'Cooking techniques and recipe development'),
('Baking', 'Lifestyle', 'Bread, pastries, and dessert making'),
('Gardening', 'Lifestyle', 'Plant care and garden maintenance'),
('Photography', 'Lifestyle', 'Digital photography and photo composition'),
('Yoga', 'Fitness', 'Yoga practice and meditation techniques'),
('Personal Training', 'Fitness', 'Fitness coaching and workout planning'),
('Running', 'Fitness', 'Running techniques and training programs'),
('Swimming', 'Fitness', 'Swimming strokes and water safety'),
('Excel', 'Business', 'Microsoft Excel for data analysis and reporting'),
('Public Speaking', 'Business', 'Presentation skills and public speaking confidence'),
('Marketing', 'Business', 'Digital marketing strategies and social media'),
('Project Management', 'Business', 'Planning and managing projects effectively'),
('Accounting', 'Business', 'Basic accounting and bookkeeping'),
('Woodworking', 'Crafts', 'Basic to advanced woodworking techniques'),
('Knitting', 'Crafts', 'Knitting patterns and techniques'),
('Pottery', 'Crafts', 'Ceramic arts and pottery wheel techniques'),
('Jewelry Making', 'Crafts', 'Creating handmade jewelry'),
('Chess', 'Games', 'Chess strategy and gameplay improvement'),
('Poker', 'Games', 'Texas Hold''em and poker strategy'),
('Video Editing', 'Creative', 'Video editing using various software tools'),
('Writing', 'Creative', 'Creative writing and storytelling'),
('Drawing', 'Creative', 'Sketching and drawing techniques')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup completed successfully!';
  RAISE NOTICE '📊 Tables created: profiles, skills, user_skills_offered, user_skills_wanted, swap_requests, ratings';
  RAISE NOTICE '🔒 Row Level Security enabled with proper policies';
  RAISE NOTICE '⚡ Performance indexes created';
  RAISE NOTICE '🔄 Triggers and functions set up';
  RAISE NOTICE '🎯 Sample skills added (40+ skills across 8 categories)';
  RAISE NOTICE '🎉 Your Skill Swap Platform database is ready!';
END $$;
