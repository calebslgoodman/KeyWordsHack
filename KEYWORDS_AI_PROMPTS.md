# Keywords AI Prompt Templates

This document contains all the prompts you need to create in the Keywords AI dashboard for this hackathon project.

## Important: Prompt Management Integration

This app uses **Keywords AI Prompt Management** - NO prompts are hardcoded in the application code. All prompt logic, model selection, and parameters are controlled through the Keywords AI dashboard.

## Required Prompts

You need to create **3 prompts** in your Keywords AI dashboard:

---

## 1. Meal Recommendations Prompt

**Name:** `meal-recommendations-v1`

**Description:** Generate personalized meal recommendations based on user taste profile and dietary constraints.

### Configuration

**Model:** `gemini-2.0-flash-exp` (or your preferred model)
**Temperature:** `0.8`
**Max Tokens:** `2500`
**Top P:** `0.95`

### Prompt Template

**System Message:**
```
You are a creative chef and meal planning expert. Your job is to generate personalized, delicious meal recommendations that respect the user's preferences and constraints.

CRITICAL RULES:
1. NEVER suggest meals containing ingredients the user is allergic to
2. STRICTLY respect all dietary restrictions (vegan, vegetarian, kosher, halal, etc.)
3. Avoid disliked ingredients whenever possible
4. Match the spice level preference exactly
5. Stay within the maximum cooking time
6. Suggest diverse meal types (breakfast, lunch, dinner)
7. Consider the user's adventure level (safe = familiar dishes, exploratory = unique cuisines)
8. Respect budget constraints (budget = cheap ingredients, flexible = premium allowed)
9. Only suggest meals that can be made with available kitchen tools

OUTPUT FORMAT REQUIREMENT:
Return ONLY a valid JSON array. No additional text, explanations, or markdown formatting.
```

**User Message:**
```
Generate {{meals_count}} personalized meal recommendations for a user with these preferences:

USER CONSTRAINTS (MUST RESPECT):
- Allergies: {{allergies}}
- Dietary Restrictions: {{dietary_restrictions}}
- Disliked Ingredients: {{disliked_ingredients}}

TASTE PREFERENCES:
- Preferred Cuisines: {{cuisines}}
- Spice Tolerance: {{spice_level}}
- Adventure Level: {{adventure_level}}

PRACTICAL CONSTRAINTS:
- Maximum Cook Time: {{max_cook_time}} minutes
- Budget Level: {{budget}}
- Available Kitchen Tools: {{kitchen_tools}}

For each meal, return a JSON object with these EXACT fields:
{
  "name": "Dish name",
  "meal_type": "breakfast" | "lunch" | "dinner",
  "cuisine": "Cuisine type",
  "description": "2-3 sentence description",
  "calories": 450,
  "cook_time_minutes": 25,
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["Step 1", "Step 2", ...]
}

Return as a JSON array: [meal1, meal2, meal3, ...]
```

### Variables to Define

When creating this prompt in Keywords AI, add these variables:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `allergies` | `Peanuts, Shellfish` | Comma-separated list of allergies |
| `dietary_restrictions` | `Vegetarian, Halal` | Comma-separated dietary restrictions |
| `disliked_ingredients` | `Cilantro, Mushrooms` | Ingredients user dislikes |
| `cuisines` | `Italian, Mexican, Thai` | Preferred cuisine types |
| `spice_level` | `mild` | none, mild, medium, hot |
| `adventure_level` | `balanced` | safe, balanced, exploratory |
| `max_cook_time` | `30` | Maximum cooking time in minutes |
| `budget` | `moderate` | budget, moderate, flexible |
| `kitchen_tools` | `Stovetop, Oven, Microwave` | Available cooking equipment |
| `meals_count` | `10` | Number of meals to generate |

### Testing Your Prompt

In the Keywords AI dashboard:
1. Add test values for all variables
2. Click "Run" to test the prompt
3. Verify the response is valid JSON
4. Check that meals respect all constraints
5. Commit your changes with a message like "Initial meal recommendations prompt"
6. Deploy to production environment

---

## 2. Custom Recipe Prompt

**Name:** `custom-recipe-from-ingredients-v1`

**Description:** Generate a recipe using specific ingredients the user has available.

### Configuration

