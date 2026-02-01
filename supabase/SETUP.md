# Quick Supabase Setup

## Step 1: Run This SQL in Supabase

1. Go to https://app.supabase.com
2. Select your project: `anewmssqluoskedvhlvc`
3. Click **SQL Editor** in the left sidebar
4. Copy and paste the SQL below
5. Click **Run** (or press Ctrl+Enter)

```sql
-- Create the function for auto-updating updated_at (if it doesn't exist from schema.sql)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create meal_plan_goals table
CREATE TABLE IF NOT EXISTS meal_plan_goals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  meals_per_week INTEGER NOT NULL CHECK (meals_per_week >= 0 AND meals_per_week <= 21),
  max_cook_time_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE meal_plan_goals ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own data
CREATE POLICY "Users can view own meal plan goals"
  ON meal_plan_goals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert own meal plan goals"
  ON meal_plan_goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own data
CREATE POLICY "Users can update own meal plan goals"
  ON meal_plan_goals
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_meal_plan_goals_user_id ON meal_plan_goals(user_id);

-- Add trigger to auto-update updated_at
CREATE TRIGGER update_meal_plan_goals_updated_at
  BEFORE UPDATE ON meal_plan_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 2: Verify It Worked

After running the SQL:
1. Go to **Table Editor** in Supabase
2. You should see a new table called `meal_plan_goals`
3. It should have columns: `user_id`, `meals_per_week`, `max_cook_time_minutes`, `created_at`, `updated_at`

## Step 3: Test in the App

1. Run your app
2. Go through the meal planning flow
3. Set your meals per week (e.g., 21)
4. Click "Start Swiping"
5. Check the console logs - should see "Meal plan goal saved successfully"
6. Check Supabase Table Editor → `meal_plan_goals` → you should see a row with your data

## Troubleshooting

**Error: "relation meal_plan_goals does not exist"**
- The table wasn't created. Run the SQL above.

**Error: "new row violates row-level security policy"**
- Make sure you're logged in as a user
- RLS policies require `auth.uid()` to match `user_id`

**Error: "null value in column user_id violates not-null constraint"**
- Make sure you're logged in before trying to save

## What Gets Saved

Example data in the table:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "meals_per_week": 21,
  "max_cook_time_minutes": 30,
  "created_at": "2024-01-31T20:00:00Z",
  "updated_at": "2024-01-31T20:00:00Z"
}
```
