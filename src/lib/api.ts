import { supabase, isSupabaseConfigured } from './supabase';
import { TasteProfile, FoodSwipe, OnboardingData } from '../types';

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
