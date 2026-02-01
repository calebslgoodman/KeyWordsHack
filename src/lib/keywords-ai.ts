/**
 * Keywords AI Gateway Integration
 *
 * This module provides a unified interface to the Keywords AI Gateway,
 * routing all LLM requests through their platform for:
 * - Unified access to 250+ LLMs (using Google Gemini via Gateway)
 * - Centralized prompt management with versioning
 * - Model fallback and load balancing
 * - Prompt caching and optimization
 * - Usage monitoring and analytics
 *
 * All prompts are managed via Keywords AI Prompt Management:
 * - Prompts are created, versioned, and deployed on the platform
 * - Referenced by prompt_id in API calls
 * - Variables are substituted at runtime
 * - Environment separation (test vs production)
 */

import {
  Meal,
  TasteProfile,
  FoodSwipe,
  MealType,
} from '../types';

// Keywords AI Configuration
const KEYWORDS_AI_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_KEYWORDS_AI_API_KEY || '',
  baseUrl: process.env.EXPO_PUBLIC_KEYWORDS_AI_BASE_URL || 'https://api.keywordsai.co/api',
  // Default model routed through Gateway (Gemini via Keywords AI)
  defaultModel: 'gemini/gemini-1.5-flash',
  // Prompt IDs for managed prompts (created on Keywords AI platform)
  promptIds: {
    mealRecommendation: process.env.EXPO_PUBLIC_PROMPT_MEAL_RECOMMENDATION || 'meal_recommendation_v1',
    groceryList: process.env.EXPO_PUBLIC_PROMPT_GROCERY_LIST || 'grocery_list_generator_v1',
    mealInsights: process.env.EXPO_PUBLIC_PROMPT_MEAL_INSIGHTS || 'meal_plan_insights_v1',
    recipeAdaptation: process.env.EXPO_PUBLIC_PROMPT_RECIPE_ADAPTATION || 'recipe_adaptation_v1',
  },
};

// Check if Keywords AI is properly configured
export const isKeywordsAIConfigured = (): boolean => {
  return Boolean(KEYWORDS_AI_CONFIG.apiKey && KEYWORDS_AI_CONFIG.apiKey.length > 0);
};

/**
 * Keywords AI Gateway Response Types
 */
interface KeywordsAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface KeywordsAIChoice {
  index: number;
  message: KeywordsAIMessage;
  finish_reason: string;
}

interface KeywordsAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface KeywordsAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: KeywordsAIChoice[];
  usage: KeywordsAIUsage;
}

/**
 * Prompt configuration for Keywords AI Prompt Management
 */
interface PromptConfig {
  prompt_id: string;
  variables: Record<string, string>;
  override: boolean; // When true, uses prompt config instead of SDK parameters
}

/**
 * Core function to call Keywords AI Gateway with prompt management
 *
 * This is the central routing point for all LLM calls.
 * Instead of calling Gemini directly, all requests go through Keywords AI Gateway.
 */
