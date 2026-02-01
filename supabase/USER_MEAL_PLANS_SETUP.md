# User Meal Plans Setup

This creates a table to store your final meal selections with quantities after swiping.

## What This Table Does

After you finish swiping and confirm your meal plan:
- Saves each selected meal with a quantity (how many times you'll make it this week)
- Tracks which week the plan is for
- Allows you to view/edit your active meal plan
- Archives old plans so you have history

## Step 1: Create the Table

1. Go to https://app.supabase.com
2. Select your project: `anewmssqluoskedvhlvc`
3. Click **SQL Editor** in the left sidebar
4. Copy and paste this SQL:

```sql
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
```

5. Click **Run**

## Step 2: Verify It Worked

1. Go to **Table Editor**
2. You should see a new table called `user_meal_plans`
3. Columns: `id`, `user_id`, `meal_id`, `quantity`, `week_start_date`, `status`, `created_at`, `updated_at`

## Step 3: Test in Your App

1. Complete the swipe flow
2. Select your meals
3. Click "Confirm Meal Plan"
4. Check Supabase Table Editor → `user_meal_plans`
5. You should see rows like:

| user_id | meal_id | quantity | week_start_date | status |
|---------|---------|----------|-----------------|--------|
| abc-123 | breakfast_1 | 2 | 2024-01-29 | active |
| abc-123 | lunch_3 | 3 | 2024-01-29 | active |
| abc-123 | dinner_5 | 1 | 2024-01-29 | active |

## What Gets Saved

When you confirm your meal plan, the app:
1. Counts how many times each meal was selected
2. Archives any old active plans for this week
3. Saves new entries with quantities

Example:
- If you swiped right on "Avocado Toast" 3 times → quantity: 3
- If you swiped right on "Grilled Salmon" once → quantity: 1

## API Functions Available

In `src/lib/api.ts`:
- `saveMealPlan(userId, mealSelections, weekStartDate)` - Save meal plan
- `getMealPlan(userId, weekStartDate)` - Get meal plan IDs and quantities
- `getMealPlanWithDetails(userId, weekStartDate)` - Get meal plan with full meal details

## Status Values

- **active**: Current week's meal plan
- **archived**: Old plans you've replaced
- **completed**: Meals you've cooked (for future feature)

## Use Cases

1. **View this week's plan**: Query for active meals with week_start_date = this week
2. **Update quantities**: Change how many times you'll make a meal
3. **Archive and create new**: When you want to start fresh
4. **History**: View past weeks' archived plans

## Future Enhancements

You could add:
- `notes` column for meal prep notes
- `completed_date` to track when you cooked each meal
- `shopping_list_generated` boolean
- `meal_order` to specify which day to cook each meal
