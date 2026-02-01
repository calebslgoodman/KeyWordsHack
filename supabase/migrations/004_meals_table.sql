-- Create meals table to store all available meals
CREATE TABLE IF NOT EXISTS meals (
  meal_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  cuisine TEXT NOT NULL,
  description TEXT NOT NULL,
  calories INTEGER NOT NULL,
  cook_time_minutes INTEGER NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meals_meal_type ON meals(meal_type);
CREATE INDEX IF NOT EXISTS idx_meals_cuisine ON meals(cuisine);
CREATE INDEX IF NOT EXISTS idx_meals_cook_time ON meals(cook_time_minutes);

-- Enable Row Level Security
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view meals (they're public data)
CREATE POLICY "Anyone can view meals"
  ON meals
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update meals (for admin purposes)
CREATE POLICY "Authenticated users can insert meals"
  ON meals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update meals"
  ON meals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add trigger to auto-update updated_at
CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- NOTE: Foreign key constraint will be added AFTER seeding meals data
-- See instructions in MEALS_SETUP.md Step 4
