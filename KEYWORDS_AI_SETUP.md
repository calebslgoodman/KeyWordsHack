# Keywords AI Integration Guide for MealSwipe

This document provides complete instructions for setting up Keywords AI Gateway and Prompt Management for the MealSwipe hackathon project.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MealSwipe Mobile App                            │
│                      (React Native + Expo)                              │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Keywords AI Gateway                                  │
│              https://api.keywordsai.co/api/chat/completions             │
│                                                                          │
│  Features Used:                                                          │
│  ✓ Unified API for 250+ LLMs (using Gemini 1.5 Flash)                  │
│  ✓ Prompt Management (versioned, deployed prompts)                      │
│  ✓ Variable substitution in prompts                                     │
│  ✓ Request monitoring and analytics                                     │
│  ✓ Automatic fallback handling                                          │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Google Gemini 1.5 Flash                              │
│              (LLM Provider via Keywords AI Gateway)                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Keywords AI Account**: Create an account at https://platform.keywordsai.co
2. **API Key**: Generate an API key from the API Keys page
3. **Gemini API Key**: Add your Google Gemini API key to Keywords AI credentials

## Environment Configuration

Add these variables to your `.env` file:

```bash
# Keywords AI Gateway Configuration
EXPO_PUBLIC_KEYWORDS_AI_API_KEY=your_keywords_ai_api_key_here
EXPO_PUBLIC_KEYWORDS_AI_BASE_URL=https://api.keywordsai.co/api

# Keywords AI Prompt IDs (create these on the platform)
EXPO_PUBLIC_PROMPT_MEAL_RECOMMENDATION=meal_recommendation_v1
EXPO_PUBLIC_PROMPT_GROCERY_LIST=grocery_list_generator_v1
EXPO_PUBLIC_PROMPT_MEAL_INSIGHTS=meal_plan_insights_v1
EXPO_PUBLIC_PROMPT_RECIPE_ADAPTATION=recipe_adaptation_v1
```

---

## Prompt Setup on Keywords AI Platform

### Prompt 1: Meal Recommendation (`meal_recommendation_v1`)

**Purpose**: Generate personalized meal recommendations based on user preferences and swipe history.

**Navigate to**: Prompts > Create New Prompt

**Configuration**:
- **Name**: `meal_recommendation_v1`
- **Description**: Generates personalized meal recommendations for users based on their dietary preferences, restrictions, and historical swipe data.
- **Model**: `gemini/gemini-1.5-flash`
- **Temperature**: 0.7
- **Max Tokens**: 2048

**System Message**:
```
You are a personalized meal recommendation AI for a food matching app. Your role is to analyze user preferences and suggest meals they will enjoy.

User Profile:
- Allergies: {{allergies}}
- Dietary Restrictions: {{dietary_restrictions}}
- Disliked Ingredients: {{disliked_ingredients}}
- Preferred Cuisines: {{preferred_cuisines}}
- Spice Tolerance: {{spice_tolerance}}
- Adventure Level: {{adventure_level}}
- Max Cook Time: {{max_cook_time}} minutes
- Budget: {{budget_range}}

Swipe History:
- Liked Meals: {{liked_meals}}
- Disliked Meals: {{disliked_meals}}

Available Meals for {{meal_type}}:
{{available_meals}}

Generate {{recommendation_count}} meal recommendations. For each recommendation, provide:
1. meal_id (from the available meals)
2. name
3. confidence_score (0-1, how likely user will enjoy)
4. reason (brief personalized explanation, max 50 chars)
5. meal_type

IMPORTANT: Return ONLY valid JSON array, no markdown formatting.
```

**User Message**:
```
Based on my preferences and history, recommend {{recommendation_count}} {{meal_type}} meals from the available options.
```

**Expected Output Format**:
```json
[
  {
    "meal_id": "breakfast_001",
    "name": "Avocado Toast",
    "confidence_score": 0.92,
    "reason": "Matches your love for Mediterranean cuisine",
    "meal_type": "breakfast"
  }
]
```

---

### Prompt 2: Grocery List Generator (`grocery_list_generator_v1`)

**Purpose**: Generate organized shopping lists from selected meal plans.

**Configuration**:
- **Name**: `grocery_list_generator_v1`
- **Description**: Generates organized grocery lists with category grouping and budget estimates.
- **Model**: `gemini/gemini-1.5-flash`
- **Temperature**: 0.3
- **Max Tokens**: 3000

