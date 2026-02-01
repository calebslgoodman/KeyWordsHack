import { MEALS } from '../data/meals';
import { Meal, TasteProfile } from '../types';

/**
 * ========================================
 * KEYWORDS AI INTEGRATION
 * ========================================
 *
 * This integration uses:
 * 1. Keywords AI Gateway - Routes all LLM calls through api.keywordsai.co
 * 2. Keywords AI Prompt Management - All prompts are centralized, versioned, and deployed
 *
 * NO prompts are hardcoded. All prompt logic is managed through the Keywords AI dashboard.
 */

const KEYWORDS_AI_API_KEY = process.env.EXPO_PUBLIC_KEYWORDS_AI_API_KEY;
const KEYWORDS_AI_BASE_URL = 'https://api.keywordsai.co/api';

// Prompt IDs - these reference prompts created in Keywords AI dashboard
const PROMPT_IDS = {
  MEAL_RECOMMENDATIONS: process.env.EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_RECS || process.env.EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID,
  CUSTOM_RECIPE: process.env.EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_CUSTOM_RECIPE,
  MEAL_VARIATION: process.env.EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_VARIATION,
};

/**
 * Keywords AI Request Format
 *
 * When using prompt management, we send:
 * - model: placeholder (will be overridden by prompt config)
 * - messages: placeholder (will be overridden by prompt)
 * - prompt: { prompt_id, variables, override: true }
 *
 * The `override: true` ensures the centralized prompt controls everything.
 */
interface KeywordsAIPromptRequest {
  model: string; // Placeholder - overridden by prompt config
  messages: Array<{ role: string; content: string }>; // Placeholder - overridden by prompt
  prompt: {
    prompt_id: string; // References prompt in Keywords AI dashboard
    variables: Record<string, string>; // Dynamic values injected into prompt template
    override: boolean; // true = use prompt config instead of SDK parameters
  };
}

interface KeywordsAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string; // Which model was actually used (from prompt config)
}

/**
 * Call Keywords AI Gateway with Prompt Management
 *
 * This is the ONLY function that calls the LLM. All inference goes through Keywords AI Gateway.
 *
 * @param promptId - ID of the prompt created in Keywords AI dashboard
 * @param variables - Dynamic values to inject into the prompt template
 * @returns AI-generated response text
 */
async function callKeywordsAIWithPrompt(
  promptId: string,
  variables: Record<string, string>
): Promise<string> {
  if (!KEYWORDS_AI_API_KEY) {
    console.warn('⚠️ Keywords AI API key not configured');
    return '';
  }

  if (!promptId) {
    console.warn('⚠️ No prompt ID provided');
    return '';
  }

  console.log('🚀 Keywords AI Gateway Request:');
  console.log('   Prompt ID:', promptId);
  console.log('   Variables:', Object.keys(variables).join(', '));

  try {
    const requestBody: KeywordsAIPromptRequest = {
      // Placeholder values - will be overridden by prompt config
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'placeholder' }],

      // Prompt management configuration
      prompt: {
        prompt_id: promptId,
        variables: variables,
        override: true, // CRITICAL: Use prompt config instead of SDK parameters
      },
    };

    const response = await fetch(`${KEYWORDS_AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEYWORDS_AI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Keywords AI API error:', error);
      throw new Error(`Keywords AI API error: ${response.status} - ${error}`);
    }

    const data: KeywordsAIResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';

    console.log('✅ Keywords AI Response received');
    console.log('   Model used:', data.model || 'unknown');
    console.log('   Tokens:', data.usage?.total_tokens || 'unknown');

    return content;
  } catch (error) {
    console.error('❌ Error calling Keywords AI Gateway:', error);
    throw error;
  }
}

/**
 * Generate personalized meal recommendations based on user taste profile
 *
 * This uses Keywords AI Prompt Management - NO hardcoded prompts!
 * The prompt template is created and versioned in the Keywords AI dashboard.
 *
 * Prompt variables injected:
 * - allergies, dietary_restrictions, disliked_ingredients
 * - cuisines, spice_level, adventure_level
 * - max_cook_time, budget, kitchen_tools
 * - meals_count (number of meals to generate)
 *
 * @param tasteProfile - User's taste preferences from onboarding
 * @param mealsToGenerate - Number of meal recommendations to generate
 * @returns Array of AI-generated personalized meals
 */
export async function generateMealRecommendations(
  tasteProfile: TasteProfile,
  mealsToGenerate: number = 5
): Promise<Meal[]> {
  const promptId = PROMPT_IDS.MEAL_RECOMMENDATIONS;

  if (!promptId) {
    console.warn('⚠️ Meal recommendations prompt not configured - skipping AI generation');
    return MEALS.slice(0, mealsToGenerate);
  }

  const { hard_exclusions, taste_profile, strategy_constraints } = tasteProfile;

  console.log('🍽️ Generating', mealsToGenerate, 'personalized meals via Keywords AI...');

  try {
    // Call Keywords AI Gateway with ONLY variables - no hardcoded prompts!
    const response = await callKeywordsAIWithPrompt(promptId, {
      // User constraints (hard exclusions)
      allergies: hard_exclusions.allergies.join(', ') || 'None',
      dietary_restrictions: hard_exclusions.dietary_restrictions.join(', ') || 'None',

      // Taste preferences
      disliked_ingredients: taste_profile.disliked_ingredients.join(', ') || 'None',
      cuisines: taste_profile.preferred_cuisines.join(', ') || 'Any',
      spice_level: taste_profile.spice_tolerance,
      adventure_level: taste_profile.adventure_level,

      // Strategy constraints
      max_cook_time: strategy_constraints.max_cook_time_minutes.toString(),
      budget: strategy_constraints.budget_range,
      kitchen_tools: strategy_constraints.kitchen_tools.join(', ') || 'Basic tools',

      // Generation parameter
      meals_count: mealsToGenerate.toString(),
    });

    // Parse the AI response (should be JSON array from prompt template)
    const aiMeals = JSON.parse(response);

    if (!Array.isArray(aiMeals)) {
      console.error('❌ AI response is not an array:', response);
      return MEALS.slice(0, mealsToGenerate);
    }

    console.log('✅ Generated', aiMeals.length, 'AI meals successfully');

    // Transform AI response to Meal format
    return aiMeals.map((meal: any, index: number) => ({
      meal_id: `ai_${Date.now()}_${index}`,
      name: meal.name,
      image_url: meal.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop`,
      meal_type: meal.meal_type || 'dinner',
      cuisine: meal.cuisine,
      description: meal.description,
      calories: meal.calories || 500,
      cook_time_minutes: meal.cook_time_minutes || 30,
      ingredients: meal.ingredients || [],
      instructions: meal.instructions || [],
    }));
  } catch (error) {
    console.error('❌ Error generating meal recommendations:', error);
    console.log('   Falling back to hardcoded meals');
    // Graceful fallback to existing meals
    return MEALS.slice(0, mealsToGenerate);
  }
}

