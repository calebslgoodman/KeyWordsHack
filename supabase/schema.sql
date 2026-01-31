-- MealSwipe Database Schema
-- Run this in Supabase SQL Editor to create the required tables

-- Taste Profiles Table (stores onboarding data)
CREATE TABLE IF NOT EXISTS taste_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  hard_exclusions JSONB NOT NULL DEFAULT '{"allergies": [], "dietary_restrictions": []}',
  taste_profile JSONB NOT NULL DEFAULT '{"disliked_ingredients": [], "preferred_cuisines": [], "spice_tolerance": "mild", "adventure_level": "balanced"}',
  strategy_constraints JSONB NOT NULL DEFAULT '{"max_cook_time_minutes": 30, "budget_range": "moderate", "kitchen_tools": []}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food Swipes Table (stores swipe history)
CREATE TABLE IF NOT EXISTS food_swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  swipe TEXT NOT NULL CHECK (swipe IN ('left', 'right', 'maybe')),
  confidence INTEGER NOT NULL CHECK (confidence >= 1 AND confidence <= 5),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_food_swipes_user_id ON food_swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_food_swipes_meal_type ON food_swipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_food_swipes_swipe ON food_swipes(swipe);

-- Row Level Security (RLS) Policies

-- Enable RLS on tables
ALTER TABLE taste_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_swipes ENABLE ROW LEVEL SECURITY;

-- Taste Profiles: Users can only access their own data
CREATE POLICY "Users can view own taste profile"
  ON taste_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own taste profile"
  ON taste_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own taste profile"
  ON taste_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Food Swipes: Users can only access their own data
CREATE POLICY "Users can view own food swipes"
  ON food_swipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food swipes"
  ON food_swipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food swipes"
  ON food_swipes FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for taste_profiles updated_at
CREATE TRIGGER update_taste_profiles_updated_at
  BEFORE UPDATE ON taste_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