async function callKeywordsAIGateway(
  promptConfig: PromptConfig,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  if (!isKeywordsAIConfigured()) {
    throw new Error('Keywords AI is not configured. Please set EXPO_PUBLIC_KEYWORDS_AI_API_KEY.');
  }

  const {
    model = KEYWORDS_AI_CONFIG.defaultModel,
    temperature = 0.7,
    maxTokens = 2048,
  } = options;

  try {
    const response = await fetch(`${KEYWORDS_AI_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEYWORDS_AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model,
        // Placeholder messages - will be overridden by prompt config
        messages: [{ role: 'user', content: 'placeholder' }],
        temperature,
        max_tokens: maxTokens,
        // Keywords AI Prompt Management integration
        prompt: {
          prompt_id: promptConfig.prompt_id,
          variables: promptConfig.variables,
          override: promptConfig.override, // Use prompt config from platform
        },
      }),
    });

    if (!response.ok) {
      // Silently handle API errors - don't expose to user
      await response.json().catch(() => ({}));
      throw new Error('AI_API_ERROR');
    }

    const data: KeywordsAIResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('AI_NO_RESPONSE');
    }

    return data.choices[0].message.content;
  } catch (error) {
    // Silent error handling - fallback will be used
    throw error;
  }
}

/**
 * Alternative: Direct call without prompt management (for development/fallback)
 * Uses hardcoded prompts when prompt management is not yet set up
 */
async function callKeywordsAIDirect(
  systemPrompt: string,
  userMessage: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  if (!isKeywordsAIConfigured()) {
    throw new Error('Keywords AI is not configured. Please set EXPO_PUBLIC_KEYWORDS_AI_API_KEY.');
  }

  const {
    model = KEYWORDS_AI_CONFIG.defaultModel,
    temperature = 0.7,
    maxTokens = 2048,
  } = options;

  try {
    const response = await fetch(`${KEYWORDS_AI_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEYWORDS_AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      // Silently handle API errors - don't expose to user
      await response.json().catch(() => ({}));
      throw new Error('AI_API_ERROR');
    }

    const data: KeywordsAIResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('AI_NO_RESPONSE');
    }

    return data.choices[0].message.content;
  } catch (error) {
    // Silent error handling - fallback will be used
    throw error;
  }
}

// ============================================================================
// AI-Powered Features for MealSwipe
// ============================================================================

/**
 * AI Meal Recommendations
 *
 * Generates personalized meal recommendations based on:
 * - User's taste profile (allergies, dietary restrictions, preferences)
 * - Historical swipe data (likes, dislikes, confidence levels)
 * - Current meal type being browsed
 *
 * Uses Keywords AI Prompt Management with prompt_id: meal_recommendation_v1
 */
export interface MealRecommendation {
  meal_id: string;
  name: string;
  confidence_score: number; // 0-1, how likely user will like this
  reason: string; // Brief explanation of why recommended
  meal_type: MealType;
}

export async function getAIMealRecommendations(
  tasteProfile: TasteProfile | null,
  swipeHistory: FoodSwipe[],
  availableMeals: Meal[],
  mealType: MealType,
  count: number = 5
): Promise<MealRecommendation[]> {
  console.log('🤖 Keywords AI: Generating meal recommendations via Gateway...');

  // Prepare variables for prompt template
  const variables = {
    allergies: tasteProfile?.hard_exclusions.allergies.join(', ') || 'None',
    dietary_restrictions: tasteProfile?.hard_exclusions.dietary_restrictions.join(', ') || 'None',
    disliked_ingredients: tasteProfile?.taste_profile.disliked_ingredients.join(', ') || 'None',
    preferred_cuisines: tasteProfile?.taste_profile.preferred_cuisines.join(', ') || 'Any',
    spice_tolerance: tasteProfile?.taste_profile.spice_tolerance || 'medium',
    adventure_level: tasteProfile?.taste_profile.adventure_level || 'balanced',
    max_cook_time: String(tasteProfile?.strategy_constraints.max_cook_time_minutes || 30),
    budget_range: tasteProfile?.strategy_constraints.budget_range || 'moderate',
    meal_type: mealType,
    liked_meals: swipeHistory
      .filter(s => s.swipe === 'right')
      .map(s => s.meal_id)
      .join(', ') || 'None yet',
    disliked_meals: swipeHistory
      .filter(s => s.swipe === 'left')
      .map(s => s.meal_id)
      .join(', ') || 'None yet',
    available_meals: JSON.stringify(
      availableMeals.map(m => ({
        id: m.meal_id,
        name: m.name,
        cuisine: m.cuisine,
        calories: m.calories,
        cook_time: m.cook_time_minutes,
      }))
    ),
    recommendation_count: String(count),
  };

  try {
    // Route through Keywords AI Gateway with Prompt Management
    const response = await callKeywordsAIGateway(
      {
        prompt_id: KEYWORDS_AI_CONFIG.promptIds.mealRecommendation,
        variables,
        override: true,
      },
      { temperature: 0.7 }
    );

    // Parse the AI response
    const recommendations = parseJSONResponse<MealRecommendation[]>(response);
    console.log('✅ Keywords AI: Received', recommendations.length, 'recommendations');
    return recommendations;
  } catch (error) {
    // Silent fallback - AI unavailable
    // Fallback: Return random meals from available list
    return availableMeals
      .filter(m => m.meal_type === mealType)
      .slice(0, count)
      .map(m => ({
        meal_id: m.meal_id,
        name: m.name,
        confidence_score: 0.5,
        reason: 'Based on your preferences',
        meal_type: m.meal_type,
      }));
  }
}

