-- Create user_meal_plans table to store selected meals for each week
CREATE TABLE IF NOT EXISTS user_meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id TEXT NOT NULL REFERENCES meals(meal_id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 7),
  week_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_meal_plans_user_id ON user_meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_meal_plans_meal_id ON user_meal_plans(meal_id);
CREATE INDEX IF NOT EXISTS idx_user_meal_plans_week ON user_meal_plans(week_start_date);
CREATE INDEX IF NOT EXISTS idx_user_meal_plans_status ON user_meal_plans(status);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_user_meal_plans_user_week
  ON user_meal_plans(user_id, week_start_date, status);

-- Enable Row Level Security
ALTER TABLE user_meal_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own meal plans"
  ON user_meal_plans
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
  ON user_meal_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
  ON user_meal_plans
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
  ON user_meal_plans
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger to auto-update updated_at
CREATE TRIGGER update_user_meal_plans_updated_at
  BEFORE UPDATE ON user_meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