**System Message**:
```
You are a smart grocery list generator for a meal planning app. Create organized shopping lists that are easy to navigate in a store.

User Context:
- Allergies: {{allergies}}
- Dietary Restrictions: {{dietary_restrictions}}
- Budget Preference: {{budget_range}}
- Total Meals Planned: {{total_meal_count}}

Selected Meals:
{{meals_json}}

Generate a comprehensive grocery list that:
1. Aggregates ingredients across all meals
2. Calculates appropriate quantities based on meal frequency
3. Organizes items by store section (produce, dairy, meat, pantry, frozen, bakery, other)
4. Provides estimated costs when possible
5. Includes 2-3 budget-saving tips

IMPORTANT: Return ONLY valid JSON, no markdown formatting.
```

**User Message**:
```
Generate a complete grocery list for my meal plan.
```

**Expected Output Format**:
```json
{
  "items": [
    {
      "name": "Eggs",
      "quantity": "12",
      "unit": "large eggs",
      "category": "dairy",
      "estimated_price": 4.99
    }
  ],
  "total_estimated_cost": 85.50,
  "categories": {
    "produce": [...],
    "dairy": [...],
    "meat": [...],
    "pantry": [...]
  },
  "tips": [
    "Buy seasonal produce for better prices",
    "Check for store brand alternatives"
  ]
}
```

---

### Prompt 3: Meal Plan Insights (`meal_plan_insights_v1`)

**Purpose**: Analyze meal plans and provide nutritional/variety insights.

**Configuration**:
- **Name**: `meal_plan_insights_v1`
- **Description**: Analyzes weekly meal plans and provides personalized insights and recommendations.
- **Model**: `gemini/gemini-1.5-flash`
- **Temperature**: 0.5
- **Max Tokens**: 2500

**System Message**:
```
You are a nutritional analyst and meal planning advisor. Analyze the user's meal plan and provide actionable insights.

User Preferences:
- Weekly Meal Goal: {{weekly_goal}} meals
- Max Cook Time Preference: {{max_cook_time_preference}} minutes
- Budget Preference: {{budget_preference}}
- Adventure Level: {{adventure_level}}

Current Meal Plan:
{{meals_json}}

Total Meals Planned: {{total_meals_planned}}

Analyze the meal plan and provide:
1. Overall score (0-100) based on nutrition, variety, and alignment with preferences
2. 3-4 insights covering nutrition, variety, budget, and time efficiency
3. 2-3 weekly prep tips to make cooking easier
4. Nutritional summary with calorie totals and cuisine variety

For each insight, include:
- category (nutrition, variety, budget, time, or tip)
- title (short, catchy)
- description (actionable, 1-2 sentences)
- score (0-100, if applicable)
- emoji (relevant to the category)

IMPORTANT: Return ONLY valid JSON, no markdown formatting.
```

**User Message**:
```
Analyze my weekly meal plan and provide insights.
```

**Expected Output Format**:
```json
{
  "overall_score": 82,
  "insights": [
    {
      "category": "nutrition",
      "title": "Balanced Macros",
      "description": "Your meals provide a good balance of proteins, carbs, and healthy fats.",
      "score": 85,
      "emoji": "💪"
    },
    {
      "category": "variety",
      "title": "Cuisine Diversity",
      "description": "Great job including 4 different cuisines! Consider adding Asian options.",
      "score": 75,
      "emoji": "🌍"
    }
  ],
  "weekly_prep_tips": [
    "Prep vegetables on Sunday for faster weeknight cooking",
    "Make a double batch of grains to use throughout the week"
  ],
  "nutritional_summary": {
    "total_calories": 12500,
    "avg_calories_per_meal": 625,
    "cuisine_variety": ["Italian", "Mexican", "American", "Mediterranean"],
    "time_efficiency": "Efficient"
  }
}
```

---

### Prompt 4: Recipe Adaptation (`recipe_adaptation_v1`)

**Purpose**: Adapt recipes for dietary restrictions and ingredient substitutions.

**Configuration**:
- **Name**: `recipe_adaptation_v1`
- **Description**: Adapts recipes to accommodate user allergies, dietary restrictions, and ingredient preferences.
- **Model**: `gemini/gemini-1.5-flash`
- **Temperature**: 0.4
- **Max Tokens**: 2000