/**
 * AI Grocery List Generation
 *
 * Generates an organized grocery list from selected meals:
 * - Aggregates ingredients across all meals
 * - Organizes by store section (produce, dairy, etc.)
 * - Calculates quantities based on meal frequency
 * - Respects user's dietary restrictions
 *
 * Uses Keywords AI Prompt Management with prompt_id: grocery_list_generator_v1
 */
export interface GroceryItem {
  name: string;
  quantity: string;
  unit: string;
  category: string; // produce, dairy, meat, pantry, frozen, etc.
  estimated_price?: number;
}

export interface GroceryList {
  items: GroceryItem[];
  total_estimated_cost: number;
  categories: { [key: string]: GroceryItem[] };
  tips: string[]; // Budget-saving or shopping tips
}

export async function generateAIGroceryList(
  selectedMeals: Array<{ meal: Meal; quantity: number }>,
  tasteProfile: TasteProfile | null
): Promise<GroceryList> {
  console.log('🤖 Keywords AI: Generating grocery list via Gateway...');

  // Prepare meal data for the prompt
  const mealData = selectedMeals.map(({ meal, quantity }) => ({
    name: meal.name,
    quantity,
    ingredients: meal.ingredients,
  }));

  const variables = {
    meals_json: JSON.stringify(mealData),
    allergies: tasteProfile?.hard_exclusions.allergies.join(', ') || 'None',
    dietary_restrictions: tasteProfile?.hard_exclusions.dietary_restrictions.join(', ') || 'None',
    budget_range: tasteProfile?.strategy_constraints.budget_range || 'moderate',
    total_meal_count: String(selectedMeals.reduce((sum, m) => sum + m.quantity, 0)),
  };

  try {
    // Route through Keywords AI Gateway with Prompt Management
    const response = await callKeywordsAIGateway(
      {
        prompt_id: KEYWORDS_AI_CONFIG.promptIds.groceryList,
        variables,
        override: true,
      },
      { temperature: 0.3, maxTokens: 3000 }
    );

    const groceryList = parseJSONResponse<GroceryList>(response);
    console.log('✅ Keywords AI: Generated grocery list with', groceryList.items.length, 'items');
    return groceryList;
  } catch (error) {
    // Silent fallback - AI unavailable
    // Fallback: Basic ingredient extraction
    return generateBasicGroceryList(selectedMeals);
  }
}

/**
 * AI Meal Plan Insights
 *
 * Analyzes the user's meal plan to provide:
 * - Nutritional balance assessment
 * - Variety and cuisine diversity score
 * - Personalized tips for improvement
 * - Weekly prep suggestions
 *
 * Uses Keywords AI Prompt Management with prompt_id: meal_plan_insights_v1
 */
export interface MealPlanInsight {
  category: 'nutrition' | 'variety' | 'budget' | 'time' | 'tip';
  title: string;
  description: string;
  score?: number; // 0-100 for applicable categories
  emoji: string;
}

export interface MealPlanAnalysis {
  overall_score: number; // 0-100
  insights: MealPlanInsight[];
  weekly_prep_tips: string[];
  nutritional_summary: {
    total_calories: number;
    avg_calories_per_meal: number;
    cuisine_variety: string[];
    time_efficiency: string;
  };
}