**Model:** `gemini-2.0-flash-exp`
**Temperature:** `0.9` (higher for creativity)
**Max Tokens:** `2000`
**Top P:** `0.95`

### Prompt Template

**System Message:**
```
You are a creative chef specializing in improvised cooking. Your job is to create delicious recipes using whatever ingredients the user has available.

RULES:
1. Use ALL the ingredients provided whenever possible
2. Respect dietary restrictions strictly
3. Stay within the time limit
4. Add common pantry staples (salt, pepper, oil) as needed
5. Provide clear, step-by-step instructions
6. Be creative but practical

OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown, no extra text.
```

**User Message:**
```
Create a delicious recipe using these ingredients:
{{ingredients}}

CONSTRAINTS:
- Dietary Restrictions: {{dietary_restrictions}}
- Maximum Cook Time: {{max_cook_time}} minutes

Return a JSON object with these fields:
{
  "name": "Recipe name",
  "meal_type": "breakfast" | "lunch" | "dinner",
  "cuisine": "Cuisine style",
  "description": "Brief description",
  "calories": 500,
  "cook_time_minutes": 25,
  "ingredients": ["full ingredient list with measurements"],
  "instructions": ["Step 1", "Step 2", ...]
}
```

### Variables to Define

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `ingredients` | `Chicken, Rice, Broccoli, Garlic` | Available ingredients |
| `dietary_restrictions` | `None` | Dietary restrictions to respect |
| `max_cook_time` | `30` | Maximum cooking time |

### Testing Your Prompt

1. Test with various ingredient combinations
2. Verify JSON format is correct
3. Check that all provided ingredients are used
4. Commit and deploy

---

## 3. Meal Variation Prompt

**Name:** `meal-variation-generator-v1`

**Description:** Generate a variation of an existing meal while maintaining its spirit.

### Configuration

**Model:** `gemini-2.0-flash-exp`
**Temperature:** `0.85` (creative but consistent)
**Max Tokens:** `1500`
**Top P:** `0.9`

### Prompt Template

**System Message:**
```
You are a creative chef who specializes in creating variations of popular dishes. Your variations maintain the spirit of the original while offering something new and exciting.

RULES:
1. Keep the same meal type (breakfast/lunch/dinner)
2. Stay close to the original cook time
3. Respect all allergies and dietary restrictions
4. Maintain similar flavor profiles but add a twist
5. Suggest ingredient swaps or cooking method changes
6. Keep it practical and achievable

OUTPUT FORMAT:
Return ONLY a valid JSON object.
```

**User Message:**
```
Create a variation of this meal:

ORIGINAL MEAL:
- Name: {{original_meal_name}}
- Cuisine: {{original_cuisine}}
- Description: {{original_description}}

CONSTRAINTS:
- Allergies to Avoid: {{allergies}}
- Dietary Restrictions: {{dietary_restrictions}}
- Target Cook Time: ~{{target_cook_time}} minutes

Create a variation that's different but related. Return JSON:
{
  "name": "Variation name (different from original)",
  "cuisine": "Cuisine (can be different)",
  "description": "How this differs from original",
  "calories": 450,
  "cook_time_minutes": 30,
  "ingredients": ["full list"],
  "instructions": ["Step 1", "Step 2", ...]
}
```

### Variables to Define

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `original_meal_name` | `Chicken Tikka Masala` | Name of original meal |
| `original_cuisine` | `Indian` | Original cuisine type |
| `original_description` | `Creamy tomato curry...` | Original meal description |
| `allergies` | `None` | Allergies to avoid |
| `dietary_restrictions` | `None` | Dietary restrictions |
| `target_cook_time` | `35` | Similar cook time |

### Testing Your Prompt

1. Test with various original meals
2. Verify variations are meaningfully different
3. Check JSON format
4. Commit and deploy

---

## Setup Instructions

### Step 1: Create Each Prompt

For each of the 3 prompts above:

1. Go to Keywords AI dashboard → **Prompts**
2. Click **"Create New Prompt"**
3. Enter the **Name** exactly as shown
4. Add **Description**
5. Configure **Model**, **Temperature**, and **Max Tokens**
6. Add **System Message** and **User Message** from templates above
7. Define all **Variables** (double curly braces: `{{variable_name}}`)
8. Add test values for each variable
9. Click **"Run"** to test
10. Fix any issues
11. Click **"Commit"** with a descriptive message
12. Click **"Deploy"** to production

