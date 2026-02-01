// Taste Profile Types
export interface HardExclusions {
  allergies: string[];
  dietary_restrictions: string[];
}

export interface TastePreferences {
  disliked_ingredients: string[];
  preferred_cuisines: string[];
  spice_tolerance: 'none' | 'mild' | 'medium' | 'hot';
  adventure_level: 'safe' | 'balanced' | 'exploratory';
}

export interface StrategyConstraints {
  max_cook_time_minutes: number;
  budget_range: 'budget' | 'moderate' | 'flexible';
  kitchen_tools: string[];
}

export interface TasteProfile {
  user_id: string;
  hard_exclusions: HardExclusions;
  taste_profile: TastePreferences;
  strategy_constraints: StrategyConstraints;
  metadata: {
    completed_at: string;
  };
}

// Meal Types
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type SwipeDirection = 'left' | 'right' | 'maybe';

export interface Meal {
  meal_id: string;
  name: string;
  image_url: string;
  meal_type: MealType;
  cuisine: string;
  description: string;
  calories: number;
  cook_time_minutes: number;
  ingredients: string[];
  instructions: string[];
}

export interface FoodSwipe {
  user_id: string;
  meal_id: string;
  meal_type: MealType;
  swipe: SwipeDirection;
  confidence: number; // 1-5
  timestamp: string;
}

export interface MealPlanGoal {
  user_id: string;
  meals_per_week: number; // 0-21
  max_cook_time_minutes: number; // Weekly cooking time preference
  created_at: string;
  updated_at: string;
}

export interface UserMealPlan {
  id: string;
  user_id: string;
  meal_id: string;
  quantity: number; // How many times to make this meal (1-7)
  week_start_date: string; // ISO date string
  status: 'active' | 'archived' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface MealPlanEntry {
  meal_id: string;
  quantity: number;
}

// Onboarding Types
export interface OnboardingData {
  allergies: string[];
  dietary_restrictions: string[];
  disliked_ingredients: string[];
  max_cook_time_minutes: number;
  budget_range: 'budget' | 'moderate' | 'flexible';
  kitchen_tools: string[];
  preferred_cuisines: string[];
  spice_tolerance: 'none' | 'mild' | 'medium' | 'hot';
  adventure_level: 'safe' | 'balanced' | 'exploratory';
}

// Onboarding Options
export const ALLERGY_OPTIONS = [
  'Peanuts',
  'Tree Nuts',
  'Milk/Dairy',
  'Eggs',
  'Wheat/Gluten',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
];

export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Halal',
  'Kosher',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Low-Sodium',
];

export const DISLIKED_INGREDIENTS = [
  'Cilantro',
  'Olives',
  'Mushrooms',
  'Onions',
  'Tomatoes',
  'Avocado',
  'Pickles',
  'Blue Cheese',
  'Anchovies',
  'Liver',
  'Tofu',
  'Eggplant',
];

export const COOK_TIME_OPTIONS = [
  { label: 'Quick (under 15 min)', value: 15 },
  { label: 'Easy (15-30 min)', value: 30 },
  { label: 'Moderate (30-45 min)', value: 45 },
  { label: 'I have time (45+ min)', value: 60 },
];

export const BUDGET_OPTIONS = [
  { label: 'Budget-friendly ($5-8/meal)', value: 'budget' as const },
  { label: 'Moderate ($8-15/meal)', value: 'moderate' as const },
  { label: 'Flexible ($15+/meal)', value: 'flexible' as const },
];

export const KITCHEN_TOOLS = [
  'Microwave',
  'Stovetop',
  'Oven',
  'Air Fryer',
  'Instant Pot',
  'Blender',
  'Food Processor',
  'Grill',
];

export const CUISINE_OPTIONS = [
  'American',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'Korean',
  'Vietnamese',
  'French',
  'Greek',
];

export const SPICE_OPTIONS = [
  { label: 'No spice please', value: 'none' as const },
  { label: 'Mild - just a hint', value: 'mild' as const },
  { label: 'Medium - some kick', value: 'medium' as const },
  { label: 'Hot - bring the heat!', value: 'hot' as const },
];

export const ADVENTURE_OPTIONS = [
  { label: 'Safe - stick to what I know', value: 'safe' as const },
  { label: 'Balanced - mix of familiar & new', value: 'balanced' as const },
  { label: 'Exploratory - surprise me!', value: 'exploratory' as const },
];
