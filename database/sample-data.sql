-- Sample data for Skill Swap Platform
-- Run this after setting up the main schema

-- Insert sample skills
INSERT INTO skills (name, category, description) VALUES
('JavaScript', 'Programming', 'Modern JavaScript programming including ES6+ features'),
('React', 'Programming', 'React.js library for building user interfaces'),
('Python', 'Programming', 'Python programming language for web development and data science'),
('Photoshop', 'Design', 'Adobe Photoshop for photo editing and graphic design'),
('Figma', 'Design', 'UI/UX design using Figma design tool'),
('Guitar', 'Music', 'Acoustic and electric guitar playing'),
('Piano', 'Music', 'Piano playing from beginner to advanced levels'),
('Spanish', 'Language', 'Spanish language conversation and grammar'),
('French', 'Language', 'French language learning and conversation'),
('Cooking', 'Lifestyle', 'Cooking techniques and recipe development'),
('Yoga', 'Fitness', 'Yoga practice and meditation techniques'),
('Photography', 'Creative', 'Digital photography and photo composition'),
('Video Editing', 'Creative', 'Video editing using various software tools'),
('Excel', 'Business', 'Microsoft Excel for data analysis and reporting'),
('Public Speaking', 'Business', 'Presentation skills and public speaking confidence'),
('Marketing', 'Business', 'Digital marketing strategies and social media'),
('Gardening', 'Lifestyle', 'Plant care and garden maintenance'),
('Woodworking', 'Crafts', 'Basic to advanced woodworking techniques'),
('Knitting', 'Crafts', 'Knitting patterns and techniques'),
('Chess', 'Games', 'Chess strategy and gameplay improvement');

-- Note: Sample users will be created when they register through the application
-- The profiles table will be populated automatically via Supabase Auth triggers

-- Sample skill categories for reference
-- Programming: JavaScript, React, Python, etc.
-- Design: Photoshop, Figma, etc.
-- Music: Guitar, Piano, etc.
-- Language: Spanish, French, etc.
-- Lifestyle: Cooking, Gardening, etc.
-- Fitness: Yoga, etc.
-- Creative: Photography, Video Editing, etc.
-- Business: Excel, Public Speaking, Marketing, etc.
-- Crafts: Woodworking, Knitting, etc.
-- Games: Chess, etc.