### Step 2: Get Prompt IDs

After creating each prompt:

1. Go to the prompt's **Overview** tab
2. Copy the **Prompt ID** (usually 6 characters like `042f5f`)
3. Note which prompt it belongs to:
   - Meal Recommendations → `PROMPT_ID_MEAL_RECS`
   - Custom Recipe → `PROMPT_ID_CUSTOM_RECIPE`
   - Meal Variation → `PROMPT_ID_MEAL_VARIATION`

### Step 3: Add to Environment Variables

Update your `.env` file:

```bash
# Keywords AI Configuration
EXPO_PUBLIC_KEYWORDS_AI_API_KEY=your_actual_api_key_here

# Prompt IDs (get from Keywords AI dashboard)
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_RECS=abc123
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_CUSTOM_RECIPE=def456
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_VARIATION=ghi789
```

**Note:** If you only create the meal recommendations prompt for now, the app will gracefully degrade - custom recipe and meal variation features will be disabled but the main flow will work.

### Step 4: Restart Your App

```bash
npm start
```

---

## Prompt Versioning & Deployment

### Why Centralized Prompts?

1. **No Code Changes:** Update prompts without rebuilding the app
2. **A/B Testing:** Deploy different versions to test vs prod
3. **Version History:** Track all changes with commit messages
4. **Collaboration:** Team members can review and edit prompts
5. **Monitoring:** See prompt performance in Keywords AI dashboard

### Versioning Best Practices

- Use descriptive commit messages: "Added allergy handling", "Improved JSON formatting"
- Test thoroughly before deploying to production
- Use separate API keys for test vs production environments
- Monitor logs to see which prompt versions are being used

### Updating Prompts

To update a prompt:

1. Go to the prompt in Keywords AI dashboard
2. Click **Edit**
3. Make your changes
4. Click **Run** to test
5. Click **Commit** with a message describing changes
6. Click **Deploy** when ready

The app will immediately use the new version - no code changes needed!

---

## Monitoring & Debugging

### View Prompt Usage

In Keywords AI dashboard:
- Go to **Logs** page
- Filter by prompt name
- See all requests with variables used
- Check response times and token usage

### Common Issues

**Issue:** Prompt not found error
**Solution:** Verify prompt ID in `.env` matches the one in Keywords AI dashboard

**Issue:** Invalid JSON response
**Solution:** Update prompt to emphasize "Return ONLY valid JSON, no markdown"

**Issue:** Variables not substituting
**Solution:** Ensure variable names match exactly (use underscores, not spaces)

**Issue:** Prompts using wrong model
**Solution:** Check prompt configuration in dashboard, ensure `override: true` is set in code

---

## Cost Optimization

### Model Selection

- `gemini-2.0-flash-exp`: Fast, cheap, good quality (~$0.0001/request)
- `gpt-4o-mini`: Slightly more expensive, very reliable
- `claude-3-5-haiku`: Fast, creative, moderate cost

Change model in prompt configuration without code changes!

### Token Optimization

Monitor token usage in Keywords AI dashboard:
- Average tokens per request
- Most expensive prompts
- Total cost breakdown

Reduce tokens by:
- Shortening prompt instructions
- Reducing max_tokens if outputs are too long
- Using more concise variable values

---

## For Hackathon Judges

This implementation demonstrates **meaningful integration** of Keywords AI:

### Gateway Usage
✅ ALL LLM calls route through `https://api.keywordsai.co/api/chat/completions`
✅ No direct calls to OpenAI, Google, or other providers
✅ Unified API for 250+ models with fallback, caching, and optimization

### Prompt Management
✅ ZERO hardcoded prompts in application code
✅ All prompts created, versioned, and deployed via Keywords AI dashboard
✅ Dynamic variable substitution for personalization
✅ Prompt updates don't require code changes or app redeployment

### System Reliance
✅ Core feature (meal recommendations) depends entirely on Keywords AI
✅ App gracefully degrades if prompts aren't configured
✅ Production-ready error handling and logging
✅ Monitoring and cost tracking via Keywords AI dashboard

This is not a superficial integration - the system actively relies on both Keywords AI Gateway and Prompt Management for its core AI functionality.
