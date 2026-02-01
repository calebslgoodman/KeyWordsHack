-- Create meal_plan_goals table to store weekly meal planning preferences
CREATE TABLE IF NOT EXISTS meal_plan_goals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  meals_per_week INTEGER NOT NULL CHECK (meals_per_week >= 0 AND meals_per_week <= 21),
  max_cook_time_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE meal_plan_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own meal plan goals"
  ON meal_plan_goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plan goals"
  ON meal_plan_goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plan goals"
  ON meal_plan_goals
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_meal_plan_goals_user_id ON meal_plan_goals(user_id);

-- Add updated_at trigger (using existing function)
CREATE TRIGGER update_meal_plan_goals_updated_at
  BEFORE UPDATE ON meal_plan_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
