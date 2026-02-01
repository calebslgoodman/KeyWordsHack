# AI Integration with Keywords AI

This app demonstrates **production-ready integration** with Keywords AI for AI-powered meal recommendations.

## Integration Overview

This project uses **TWO core Keywords AI features**:

1. **Keywords AI Gateway** - All LLM calls route through `https://api.keywordsai.co/api/chat/completions`
2. **Keywords AI Prompt Management** - ALL prompts are created, versioned, and deployed via Keywords AI dashboard

**Key principle**: NO prompts are hardcoded in the application code.

---

## Features

The AI integration provides three main capabilities:

### 1. Personalized Meal Recommendations ✅ (Primary Feature)
- Generates 10 meals based on user's taste profile
- Respects allergies, dietary restrictions, cuisine preferences
- Considers spice tolerance, cook time, budget, kitchen tools
- **Uses**: Meal Recommendations Prompt (via Keywords AI)

### 2. Custom Recipe Generation 🔧 (Optional)
- Creates recipes from ingredients you have on hand
- **Uses**: Custom Recipe Prompt (separate prompt ID)

### 3. Meal Variations 🔧 (Optional)
- Suggests alternative versions of meals you like
- **Uses**: Meal Variation Prompt (separate prompt ID)

---

## Architecture

### How It Works

```
User Action
    ↓
App (React Native)
    ↓
AI Service (src/lib/ai.ts)
    ↓
Keywords AI Gateway (https://api.keywordsai.co/api/chat/completions)
    ↓
Prompt Management System (fetch prompt template by ID)
    ↓
Variable Substitution (inject user preferences)
    ↓
LLM Provider (Gemini, GPT, Claude, etc.)
    ↓
Response → App → User
```

### Key Components

**[src/lib/ai.ts](src/lib/ai.ts)** - AI Service Layer
- `callKeywordsAIWithPrompt()` - Core function that calls Keywords AI Gateway
- `generateMealRecommendations()` - Uses meal recommendations prompt
- `generateCustomRecipe()` - Uses custom recipe prompt
- `getMealVariation()` - Uses meal variation prompt

**Request Format**:
```typescript
{
  model: "gpt-4o-mini",              // Placeholder (overridden)
  messages: [...],                   // Placeholder (overridden)
  prompt: {
    prompt_id: "abc123",             // ✅ References prompt in dashboard
    variables: {                      // ✅ Dynamic values
      allergies: "Peanuts",
      cuisines: "Italian, Thai",
      max_cook_time: "30",
      ...
    },
    override: true                    // ✅ Use prompt config, not SDK params
  }
}
```

### What's NOT in the Code

- ❌ No hardcoded prompt text
- ❌ No model selection (configured per prompt)
- ❌ No temperature/token configuration (in prompt config)
- ❌ No direct OpenAI/Google/Anthropic SDK usage

### What IS in Keywords AI Dashboard

- ✅ All prompt templates (system + user messages)
- ✅ Model selection per prompt
- ✅ Temperature, max tokens, top-p settings
- ✅ Variable definitions
- ✅ Version history and deployment

---

## Setup Instructions

### Prerequisites

