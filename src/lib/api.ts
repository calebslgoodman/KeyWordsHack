import { supabase, isSupabaseConfigured } from './supabase';
import { TasteProfile, FoodSwipe, OnboardingData, MealPlanGoal, Meal, MealType, UserMealPlan, MealPlanEntry } from '../types';

// Check if user has completed onboarding
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from('taste_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

// Save onboarding data as taste profile
export async function saveTasteProfile(
  userId: string,
  onboardingData: OnboardingData
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Demo mode: Would save taste profile', onboardingData);
    return { success: true };
  }

  const tasteProfile: TasteProfile = {
    user_id: userId,
    hard_exclusions: {
      allergies: onboardingData.allergies,
      dietary_restrictions: onboardingData.dietary_restrictions,
    },
    taste_profile: {
      disliked_ingredients: onboardingData.disliked_ingredients,
      preferred_cuisines: onboardingData.preferred_cuisines,
      spice_tolerance: onboardingData.spice_tolerance,
      adventure_level: onboardingData.adventure_level,
    },
    strategy_constraints: {
      max_cook_time_minutes: onboardingData.max_cook_time_minutes,
      budget_range: onboardingData.budget_range,
      kitchen_tools: onboardingData.kitchen_tools,
    },
    metadata: {
      completed_at: new Date().toISOString(),
    },
  };

  const { error } = await supabase
    .from('taste_profiles')
    .upsert(tasteProfile, { onConflict: 'user_id' });

  if (error) {
    console.error('Error saving taste profile:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Save a single food swipe
export async function saveFoodSwipe(swipe: FoodSwipe): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Demo mode: Would save swipe', swipe);
    return { success: true };
  }

  const { error } = await supabase
    .from('food_swipes')
    .insert(swipe);

  if (error) {
    console.error('Error saving food swipe:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Save multiple food swipes at once
export async function saveFoodSwipes(swipes: FoodSwipe[]): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Demo mode: Would save swipes', swipes);
    return { success: true };
  }

  const { error } = await supabase
    .from('food_swipes')
    .insert(swipes);

  if (error) {
    console.error('Error saving food swipes:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Get user's taste profile
export async function getTasteProfile(userId: string): Promise<TasteProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('taste_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as TasteProfile;
}

// Get user's food swipes
export async function getFoodSwipes(userId: string): Promise<FoodSwipe[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('food_swipes')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as FoodSwipe[];
}

// Save meal plan goal (meals per week + cook time preference)
export async function saveMealPlanGoal(
  userId: string,
  mealsPerWeek: number,
  maxCookTime: number
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Demo mode: Would save meal plan goal', { mealsPerWeek, maxCookTime });
    return { success: true };
  }

  // Don't include created_at/updated_at - let database handle them with DEFAULT NOW()
  const mealPlanGoal = {
    user_id: userId,
    meals_per_week: mealsPerWeek,
    max_cook_time_minutes: maxCookTime,
  };

  console.log('Attempting to upsert meal plan goal:', mealPlanGoal);

  try {
    const { data, error } = await supabase
      .from('meal_plan_goals')
      .upsert(mealPlanGoal, { onConflict: 'user_id' })
      .select();

    console.log('Upsert response - data:', data);
    console.log('Upsert response - error:', error);

    if (error) {
      console.error('Error saving meal plan goal:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      console.error('Attempted to save:', mealPlanGoal);
      return { success: false, error: `${error.message} (${error.code})` };
    }

    console.log('✅ Successfully saved meal plan goal');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error during save:', err);
    return { success: false, error: 'Unexpected error: ' + String(err) };
  }
}

// Get user's meal plan goal
export async function getMealPlanGoal(userId: string): Promise<MealPlanGoal | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('meal_plan_goals')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as MealPlanGoal;
}

// Get all meals from database
export async function getMeals(): Promise<Meal[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured - meals will need to be loaded from local data');
    return [];
  }

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('meal_type', { ascending: true });

  if (error) {
    console.error('Error fetching meals:', error);
    return [];
  }

  return data as Meal[];
}

// Get meals filtered by meal type
export async function getMealsByType(mealType: MealType): Promise<Meal[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('meal_type', mealType)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching meals by type:', error);
    return [];
  }

  return data as Meal[];
}

// Get a single meal by ID
export async function getMealById(mealId: string): Promise<Meal | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('meal_id', mealId)
    .single();

  if (error || !data) {
    console.error('Error fetching meal by ID:', error);
    return null;
  }

  return data as Meal;
}

// Save user's meal plan selections
export async function saveMealPlan(
  userId: string,
  mealSelections: MealPlanEntry[],
  weekStartDate?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Demo mode: Would save meal plan', mealSelections);
    return { success: true };
  }

  try {
    const weekStart = weekStartDate || new Date().toISOString().split('T')[0];
    console.log('📅 Week start date:', weekStart);
    console.log('📝 Saving meal plan for user:', userId);
    console.log('🍽️ Meal selections:', mealSelections);

    // Archive old active plans for this week
    console.log('🗄️ Archiving old plans...');
    const { error: archiveError } = await supabase
      .from('user_meal_plans')
      .update({ status: 'archived' })
      .eq('user_id', userId)
      .eq('week_start_date', weekStart)
      .eq('status', 'active');

    if (archiveError) {
      console.error('⚠️ Error archiving old plans (non-fatal):', archiveError);
    } else {
      console.log('✅ Archive complete');
    }

    // Create new meal plan entries
    const mealPlanEntries = mealSelections.map(entry => ({
      user_id: userId,
      meal_id: entry.meal_id,
      quantity: entry.quantity,
      week_start_date: weekStart,
      status: 'active' as const,
    }));

    console.log('💾 Inserting new meal plan entries...');
    console.log('📦 Data to insert:', mealPlanEntries);

    const { data, error } = await supabase
      .from('user_meal_plans')
      .insert(mealPlanEntries)
      .select();

    console.log('📊 Insert response - data:', data);
    console.log('📊 Insert response - error:', error);

    if (error) {
      console.error('❌ Error saving meal plan:', error);
      console.error('Full error:', JSON.stringify(error, null, 2));
      return { success: false, error: `${error.message} (${error.code})` };
    }

    console.log(`✅ Saved ${mealSelections.length} meals to meal plan successfully!`);
    return { success: true };
  } catch (err) {
    console.error('💥 Unexpected error in saveMealPlan:', err);
    return { success: false, error: 'Unexpected error: ' + String(err) };
  }
}

// Get user's active meal plan for a specific week
export async function getMealPlan(
  userId: string,
  weekStartDate?: string
): Promise<UserMealPlan[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const weekStart = weekStartDate || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('user_meal_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', weekStart)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching meal plan:', error);
    return [];
  }

  return data as UserMealPlan[];
}

// Get user's active meal plan with full meal details
export async function getMealPlanWithDetails(
  userId: string,
  weekStartDate?: string
): Promise<Array<UserMealPlan & { meal: Meal }>> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const weekStart = weekStartDate || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('user_meal_plans')
    .select(`
      *,
      meal:meals(*)
    `)
    .eq('user_id', userId)
    .eq('week_start_date', weekStart)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching meal plan with details:', error);
    return [];
  }

  return data as Array<UserMealPlan & { meal: Meal }>;
}