export async function getAIMealPlanInsights(
  selectedMeals: Array<{ meal: Meal; quantity: number }>,
  tasteProfile: TasteProfile | null,
  weeklyGoal: number
): Promise<MealPlanAnalysis> {
  console.log('🤖 Keywords AI: Analyzing meal plan via Gateway...');

  const mealData = selectedMeals.map(({ meal, quantity }) => ({
    name: meal.name,
    meal_type: meal.meal_type,
    cuisine: meal.cuisine,
    calories: meal.calories,
    cook_time: meal.cook_time_minutes,
    quantity,
  }));

  const variables = {
    meals_json: JSON.stringify(mealData),
    weekly_goal: String(weeklyGoal),
    total_meals_planned: String(selectedMeals.reduce((sum, m) => sum + m.quantity, 0)),
    max_cook_time_preference: String(tasteProfile?.strategy_constraints.max_cook_time_minutes || 30),
    budget_preference: tasteProfile?.strategy_constraints.budget_range || 'moderate',
    adventure_level: tasteProfile?.taste_profile.adventure_level || 'balanced',
  };

  try {
    // Route through Keywords AI Gateway with Prompt Management
    const response = await callKeywordsAIGateway(
      {
        prompt_id: KEYWORDS_AI_CONFIG.promptIds.mealInsights,
        variables,
        override: true,
      },
      { temperature: 0.5, maxTokens: 2500 }
    );

    const analysis = parseJSONResponse<MealPlanAnalysis>(response);
    console.log('✅ Keywords AI: Meal plan analysis complete, score:', analysis.overall_score);
    return analysis;
  } catch (error) {
    // Silent fallback - AI unavailable
    // Fallback: Basic analysis
    return generateBasicMealPlanAnalysis(selectedMeals, weeklyGoal);
  }
}

/**
 * AI Recipe Adaptation
 *
 * Adapts a recipe based on user's dietary restrictions:
 * - Suggests ingredient substitutions
 * - Modifies cooking instructions
 * - Adjusts for allergies
 *
 * Uses Keywords AI Prompt Management with prompt_id: recipe_adaptation_v1
 */
export interface AdaptedRecipe {
  original_name: string;
  adapted_name: string;
  substitutions: Array<{
    original: string;
    replacement: string;
    reason: string;
  }>;
  adapted_ingredients: string[];
  adapted_instructions: string[];
  notes: string[];
}