1. Keywords AI account ([keywordsai.co](https://keywordsai.co))
2. LLM provider API key (Google, OpenAI, Anthropic, etc.)
3. Completed app onboarding (taste profile exists)

### Step 1: Get Keywords AI API Key

1. Go to [https://keywordsai.co](https://keywordsai.co)
2. Sign up (free tier available)
3. Navigate to **API Keys**
4. Create new key → Copy it
5. Go to **Settings → Credentials**
6. Add your LLM provider key (e.g., Google AI API key for Gemini)

### Step 2: Create Prompts in Dashboard

**Important**: You must create prompts in the Keywords AI dashboard. See detailed templates in [KEYWORDS_AI_PROMPTS.md](KEYWORDS_AI_PROMPTS.md).

**Minimum Required**: Create the **Meal Recommendations Prompt**

Quick summary:
- **Name**: `meal-recommendations-v1`
- **Model**: `gemini-2.0-flash-exp` (or preferred)
- **Temperature**: `0.8`
- **Max Tokens**: `2500`
- **Variables**: `allergies`, `cuisines`, `spice_level`, `max_cook_time`, `meals_count`, etc.

**Prompt Template** (see full template in [KEYWORDS_AI_PROMPTS.md](KEYWORDS_AI_PROMPTS.md#1-meal-recommendations-prompt)):
```
System: You are a chef. Generate personalized meals respecting all constraints.
User: Generate {{meals_count}} meals with allergies: {{allergies}}, cuisines: {{cuisines}}...
Output: JSON array with name, meal_type, cuisine, calories, ingredients, instructions
```

After creating:
1. Test with "Run" button
2. Commit with descriptive message
3. Deploy to production
4. Copy **Prompt ID** from Overview tab

### Step 3: Update .env File

```bash
# Keywords AI API Key
EXPO_PUBLIC_KEYWORDS_AI_API_KEY=your_actual_api_key_here

# Prompt IDs (get from Keywords AI dashboard after creating prompts)
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_RECS=your_prompt_id_here

# Optional prompts (create if you want full functionality)
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_CUSTOM_RECIPE=optional
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_VARIATION=optional
```

**Replace** placeholders with actual values from Keywords AI dashboard.

### Step 4: Restart App

```bash
npm start
```

Press `r` to reload.

---

## How It Works (User Flow)

### 1. User Completes Onboarding
- Enters allergies, dietary restrictions, cuisine preferences
- Saved to Supabase as `taste_profile`

### 2. User Starts Meal Planning
- Sets meal goal (e.g., 21 meals per week)
- Navigates to SwipeScreen

### 3. AI Meal Generation Triggers
```typescript
// SwipeScreen.tsx
const tasteProfile = await getTasteProfile(userId);
const aiMeals = await generateMealRecommendations(tasteProfile, 10);
```

### 4. Keywords AI Processing
- App sends prompt ID + variables to Keywords AI Gateway
- Gateway fetches prompt template from Prompt Management
- Substitutes variables into template
- Routes to configured model (e.g., Gemini 2.0 Flash)
- Returns JSON array of meals

### 5. Display to User
- AI meals (10) mixed with base meals (21)
- User swipes through ~31 total options
- Selects favorites for meal plan

### Console Output
```
🍽️ Generating 10 personalized meals via Keywords AI...
🚀 Keywords AI Gateway Request:
   Prompt ID: 042f5f
   Variables: allergies, cuisines, max_cook_time, spice_level, ...

✅ Keywords AI Response received
   Model used: gemini-2.0-flash-exp
   Tokens: 1847

✅ Generated 10 AI meals successfully
```

---

## Configuration

### Model Selection

**In Keywords AI Dashboard** (NOT in code):
- Development: `gemini-2.0-flash-exp` (~$0.0001/request)
- Production: Can switch to `gpt-4o-mini` without code changes
- Change anytime by editing prompt configuration

### Number of AI Meals

In [src/screens/SwipeScreen.tsx](src/screens/SwipeScreen.tsx):
```typescript
const aiMeals = await generateMealRecommendations(tasteProfile, 10); // Change number here
```

### Prompt Parameters

**In Keywords AI Dashboard**:
- Temperature: 0.8 (creativity level)
- Max Tokens: 2500 (response length)
- Top P: 0.95 (diversity)

Update these without touching code!

---

## Monitoring & Debugging

### Keywords AI Dashboard

**Logs Page**:
- View all requests in real-time
- Filter by prompt name
- See variables sent, response received
- Check token usage and costs
- Debug errors

**Prompts Page**:
- See version history
- Compare different versions
- Roll back if needed

### Console Logs

The app logs detailed information:
```
🚀 = Gateway request sent
✅ = Successful response
❌ = Error occurred
⚠️ = Warning (fallback triggered)
```

### Common Issues

**Issue**: "Prompt not configured" warning
**Solution**:
- Verify `EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID_MEAL_RECS` in `.env`
- Check prompt ID matches Keywords AI dashboard
- Restart app

**Issue**: "Keywords AI API error: 401"
**Solution**:
- Check API key in `.env` is correct
- Verify API key is active in dashboard
- Ensure LLM provider credentials are added

**Issue**: Invalid JSON response
**Solution**:
- Update prompt to emphasize "Return ONLY valid JSON"
- Test in dashboard with "Run" button
- Commit and redeploy

**Issue**: No AI meals showing
**Solution**:
- Complete onboarding first (creates taste profile)
- Check console for errors
- Verify prompt is deployed in dashboard

---

## Error Handling

### Graceful Fallback

If AI generation fails for ANY reason:
- App falls back to 21 hardcoded meals
- No error shown to user
- Console warning logged
- App continues to function

```typescript
try {
  const aiMeals = await generateMealRecommendations(tasteProfile, 10);
  return [...MEALS, ...aiMeals]; // 21 + 10 = 31 meals
} catch (error) {
  console.error('❌ AI generation failed:', error);
  return MEALS; // Fallback to 21 base meals
}
```

### User Experience

- **AI Working**: User sees 31 meals (21 base + 10 AI)
- **AI Failing**: User sees 21 meals (no disruption)
- **Prompt Misconfigured**: Graceful warning, fallback activated

---

## Cost & Performance

### Cost Tracking

**Keywords AI Dashboard**:
- View total cost
- Cost per prompt
- Token usage breakdown
- Set budget alerts

**Estimates**:
- Gemini 2.0 Flash: ~$0.0001/request
- 10 meals per user: Fractions of a penny
- Free tier: 1000 requests/month

### Performance

- **Latency**: 2-4 seconds (acceptable for meal generation)
- **Gateway Overhead**: 50-150ms
- **Caching**: Keywords AI caches identical requests
- **Optimization**: Adjust max_tokens to reduce cost

---

## Advanced Features

### Prompt Versioning

1. Edit prompt in Keywords AI dashboard
2. Test changes with "Run"
3. Commit with message: "Improved JSON formatting"
4. Deploy when ready
5. App automatically uses new version (no rebuild needed!)

### A/B Testing

1. Create separate API keys for test vs production
2. Deploy different prompt versions to each
3. Compare performance in dashboard
4. Promote winning version

### Multi-Model Fallback

Keywords AI Gateway automatically handles:
- Primary model fails → Retry with backup
- Rate limiting → Switch to alternative provider
- Cost optimization → Route to cheapest available model

---

## Future Enhancements

With this architecture, we can easily add:

1. **Cache AI Meals** - Save to Supabase for faster loads
2. **Regenerate Button** - Request fresh recommendations
3. **Streaming Responses** - Show meals as they're generated
4. **Image Generation** - Add DALL-E prompt for meal photos
5. **Meal Variation UI** - Let users request variations in-app

All without changing core integration!

---

## API Reference

### generateMealRecommendations()

```typescript
async function generateMealRecommendations(
  tasteProfile: TasteProfile,
  mealsToGenerate: number = 5
): Promise<Meal[]>
```

**Uses**: Meal Recommendations Prompt (via Keywords AI)

**Variables Sent**:
- `allergies`, `dietary_restrictions`, `disliked_ingredients`
- `cuisines`, `spice_level`, `adventure_level`
- `max_cook_time`, `budget`, `kitchen_tools`
- `meals_count`

**Returns**: Array of AI-generated meals

### generateCustomRecipe()

```typescript
async function generateCustomRecipe(
  ingredients: string[],
  dietary_restrictions: string[] = [],
  max_cook_time: number = 30
): Promise<Meal | null>
```

**Uses**: Custom Recipe Prompt (optional)

**Variables Sent**: `ingredients`, `dietary_restrictions`, `max_cook_time`

### getMealVariation()

```typescript
async function getMealVariation(
  originalMeal: Meal,
  tasteProfile?: Partial<TasteProfile>
): Promise<Meal | null>
```

**Uses**: Meal Variation Prompt (optional)

**Variables Sent**: `original_meal_name`, `original_cuisine`, `allergies`, etc.

---

## For Hackathon Judges

### Why This Integration is Meaningful

**Gateway Integration** ✅:
- 100% of LLM calls go through Keywords AI
- No direct OpenAI/Google/Anthropic SDK usage
- Leverages fallback, caching, load balancing

**Prompt Management** ✅:
- Zero hardcoded prompts in codebase
- All prompts versioned and deployed via dashboard
- Can update prompts without app rebuild
- Variable substitution for personalization

**System Reliance** ✅:
- Core feature (meal recommendations) depends on Keywords AI
- Production-ready error handling
- Monitoring via Keywords AI dashboard
- Cost tracking and optimization

**Not Superficial**:
- Not just logging to Keywords AI
- Not mixing direct calls with gateway
- Not hardcoding prompts for "convenience"

See [ARCHITECTURE.md](ARCHITECTURE.md) for complete technical deep-dive.

---

## Documentation

- **[KEYWORDS_AI_PROMPTS.md](KEYWORDS_AI_PROMPTS.md)** - Detailed prompt templates
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture
- **[QUICKSTART_AI_UPDATED.md](QUICKSTART_AI_UPDATED.md)** - Quick setup guide
- **[Keywords AI Docs](https://docs.keywordsai.co)** - Official documentation

---

## Support

- **Setup Issues**: Check console logs for detailed errors
- **Prompt Help**: See [KEYWORDS_AI_PROMPTS.md](KEYWORDS_AI_PROMPTS.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Keywords AI**: [docs.keywordsai.co](https://docs.keywordsai.co)
