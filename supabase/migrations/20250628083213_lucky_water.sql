/*
  # AI Companion Quest - Complete Database Schema

  1. New Tables
    - `profiles` - User profiles with XP, level, streaks
    - `xp_logs` - Track all XP transactions
    - `streaks` - Daily streak tracking
    - `concept_progress` - Skill tree progress
    - `mood_logs` - Emotion tracking data
    - `matches` - Coding battle records
    - `diy_tasks` - Generated project tasks
    - `flashcards` - Quiz cards with stats
    - `submissions` - Code contributions
    - `contributions` - Community contributions
    - `themes` - Unlockable themes
    - `chat_messages` - AI buddy conversations
    - `match_participants` - Real-time battle participants

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar text DEFAULT '🚀',
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  mood text DEFAULT 'excited',
  rank text DEFAULT 'Bronze I',
  total_battles integer DEFAULT 0,
  battles_won integer DEFAULT 0,
  quests_completed integer DEFAULT 0,
  cards_collected integer DEFAULT 0,
  contributions_accepted integer DEFAULT 0,
  current_theme text DEFAULT 'dark',
  unlocked_themes text[] DEFAULT ARRAY['dark'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- XP transaction logs
CREATE TABLE IF NOT EXISTS xp_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  source text NOT NULL, -- 'quest', 'battle', 'diy', 'flashcard', etc.
  description text,
  created_at timestamptz DEFAULT now()
);

-- Daily streak tracking
CREATE TABLE IF NOT EXISTS streaks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  activities text[] DEFAULT ARRAY[]::text[],
  xp_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Skill tree concept progress
CREATE TABLE IF NOT EXISTS concept_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id text NOT NULL,
  category text NOT NULL,
  level integer DEFAULT 0,
  max_level integer DEFAULT 5,
  xp_invested integer DEFAULT 0,
  unlocked boolean DEFAULT false,
  mastered boolean DEFAULT false,
  prerequisites text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, concept_id)
);

-- Emotion and mood tracking
CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mood text NOT NULL,
  intensity integer DEFAULT 5, -- 1-10 scale
  context text,
  triggers text[] DEFAULT ARRAY[]::text[],
  activities text[] DEFAULT ARRAY[]::text[],
  productivity_score integer DEFAULT 50,
  engagement_score integer DEFAULT 50,
  session_duration integer DEFAULT 0, -- minutes
  created_at timestamptz DEFAULT now()
);

-- Coding battle matches
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  problem_title text NOT NULL,
  problem_description text NOT NULL,
  difficulty text NOT NULL, -- 'easy', 'medium', 'hard'
  xp_wager integer DEFAULT 100,
  status text DEFAULT 'waiting', -- 'waiting', 'active', 'completed', 'cancelled'
  mode text DEFAULT 'quick', -- 'quick', 'ranked', 'custom'
  max_players integer DEFAULT 2,
  time_limit integer DEFAULT 1800, -- seconds
  test_cases jsonb DEFAULT '[]'::jsonb,
  starter_code text DEFAULT '',
  solution text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  ended_at timestamptz,
  winner_id uuid REFERENCES profiles(id)
);

-- Match participants and results
CREATE TABLE IF NOT EXISTS match_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  code_submission text,
  score integer DEFAULT 0,
  completion_time integer, -- seconds
  tests_passed integer DEFAULT 0,
  total_tests integer DEFAULT 0,
  rank integer,
  joined_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  UNIQUE(match_id, user_id)
);

-- DIY generated tasks
CREATE TABLE IF NOT EXISTS diy_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  technologies text[] DEFAULT ARRAY[]::text[],
  estimated_time text DEFAULT '2-3 hours',
  xp_reward integer DEFAULT 500,
  features text[] DEFAULT ARRAY[]::text[],
  challenges text[] DEFAULT ARRAY[]::text[],
  files jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'generated', -- 'generated', 'in_progress', 'completed', 'submitted'
  prompt_used text,
  gpt_response jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Flashcards for quiz battles
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL, -- 'easy', 'medium', 'hard'
  rarity text DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  xp_value integer DEFAULT 25,
  times_played integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- User flashcard collection and stats
CREATE TABLE IF NOT EXISTS user_flashcards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  flashcard_id uuid REFERENCES flashcards(id) ON DELETE CASCADE,
  owned boolean DEFAULT false,
  times_played integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  average_response_time real DEFAULT 0,
  last_played_at timestamptz,
  acquired_at timestamptz DEFAULT now(),
  UNIQUE(user_id, flashcard_id)
);

-- Code submissions for architect mode
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'feature', 'bugfix', 'improvement', 'documentation'
  status text DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected'
  code_url text NOT NULL,
  live_url text,
  xp_reward integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id)
);

-- Code reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  code_quality integer CHECK (code_quality >= 1 AND code_quality <= 5),
  functionality integer CHECK (functionality >= 1 AND functionality <= 5),
  design integer CHECK (design >= 1 AND design <= 5),
  innovation integer CHECK (innovation >= 1 AND innovation <= 5),
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(submission_id, reviewer_id)
);

-- Unlockable themes
CREATE TABLE IF NOT EXISTS themes (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  colors jsonb NOT NULL,
  xp_required integer DEFAULT 0,
  rarity text DEFAULT 'common',
  preview_image text,
  created_at timestamptz DEFAULT now()
);

-- AI buddy chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  sender text NOT NULL, -- 'user' or 'ai'
  personality text NOT NULL,
  mood text,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Daily goals/quests
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  target integer NOT NULL,
  current integer DEFAULT 0,
  xp_reward integer NOT NULL,
  completed boolean DEFAULT false,
  type text NOT NULL, -- 'xp', 'battles', 'quests', 'cards', etc.
  icon text DEFAULT '🎯',
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, type, date)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE diy_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- XP Logs: Users can only see their own XP logs
CREATE POLICY "Users can view own XP logs" ON xp_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own XP logs" ON xp_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks: Users can only see their own streaks
CREATE POLICY "Users can view own streaks" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON streaks FOR UPDATE USING (auth.uid() = user_id);

-- Concept Progress: Users can only see their own progress
CREATE POLICY "Users can view own concept progress" ON concept_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own concept progress" ON concept_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own concept progress" ON concept_progress FOR UPDATE USING (auth.uid() = user_id);

-- Mood Logs: Users can only see their own mood data
CREATE POLICY "Users can view own mood logs" ON mood_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood logs" ON mood_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Matches: Everyone can see active matches, creators can update
CREATE POLICY "Everyone can view matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Users can create matches" ON matches FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update matches" ON matches FOR UPDATE USING (auth.uid() = creator_id);

-- Match Participants: Participants can see their own data
CREATE POLICY "Users can view match participants" ON match_participants FOR SELECT USING (true);
CREATE POLICY "Users can join matches" ON match_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own participation" ON match_participants FOR UPDATE USING (auth.uid() = user_id);

-- DIY Tasks: Users can only see their own tasks
CREATE POLICY "Users can view own DIY tasks" ON diy_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create DIY tasks" ON diy_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own DIY tasks" ON diy_tasks FOR UPDATE USING (auth.uid() = user_id);

-- Flashcards: Everyone can see flashcards
CREATE POLICY "Everyone can view flashcards" ON flashcards FOR SELECT USING (true);
CREATE POLICY "Users can create flashcards" ON flashcards FOR INSERT WITH CHECK (auth.uid() = created_by);

-- User Flashcards: Users can only see their own collection
CREATE POLICY "Users can view own flashcard collection" ON user_flashcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own flashcard collection" ON user_flashcards FOR ALL USING (auth.uid() = user_id);

-- Submissions: Everyone can see submissions
CREATE POLICY "Everyone can view submissions" ON submissions FOR SELECT USING (true);
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own submissions" ON submissions FOR UPDATE USING (auth.uid() = author_id);

-- Reviews: Everyone can see reviews
CREATE POLICY "Everyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Themes: Everyone can see themes
CREATE POLICY "Everyone can view themes" ON themes FOR SELECT USING (true);

-- Chat Messages: Users can only see their own chat history
CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Goals: Users can only see their own goals
CREATE POLICY "Users can view own daily goals" ON daily_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily goals" ON daily_goals FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_concept_progress_updated_at BEFORE UPDATE ON concept_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET level = GREATEST(1, (NEW.total_xp / 1000) + 1)
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update level when XP changes
CREATE TRIGGER update_level_on_xp_change 
    AFTER INSERT ON xp_logs 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_user_level();