export async function adaptRecipeForUser(
  meal: Meal,
  tasteProfile: TasteProfile
): Promise<AdaptedRecipe> {
  console.log('🤖 Keywords AI: Adapting recipe via Gateway...');

  const variables = {
    meal_name: meal.name,
    meal_ingredients: JSON.stringify(meal.ingredients),
    meal_instructions: JSON.stringify(meal.instructions),
    allergies: tasteProfile.hard_exclusions.allergies.join(', ') || 'None',
    dietary_restrictions: tasteProfile.hard_exclusions.dietary_restrictions.join(', ') || 'None',
    disliked_ingredients: tasteProfile.taste_profile.disliked_ingredients.join(', ') || 'None',
  };

  try {
    // Route through Keywords AI Gateway with Prompt Management
    const response = await callKeywordsAIGateway(
      {
        prompt_id: KEYWORDS_AI_CONFIG.promptIds.recipeAdaptation,
        variables,
        override: true,
      },
      { temperature: 0.4, maxTokens: 2000 }
    );

    const adaptedRecipe = parseJSONResponse<AdaptedRecipe>(response);
    console.log('✅ Keywords AI: Recipe adapted with', adaptedRecipe.substitutions.length, 'substitutions');
    return adaptedRecipe;
  } catch (error) {
    // Silent fallback - AI unavailable
    // Fallback: Return original recipe
    return {
      original_name: meal.name,
      adapted_name: meal.name,
      substitutions: [],
      adapted_ingredients: meal.ingredients,
      adapted_instructions: meal.instructions,
      notes: ['Unable to adapt recipe at this time'],
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Safely parse JSON from AI response
 * Handles markdown code blocks and various response formats
 */
function parseJSONResponse<T>(response: string): T {
  // Remove markdown code blocks if present
  let cleanedResponse = response.trim();

  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.slice(7);
  } else if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.slice(3);
  }

  if (cleanedResponse.endsWith('```')) {
    cleanedResponse = cleanedResponse.slice(0, -3);
  }

  cleanedResponse = cleanedResponse.trim();

  try {
    return JSON.parse(cleanedResponse);
  } catch (error) {
    // JSON parse failed - fallback will be used
    throw new Error('Invalid JSON response from AI');
  }
}

/**
 * Fallback: Generate basic grocery list without AI
 */
function generateBasicGroceryList(
  selectedMeals: Array<{ meal: Meal; quantity: number }>
): GroceryList {
  const ingredientMap = new Map<string, { quantity: number; category: string }>();

  selectedMeals.forEach(({ meal, quantity }) => {
    meal.ingredients.forEach(ingredient => {
      const existing = ingredientMap.get(ingredient);
      if (existing) {
        existing.quantity += quantity;
      } else {
        ingredientMap.set(ingredient, { quantity, category: 'grocery' });
      }
    });
  });

  const items: GroceryItem[] = Array.from(ingredientMap.entries()).map(([name, data]) => ({
    name,
    quantity: String(data.quantity),
    unit: 'item(s)',
    category: data.category,
  }));

  return {
    items,
    total_estimated_cost: items.length * 3, // Rough estimate
    categories: { grocery: items },
    tips: ['Check your pantry for items you may already have'],
  };
}

/**
 * Fallback: Generate basic meal plan analysis without AI
 */
function generateBasicMealPlanAnalysis(
  selectedMeals: Array<{ meal: Meal; quantity: number }>,
  weeklyGoal: number
): MealPlanAnalysis {
  const totalMeals = selectedMeals.reduce((sum, m) => sum + m.quantity, 0);
  const totalCalories = selectedMeals.reduce((sum, m) => sum + (m.meal.calories * m.quantity), 0);
  const cuisines = Array.from(new Set(selectedMeals.map(m => m.meal.cuisine)));
  const avgCookTime = selectedMeals.reduce((sum, m) => sum + m.meal.cook_time_minutes, 0) / selectedMeals.length;

  return {
    overall_score: Math.min(100, Math.round((totalMeals / weeklyGoal) * 80 + cuisines.length * 5)),
    insights: [
      {
        category: 'nutrition',
        title: 'Calorie Overview',
        description: `Your meal plan contains ${totalCalories} total calories across ${totalMeals} meals.`,
        score: 75,
        emoji: '🔥',
      },
      {
        category: 'variety',
        title: 'Cuisine Variety',
        description: `You have ${cuisines.length} different cuisines in your plan.`,
        score: Math.min(100, cuisines.length * 20),
        emoji: '🌍',
      },
    ],
    weekly_prep_tips: [
      'Consider prepping ingredients on Sunday for the week ahead',
      'Store prepped vegetables in airtight containers',
    ],
    nutritional_summary: {
      total_calories: totalCalories,
      avg_calories_per_meal: Math.round(totalCalories / totalMeals),
      cuisine_variety: cuisines,
      time_efficiency: avgCookTime < 30 ? 'Efficient' : 'Moderate',
    },
  };
}

// Export configuration for debugging
export const getKeywordsAIConfig = () => ({
  isConfigured: isKeywordsAIConfigured(),
  baseUrl: KEYWORDS_AI_CONFIG.baseUrl,
  model: KEYWORDS_AI_CONFIG.defaultModel,
  promptIds: KEYWORDS_AI_CONFIG.promptIds,
});
