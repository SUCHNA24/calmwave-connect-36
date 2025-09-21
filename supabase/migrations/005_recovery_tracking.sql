-- Recovery tracking system for weekly progress monitoring

-- Create recovery_entries table for daily recovery check-ins
CREATE TABLE IF NOT EXISTS recovery_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL,
  recovery_status TEXT NOT NULL CHECK (recovery_status IN ('better', 'same', 'worse')),
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  medication_adherence BOOLEAN DEFAULT false,
  therapy_session BOOLEAN DEFAULT false,
  exercise_completed BOOLEAN DEFAULT false,
  social_connection BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Create recovery_goals table for weekly/monthly goals
CREATE TABLE IF NOT EXISTS recovery_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weekly', 'monthly', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  unit TEXT, -- e.g., 'days', 'sessions', 'hours'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recovery_milestones table for tracking achievements
CREATE TABLE IF NOT EXISTS recovery_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('streak', 'goal_completion', 'improvement', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  achieved_date DATE NOT NULL,
  metadata JSONB, -- Store additional data like streak count, improvement percentage, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recovery_entries_user_date ON recovery_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_recovery_entries_date ON recovery_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_recovery_goals_user ON recovery_goals(user_id, end_date DESC);
CREATE INDEX IF NOT EXISTS idx_recovery_milestones_user ON recovery_milestones(user_id, achieved_date DESC);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_recovery_entries_updated_at 
  BEFORE UPDATE ON recovery_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recovery_goals_updated_at 
  BEFORE UPDATE ON recovery_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for recovery_entries
ALTER TABLE recovery_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recovery entries" ON recovery_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recovery entries" ON recovery_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recovery entries" ON recovery_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recovery entries" ON recovery_entries
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for recovery_goals
ALTER TABLE recovery_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recovery goals" ON recovery_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recovery goals" ON recovery_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recovery goals" ON recovery_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recovery goals" ON recovery_goals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for recovery_milestones
ALTER TABLE recovery_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recovery milestones" ON recovery_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recovery milestones" ON recovery_milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recovery milestones" ON recovery_milestones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recovery milestones" ON recovery_milestones
  FOR DELETE USING (auth.uid() = user_id);

-- Function to calculate weekly recovery score
CREATE OR REPLACE FUNCTION calculate_weekly_recovery_score(user_uuid UUID, week_start DATE)
RETURNS INTEGER AS $$
DECLARE
  total_score INTEGER := 0;
  entry_count INTEGER := 0;
  avg_score INTEGER;
BEGIN
  -- Calculate average score from mood, energy, and sleep quality
  SELECT 
    COALESCE(AVG((COALESCE(mood_score, 5) + COALESCE(energy_level, 5) + COALESCE(sleep_quality, 5)) / 3), 0)::INTEGER,
    COUNT(*)
  INTO avg_score, entry_count
  FROM recovery_entries 
  WHERE user_id = user_uuid 
    AND entry_date >= week_start 
    AND entry_date < week_start + INTERVAL '7 days';
  
  -- If no entries, return 0
  IF entry_count = 0 THEN
    RETURN 0;
  END IF;
  
  -- Convert to percentage (multiply by 10 since scores are 1-10)
  RETURN (avg_score * 10);
END;
$$ LANGUAGE plpgsql;

-- Function to get recovery streak
CREATE OR REPLACE FUNCTION get_recovery_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  current_date DATE := CURRENT_DATE;
  has_entry BOOLEAN;
BEGIN
  LOOP
    -- Check if user has an entry for current_date
    SELECT EXISTS(
      SELECT 1 FROM recovery_entries 
      WHERE user_id = user_uuid 
        AND entry_date = current_date
        AND recovery_status IN ('better', 'same')
    ) INTO has_entry;
    
    -- If no entry or status is 'worse', break the streak
    IF NOT has_entry THEN
      EXIT;
    END IF;
    
    streak_count := streak_count + 1;
    current_date := current_date - INTERVAL '1 day';
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql;