/**
 * Generate a custom recipe based on available ingredients
 *
 * Uses Keywords AI Prompt Management for recipe generation.
 *
 * Prompt variables:
 * - ingredients (comma-separated list)
 * - dietary_restrictions
 * - max_cook_time
 *
 * @param ingredients - List of available ingredients
 * @param dietary_restrictions - Any dietary restrictions to respect
 * @param max_cook_time - Maximum cooking time in minutes
 * @returns A custom AI-generated meal recipe
 */
export async function generateCustomRecipe(
  ingredients: string[],
  dietary_restrictions: string[] = [],
  max_cook_time: number = 30
): Promise<Meal | null> {
  const promptId = PROMPT_IDS.CUSTOM_RECIPE;

  if (!promptId) {
    console.warn('⚠️ Custom recipe prompt not configured - feature unavailable');
    return null;
  }

  console.log('🍳 Generating custom recipe from ingredients via Keywords AI...');

  try {
    // Call Keywords AI Gateway with ONLY variables
    const response = await callKeywordsAIWithPrompt(promptId, {
      ingredients: ingredients.join(', '),
      dietary_restrictions: dietary_restrictions.join(', ') || 'None',
      max_cook_time: max_cook_time.toString(),
    });

    const recipe = JSON.parse(response);

    console.log('✅ Custom recipe generated:', recipe.name);

    return {
      meal_id: `custom_${Date.now()}`,
      name: recipe.name,
      image_url: recipe.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop`,
      meal_type: recipe.meal_type || 'dinner',
      cuisine: recipe.cuisine || 'Custom',
      description: recipe.description,
      calories: recipe.calories || 500,
      cook_time_minutes: recipe.cook_time_minutes || max_cook_time,
      ingredients: recipe.ingredients || ingredients,
      instructions: recipe.instructions || [],
    };
  } catch (error) {
    console.error('❌ Error generating custom recipe:', error);
    return null;
  }
}

/**
 * Get meal variation/alternative for a specific meal
 *
 * Uses Keywords AI Prompt Management to create variations.
 *
 * Prompt variables:
 * - original_meal_name, original_cuisine, original_description
 * - allergies, dietary_restrictions
 * - target_cook_time
 *
 * @param originalMeal - The meal to create a variation of
 * @param tasteProfile - Optional taste profile for personalization
 * @returns A variation of the original meal
 */
export async function getMealVariation(
  originalMeal: Meal,
  tasteProfile?: Partial<TasteProfile>
): Promise<Meal | null> {
  const promptId = PROMPT_IDS.MEAL_VARIATION;

  if (!promptId) {
    console.warn('⚠️ Meal variation prompt not configured - feature unavailable');
    return null;
  }

  console.log('🔄 Generating variation of', originalMeal.name, 'via Keywords AI...');

  const restrictions = tasteProfile?.hard_exclusions || { allergies: [], dietary_restrictions: [] };

  try {
    // Call Keywords AI Gateway with ONLY variables
    const response = await callKeywordsAIWithPrompt(promptId, {
      original_meal_name: originalMeal.name,
      original_cuisine: originalMeal.cuisine,
      original_description: originalMeal.description,
      allergies: restrictions.allergies.join(', ') || 'None',
      dietary_restrictions: restrictions.dietary_restrictions.join(', ') || 'None',
      target_cook_time: originalMeal.cook_time_minutes.toString(),
    });

    const variation = JSON.parse(response);

    console.log('✅ Meal variation generated:', variation.name);

    return {
      meal_id: `variation_${originalMeal.meal_id}_${Date.now()}`,
      name: variation.name,
      image_url: variation.image_url || originalMeal.image_url,
      meal_type: originalMeal.meal_type,
      cuisine: variation.cuisine || originalMeal.cuisine,
      description: variation.description,
      calories: variation.calories || originalMeal.calories,
      cook_time_minutes: variation.cook_time_minutes || originalMeal.cook_time_minutes,
      ingredients: variation.ingredients || [],
      instructions: variation.instructions || [],
    };
  } catch (error) {
    console.error('❌ Error generating meal variation:', error);
    return null;
  }
}

export const isAIConfigured = (): boolean => {
  return !!KEYWORDS_AI_API_KEY;
};
