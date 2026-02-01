# Supabase Database Setup

This directory contains the database schema and migrations for the MealSwipe app.

## Quick Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Run the schema file: `schema.sql`
5. Run the migration: `migrations/003_meal_plan_goals.sql`

## Database Tables

### 1. `meals`
Stores all available meals/recipes with full details.

**Columns:**
- `meal_id` (TEXT, Primary Key) - Unique identifier (e.g., 'breakfast_1')
- `name` (TEXT) - Meal name (e.g., 'Avocado Toast with Eggs')
- `image_url` (TEXT) - Unsplash image URL
- `meal_type` (TEXT) - 'breakfast', 'lunch', or 'dinner'
- `cuisine` (TEXT) - Cuisine type (e.g., 'Italian', 'Mexican')
- `description` (TEXT) - Brief meal description
- `calories` (INTEGER) - Calorie count
- `cook_time_minutes` (INTEGER) - Total cook time
- `ingredients` (JSONB) - Array of ingredients
- `instructions` (JSONB) - Array of step-by-step instructions
- `created_at` / `updated_at` (Timestamp)

**Access:** Public read, authenticated write

### 2. `taste_profiles`
Stores user onboarding preferences and dietary requirements.

**Columns:**
- `user_id` (UUID, Primary Key) - References auth.users
- `hard_exclusions` (JSONB) - Allergies and dietary restrictions
- `taste_profile` (JSONB) - Cuisine preferences, spice tolerance, adventure level
- `strategy_constraints` (JSONB) - Cook time, budget, kitchen tools
- `metadata` (JSONB) - Completion timestamp and other metadata
- `created_at` / `updated_at` (Timestamp)

### 3. `food_swipes`
Stores user swipe history for meal recommendations.

**Columns:**
- `id` (UUID, Primary Key)
- `user_id` (UUID) - References auth.users
- `meal_id` (Text) - ID of the meal from the meals dataset
- `meal_type` (Text) - 'breakfast', 'lunch', or 'dinner'
- `swipe` (Text) - 'left', 'right', or 'maybe'
- `confidence` (Integer 1-5) - User's confidence in their choice
- `timestamp` / `created_at` (Timestamp)

### 4. `meal_plan_goals`
Stores weekly meal planning goals and preferences.

**Columns:**
- `user_id` (UUID, Primary Key) - References auth.users
- `meals_per_week` (Integer 0-21) - Number of meals to plan
- `max_cook_time_minutes` (Integer) - Weekly cooking time preference
- `created_at` / `updated_at` (Timestamp)

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only view their own data
- Users can only insert/update their own data
- Data is automatically deleted when a user account is deleted

## App Integration

### Data Flow

1. **App Launch** → Loads all meals from `meals` table
2. **Onboarding** → Saves to `taste_profiles`
3. **Meal Planning Goal** → Saves to `meal_plan_goals`
4. **Meal Swiping** → Displays meals from `meals`, saves each swipe to `food_swipes`
5. **User Returns** → Loads `taste_profiles`, `meal_plan_goals`, and `food_swipes` history

### API Functions

Located in `src/lib/api.ts`:

**Meals:**
- `getMeals()` - Load all meals from database
- `getMealsByType(mealType)` - Load meals filtered by breakfast/lunch/dinner
- `getMealById(mealId)` - Load a specific meal

**User Data:**
- `saveTasteProfile()` - Save onboarding data
- `getTasteProfile()` - Load taste profile
- `saveMealPlanGoal()` - Save weekly meal planning goal
- `getMealPlanGoal()` - Load meal planning goal
- `saveFoodSwipe()` - Save single swipe
- `saveFoodSwipes()` - Save multiple swipes
- `getFoodSwipes()` - Load user's swipe history

## Testing

You can test the database setup by:

1. Creating a test user in Supabase Auth
2. Running the app and completing onboarding
3. Checking the `taste_profiles` table in Supabase
4. Setting a meal goal and checking `meal_plan_goals`
5. Swiping on meals and checking `food_swipes`

## Migrations

Migrations are numbered and should be run in order:
- `003_meal_plan_goals.sql` - Adds meal planning goals table
- `004_meals_table.sql` - Adds meals table with recipes, ingredients, and instructions

## Seed Data

- `seed_meals.sql` - Populates the meals table with 21 initial recipes

To add a new migration:
1. Create a new file: `migrations/00X_description.sql`
2. Write your SQL changes
3. Test in Supabase SQL Editor
4. Document in this README
