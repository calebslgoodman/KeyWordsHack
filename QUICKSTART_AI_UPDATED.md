# Quick Start: Enable AI Meals (Updated)

Get AI-powered personalized meals in 10 minutes using Keywords AI Gateway and Prompt Management.

## Overview

This app uses **Keywords AI** for:
1. **AI Gateway**: All LLM calls go through Keywords AI's unified API
2. **Prompt Management**: Prompts are created, versioned, and deployed via dashboard (not hardcoded)

## Step 1: Get Keywords AI API Key (2 minutes)

1. Go to [https://keywordsai.co](https://keywordsai.co)
2. Sign up (free tier available)
3. Click "API Keys" in dashboard
4. Create new key → Copy it
5. **Important**: Also add your LLM provider credentials (e.g., Google API key for Gemini)
   - Go to Settings → Credentials
   - Add your Google AI API key (or OpenAI, Anthropic, etc.)

## Step 2: Create Prompts (5 minutes)

You need to create prompts in the Keywords AI dashboard. See [KEYWORDS_AI_PROMPTS.md](KEYWORDS_AI_PROMPTS.md) for detailed templates.

### Quick Version: Create Meal Recommendations Prompt

1. In Keywords AI dashboard, go to "Prompts"
2. Click "New Prompt"
3. **Name**: `meal-recommendations-v1`
4. **Model**: `gemini-2.0-flash-exp` (or your preferred model)
5. **Temperature**: `0.8`
6. **Max Tokens**: `2500`

7. **System Message**:
```
You are a creative chef and meal planning expert. Your job is to generate personalized meal recommendations.

RULES:
- NEVER suggest meals with user's allergens
- Respect ALL dietary restrictions
- Match spice level and adventure preferences
- Stay within cooking time constraints

OUTPUT: Return ONLY a valid JSON array. No markdown, no extra text.
```

8. **User Message**:
```
Generate {{meals_count}} personalized meals with these preferences:

CONSTRAINTS:
- Allergies: {{allergies}}
- Dietary Restrictions: {{dietary_restrictions}}
- Disliked Ingredients: {{disliked_ingredients}}

PREFERENCES:
- Cuisines: {{cuisines}}
- Spice Level: {{spice_level}}
- Adventure Level: {{adventure_level}}
- Max Cook Time: {{max_cook_time}} minutes
- Budget: {{budget}}
- Kitchen Tools: {{kitchen_tools}}

Return JSON array with fields: name, meal_type, cuisine, description, calories, cook_time_minutes, ingredients, instructions
```

9. **Add Variables**: In the Variables tab, define all variables:
   - `allergies` → "None"
   - `dietary_restrictions` → "None"
   - `disliked_ingredients` → "None"
   - `cuisines` → "Italian, Mexican"
   - `spice_level` → "mild"
   - `adventure_level` → "balanced"
   - `max_cook_time` → "30"
   - `budget` → "moderate"
   - `kitchen_tools` → "Stovetop, Oven"
   - `meals_count` → "10"

10. Click **"Run"** to test it

11. If it works, click **"Commit"** with message: "Initial meal recommendations prompt"

12. Click **"Deploy"** to production

13. Copy the **Prompt ID** from the Overview tab (e.g., `042f5f`)

## Step 3: Update .env File (1 minute)

Open `.env` file and update:

```bash
# Keywords AI API Key
EXPO_PUBLIC_KEYWORDS_AI_API_KEY=your_actual_api_key_here

# Prompt IDs (get from Keywords AI dashboard)
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_RECS=your_prompt_id_here
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_CUSTOM_RECIPE=optional
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_VARIATION=optional
```

**Important**: Replace `your_actual_api_key_here` and `your_prompt_id_here` with actual values.

## Step 4: Restart App (1 minute)

```bash
npm start
```

Press `r` to reload the app.

## Verify It's Working

1. Open the app
2. Complete onboarding (if not done already)
3. Go to "Plan Your Week"
4. Click "Start Swiping"
5. You should see in console:
   ```
   🍽️ Generating 10 personalized meals via Keywords AI...
   🚀 Keywords AI Gateway Request:
      Prompt ID: 042f5f
      Variables: allergies, cuisines, max_cook_time, ...
   ✅ Keywords AI Response received
   ✅ Generated 10 AI meals successfully
   ```

6. Swipe through meals - you'll have ~31 options (21 base + 10 AI)

## Troubleshooting

### "Prompt not configured" warning

**Issue**: App falls back to hardcoded meals

**Fix**:
1. Check that `EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_RECS` is set in `.env`
2. Verify the prompt ID matches what's in Keywords AI dashboard
3. Restart app with `npm start`

### "Keywords AI API error: 401"

**Issue**: Invalid API key

**Fix**:
1. Verify `EXPO_PUBLIC_KEYWORDS_AI_API_KEY` in `.env` is correct
2. Check API key is active in Keywords AI dashboard
3. Ensure you've added LLM provider credentials (Google, OpenAI, etc.)

### "Invalid JSON response"

**Issue**: Prompt returning wrong format

**Fix**:
1. Go to prompt in Keywords AI dashboard
2. Add emphasis: "Return ONLY valid JSON array. No markdown, no explanations."
3. Test with "Run" button
4. Commit and redeploy

### No AI meals showing up

**Fix**:
1. Check console for error messages (look for 🚀 and ❌ emojis)
2. Verify you completed onboarding (AI needs taste profile)
3. Make sure app was restarted after adding `.env` variables
4. Check Keywords AI dashboard → Logs to see if requests are arriving

## What You Get

With AI enabled:
- **21 base meals** (hardcoded)
- **+10 AI meals** (personalized via Keywords AI)
- **= 31 total meal options** per session

The AI generates fresh recommendations each time based on your preferences!

## Next Steps

### Create Additional Prompts (Optional)

For full functionality, create these prompts:

1. **Custom Recipe Generator** - Create recipes from ingredients
   - See [KEYWORDS_AI_PROMPTS.md](KEYWORDS_AI_PROMPTS.md#2-custom-recipe-prompt)
   - Add prompt ID to `EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_CUSTOM_RECIPE`

2. **Meal Variation Generator** - Create variations of existing meals
   - See [KEYWORDS_AI_PROMPTS.md](KEYWORDS_AI_PROMPTS.md#3-meal-variation-prompt)
   - Add prompt ID to `EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_VARIATION`

### Monitor Usage

1. Go to Keywords AI dashboard → **Logs**
2. Filter by your prompt name
3. See all requests, responses, token usage
4. Debug any issues

### Tune Performance

In Keywords AI dashboard (no code changes needed!):
1. Edit your prompt
2. Adjust temperature (lower = consistent, higher = creative)
3. Change model (try `gpt-4o-mini` vs `gemini-2.0-flash`)
4. Update max tokens
5. Commit and deploy - app uses new version instantly!

## Cost Estimates

- **Keywords AI**: Generous free tier (1000 requests/month)
- **Gemini 2.0 Flash**: ~$0.0001 per request
- **10 AI meals per session**: Fractions of a penny per use

Monitor costs in Keywords AI dashboard.

## Advanced: Understanding the Integration

This app uses Keywords AI's full platform:

### AI Gateway
- **All** LLM calls go through `https://api.keywordsai.co/api/chat/completions`
- No direct calls to Google, OpenAI, or other providers
- Automatic fallback, caching, and load balancing

### Prompt Management
- **Zero** hardcoded prompts in the app code
- All prompts created and versioned in Keywords AI dashboard
- Update prompts without rebuilding the app
- Track prompt performance over time

See [ARCHITECTURE.md](ARCHITECTURE.md) for full technical details.

## Support

- **Setup Issues**: Check console logs for specific errors
- **Prompt Help**: See [KEYWORDS_AI_PROMPTS.md](KEYWORDS_AI_PROMPTS.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Keywords AI Docs**: [docs.keywordsai.co](https://docs.keywordsai.co)