**System Message**:
```
You are a culinary expert specializing in recipe adaptation. Modify recipes to accommodate dietary needs while maintaining flavor and nutritional value.

User Restrictions:
- Allergies: {{allergies}}
- Dietary Restrictions: {{dietary_restrictions}}
- Disliked Ingredients: {{disliked_ingredients}}

Original Recipe:
- Name: {{meal_name}}
- Ingredients: {{meal_ingredients}}
- Instructions: {{meal_instructions}}

Adapt this recipe by:
1. Identifying problematic ingredients
2. Suggesting appropriate substitutions with explanations
3. Modifying instructions if needed
4. Adding notes for best results

IMPORTANT: Return ONLY valid JSON, no markdown formatting.
```

**User Message**:
```
Please adapt this recipe for my dietary needs.
```

**Expected Output Format**:
```json
{
  "original_name": "Classic Pancakes",
  "adapted_name": "Gluten-Free Oat Pancakes",
  "substitutions": [
    {
      "original": "All-purpose flour",
      "replacement": "Oat flour",
      "reason": "Gluten-free alternative with similar texture"
    }
  ],
  "adapted_ingredients": [
    "1 cup oat flour",
    "1 egg",
    "1 cup almond milk"
  ],
  "adapted_instructions": [
    "Mix dry ingredients in a bowl",
    "Whisk wet ingredients separately",
    "Combine and cook on medium heat"
  ],
  "notes": [
    "Oat pancakes may be slightly denser",
    "Let batter rest 5 minutes for fluffier results"
  ]
}
```

---

## Deploying Prompts

For each prompt:

1. **Create**: Go to Prompts > Create New Prompt
2. **Configure**: Enter the name, description, and content as specified above
3. **Add Variables**: The platform will auto-detect `{{variable}}` patterns
4. **Test**: Use the Test tab to verify with sample data
5. **Commit**: Click "Commit" with a descriptive message (e.g., "Initial version")
6. **Deploy**: Go to Deployments tab and click "Deploy to Production"

## API Integration Flow

```typescript
// Example: How MealSwipe calls Keywords AI Gateway

const response = await fetch('https://api.keywordsai.co/api/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${KEYWORDS_AI_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gemini/gemini-1.5-flash',
    messages: [{ role: 'user', content: 'placeholder' }],
    // Keywords AI Prompt Management
    prompt: {
      prompt_id: 'meal_recommendation_v1',
      variables: {
        allergies: 'Peanuts, Tree Nuts',
        dietary_restrictions: 'Vegetarian',
        preferred_cuisines: 'Italian, Mexican',
        // ... other variables
      },
      override: true, // Use prompt config from platform
    },
  }),
});
```

## Monitoring & Analytics

After deployment, monitor your prompts via Keywords AI dashboard:

1. **Logs**: View all API calls, latency, and token usage
2. **Performance**: Track response times and success rates
3. **Cost**: Monitor token consumption per prompt
4. **Filter by Prompt**: Analyze specific prompt performance

---

## Files Modified for Integration

| File | Purpose |
|------|---------|
| `.env` | Keywords AI credentials and prompt IDs |
| `src/lib/keywords-ai.ts` | Core gateway service layer |
| `src/types/index.ts` | TypeScript types for AI responses |
| `src/screens/SwipeScreen.tsx` | AI recommendation banner |
| `src/screens/MealPlanSummaryScreen.tsx` | AI insights & grocery list |

## Hackathon Submission Checklist

- [x] All LLM calls routed through Keywords AI Gateway
- [x] Prompts managed via Keywords AI Prompt Management
- [x] Variable substitution used (not hardcoded prompts)
- [x] Multiple AI features implemented:
  - Personalized meal recommendations
  - AI-powered grocery list generation
  - Meal plan insights and analysis
  - Recipe adaptation (framework ready)
- [x] Proper error handling with fallbacks
- [x] TypeScript types for all AI responses
- [x] Clean separation of concerns (service layer pattern)

## Testing the Integration

1. Set up your `.env` with valid API keys
2. Create all 4 prompts on Keywords AI platform
3. Deploy prompts to production
4. Run the app: `npm start`
5. Complete onboarding to generate taste profile
6. Swipe on meals to see AI recommendations
7. Review meal plan to see AI insights and grocery list

---

**Keywords AI Resources**:
- Documentation: https://docs.keywordsai.co
- Platform: https://platform.keywordsai.co
- API Reference: https://docs.keywordsai.co/api-reference
