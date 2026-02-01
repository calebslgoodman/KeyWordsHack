# Meals Table Setup

This guide will help you set up the `meals` table in Supabase to store all your recipe data with images, ingredients, and instructions.

## What You'll Get

After setup, you'll have:
- ✅ 21 meals stored in Supabase (7 breakfast, 7 lunch, 7 dinner)
- ✅ Each meal includes: name, image, cuisine, calories, cook time, ingredients, and step-by-step instructions
- ✅ Your app will load meals from the database instead of hardcoded data
- ✅ Foreign key relationship between user swipes and meals

## Step 1: Create the Meals Table

1. Go to https://app.supabase.com
2. Select your project: `anewmssqluoskedvhlvc`
3. Click **SQL Editor** in the left sidebar
4. Copy and paste the SQL from `migrations/004_meals_table.sql` (shown below)
5. Click **Run** (or press Ctrl+Enter)

```sql
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
```

**IMPORTANT:** Don't add the foreign key constraint yet - we'll do that in Step 4 after populating the meals!

## Step 2: Populate with Meal Data

Now you need to add the 21 meals. The seed data is quite large, so:

1. Stay in the **SQL Editor**
2. Create a new query (click the "+ New query" button)
3. Open the file `supabase/seed_meals.sql` in your code editor
4. Copy ALL of the SQL (it's long - includes all 21 meals with ingredients and instructions)
5. Paste it into the Supabase SQL Editor
6. Click **Run**

You should see: `Success. No rows returned`

## Step 3: Add Foreign Key Constraint

Now that the meals exist, we can safely add the foreign key constraint that links swipes to meals:

1. Stay in **SQL Editor**
2. Copy and paste this SQL:

```sql
-- Add foreign key constraint to ensure swipes reference real meals
ALTER TABLE food_swipes
  ADD CONSTRAINT fk_food_swipes_meal_id
  FOREIGN KEY (meal_id)
  REFERENCES meals(meal_id)
  ON DELETE CASCADE;
```

3. Click **Run**

This ensures that all swipes reference actual meals in the database.

## Step 4: Verify It Worked

1. Go to **Table Editor** in Supabase
2. Click on the `meals` table
3. You should see 21 rows with meals like:
   - Avocado Toast with Eggs
   - Berry Açaí Bowl
   - Chicken Caesar Salad
   - Grilled Salmon
   - etc.

4. Click on any meal to see:
   - All the details (name, image_url, meal_type, cuisine, etc.)
   - The `ingredients` column (JSONB array)
   - The `instructions` column (JSONB array)

## Step 5: Test in Your App

1. Restart your app (or reload)
2. Go to the meal planning screen
3. Start swiping on meals
4. The console should show: `Loaded 21 meals from Supabase`

If it shows `Using 21 meals from local data` instead, the database query failed - check your Supabase connection.

## What Changed in the Code

### Database Structure
- **New table**: `meals` - stores all recipe data
- **Foreign key**: `food_swipes.meal_id` now references `meals.meal_id`
- **RLS**: Anyone can view meals (public data), only authenticated users can modify

### App Changes
- `SwipeScreen` now loads meals from Supabase using `getMeals()`
- Falls back to local data (`MEALS` from `src/data/meals.ts`) if Supabase is not configured
- Shows a loading screen while fetching meals

### API Functions (in `src/lib/api.ts`)
- `getMeals()` - Get all meals
- `getMealsByType(mealType)` - Get breakfast, lunch, or dinner meals
- `getMealById(mealId)` - Get a specific meal

## Troubleshooting

**Error: "relation 'meals' does not exist"**
- You didn't run the migration SQL from Step 1. Go back and run it.

**Error: "insert or update on table 'food_swipes' violates foreign key constraint 'fk_food_swipes_meal_id'"**
- This means you already have swipe data that references meals that don't exist yet
- **Solution**: Follow the steps IN ORDER:
  1. First create the meals table (Step 1) - without the FK constraint
  2. Then populate with meals (Step 2)
  3. THEN add the foreign key constraint (Step 3)
- The updated migration file no longer includes the FK constraint - it's added separately after seeding

**App shows "Using 21 meals from local data"**
- Supabase is not configured or the query failed
- Check your Supabase URL and API key in `.env`
- Check the console for error messages

**No meals showing in Table Editor**
- You ran the migration but forgot to run the seed file
- Go back to Step 2 and run `seed_meals.sql`

**How do I add more meals?**
- Option 1: Add them in Supabase Table Editor (manually)
- Option 2: Write INSERT SQL statements and run them in SQL Editor
- The app will automatically load new meals from the database

## Benefits of Using Supabase for Meals

1. **Easy Updates**: Change meal data in Supabase without updating app code
2. **Scalability**: Add 100s or 1000s of meals without bloating the app
3. **Filtering**: Query by cuisine, cook time, meal type, etc.
4. **Admin Panel**: Build a web admin to manage meals
5. **User-Generated**: Let users submit their own recipes in the future
6. **Analytics**: Track which meals are most popular using SQL queries

## Next Steps

Consider adding:
- A `difficulty_level` column (easy, medium, hard)
- A `tags` JSONB column (quick, healthy, budget-friendly, etc.)
- A `nutrition` JSONB column (protein, carbs, fat, etc.)
- A `servings` column (how many people it serves)
- A `prep_time_minutes` column (separate from cook time)
- User ratings and reviews

All of these can be added with additional migrations!
