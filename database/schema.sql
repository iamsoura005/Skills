-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE swap_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
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
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills offered
CREATE TABLE user_skills_offered (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level proficiency_level NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- User skills wanted
CREATE TABLE user_skills_wanted (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  urgency urgency_level DEFAULT 'medium',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Swap requests
CREATE TABLE swap_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  requested_skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  offered_skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  status swap_status DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings and feedback
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  rater_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rated_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swap_request_id, rater_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_user_skills_offered_user_id ON user_skills_offered(user_id);
CREATE INDEX idx_user_skills_wanted_user_id ON user_skills_wanted(user_id);
CREATE INDEX idx_swap_requests_requester_id ON swap_requests(requester_id);
CREATE INDEX idx_swap_requests_provider_id ON swap_requests(provider_id);
CREATE INDEX idx_swap_requests_status ON swap_requests(status);
CREATE INDEX idx_ratings_rated_id ON ratings(rated_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills_offered ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills_wanted ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Skills policies (public read, admin write)
CREATE POLICY "Skills are viewable by everyone" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage skills" ON skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User skills offered policies
CREATE POLICY "Public user skills offered are viewable by everyone" ON user_skills_offered
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = user_id AND is_public = true
    )
  );

CREATE POLICY "Users can view own skills offered" ON user_skills_offered
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills offered" ON user_skills_offered
  FOR ALL USING (auth.uid() = user_id);

-- User skills wanted policies
CREATE POLICY "Public user skills wanted are viewable by everyone" ON user_skills_wanted
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = user_id AND is_public = true
    )
  );

CREATE POLICY "Users can view own skills wanted" ON user_skills_wanted
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills wanted" ON user_skills_wanted
  FOR ALL USING (auth.uid() = user_id);

-- Swap requests policies
CREATE POLICY "Users can view swap requests they're involved in" ON swap_requests
  FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = provider_id
  );

CREATE POLICY "Users can create swap requests" ON swap_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update swap requests they're involved in" ON swap_requests
  FOR UPDATE USING (
    auth.uid() = requester_id OR auth.uid() = provider_id
  );

-- Ratings policies
CREATE POLICY "Users can view ratings for public profiles" ON ratings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = rated_id AND is_public = true
    )
  );

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

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_swap_requests_updated_at BEFORE UPDATE ON swap_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
